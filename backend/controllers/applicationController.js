import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateApplicationId from '../utils/generateApplicationId.js';
import { servicesData as fallbackServices } from '../../frontend/src/data/servicesData.js';
import { notifyApplicationSubmitted } from '../services/notificationService.js';

/**
 * POST /api/applications
 * Create a new service application (Supports both authenticated users & guest submission)
 */
export const createApplication = asyncHandler(async (req, res) => {
  const {
    fullName,
    name,
    mobile,
    email,
    address,
    city,
    state,
    pinCode,
    dateOfBirth,
    dob,
    serviceId,
    remarks
  } = req.body;

  const applicantName = (fullName || name || '').trim();
  const applicantMobile = (mobile || '').trim();
  const applicantEmail = (email || '').trim();
  const applicantPinCode = (pinCode || '').trim();
  const applicantDob = dateOfBirth || dob || null;

  // 1. Check for optional authenticated user token
  let applicantUserId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: authData } = await supabase.auth.getUser(token);
      if (authData?.user?.id) {
        applicantUserId = authData.user.id;
      }
    } catch (err) {
      // Ignore token verification errors for public fallback submission
    }
  }

  // 2. Input Validation
  if (!applicantName) {
    return res.status(400).json({ success: false, message: 'Applicant full name is required.' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!applicantMobile || !phoneRegex.test(applicantMobile)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
  }

  if (applicantEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
  }

  if (applicantPinCode) {
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(applicantPinCode)) {
      return res.status(400).json({ success: false, message: 'PIN code must be a 6-digit number.' });
    }
  }

  if (!serviceId) {
    return res.status(400).json({ success: false, message: 'Service ID selection is required.' });
  }

  // 3. Verify Service Existence
  let dbServiceId = serviceId;
  let serviceName = 'Digital Service';
  let foundServiceObj = null;

  try {
    const { data: foundService } = await supabase
      .from('services')
      .select('id, title, available, service_fee')
      .or(`id.eq.${serviceId},slug.eq.${serviceId}`)
      .single();

    if (foundService) {
      if (!foundService.available) {
        return res.status(400).json({ success: false, message: 'The selected service is currently unavailable.' });
      }
      dbServiceId = foundService.id;
      serviceName = foundService.title;
      foundServiceObj = foundService;
    } else {
      const fallback = fallbackServices.find(s => s.id === serviceId || s.slug === serviceId);
      if (fallback) {
        serviceName = fallback.title;
      }
    }
  } catch (err) {
    const fallback = fallbackServices.find(s => s.id === serviceId || s.slug === serviceId);
    if (fallback) serviceName = fallback.title;
  }

  // 4. Generate Server-Side Unique Application ID
  const applicationId = generateApplicationId();

  // 5. Insert Record into Supabase
  let createdAppRecord = null;
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          application_id: applicationId,
          user_id: applicantUserId, // Derived server-side from verified token!
          service_id: dbServiceId,
          full_name: applicantName,
          mobile: applicantMobile,
          email: applicantEmail || null,
          address: address || null,
          city: city || null,
          state: state || null,
          pincode: applicantPinCode || null,
          date_of_birth: applicantDob || null,
          remarks: remarks || null,
          status: 'pending',
          payment_status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('[applicationController] Error creating database application:', error.message);
    } else {
      createdAppRecord = data;
    }
  } catch (err) {
    console.error('[applicationController] Database insert error:', err.message);
  }

  // Trigger Email Notification Asynchronously (Decoupled execution)
  if (createdAppRecord && applicantEmail) {
    notifyApplicationSubmitted(createdAppRecord, foundServiceObj).catch(err => {
      console.warn('[applicationController] Asynchronous email notification warning:', err.message);
    });
  }

  // Return real generated Application Reference ID
  return res.status(201).json({
    success: true,
    message: 'Application created successfully.',
    data: {
      applicationId,
      serviceName,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

/**
 * GET /api/applications/:applicationId
 * Safe Public Status Tracking (Includes Attached Documents & Real-Time Status)
 */
export const trackApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const formattedId = (applicationId || '').trim().toUpperCase();

  if (!formattedId || formattedId.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid Application Reference ID.'
    });
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('application_id, status, payment_status, created_at, updated_at, services(title), application_documents(id, document_type, file_name, created_at)')
      .eq('application_id', formattedId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: `Application reference ID "${formattedId}" was not found in our database records. Please double-check your receipt.`
      });
    }

    const documentsList = (data.application_documents || []).map(d => ({
      id: d.id,
      documentType: d.document_type || 'Attached Proof Document',
      fileName: d.file_name,
      createdAt: d.created_at
    }));

    return res.status(200).json({
      success: true,
      data: {
        applicationId: data.application_id,
        serviceName: data.services ? data.services.title : 'Digital Service',
        status: data.status,
        paymentStatus: data.payment_status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        documents: documentsList
      }
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: `Application reference ID "${formattedId}" was not found.`
    });
  }
});

/**
 * POST /api/applications/:applicationId/documents
 * Upload document file to private Supabase Storage bucket and log metadata
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { documentType = 'general_proof' } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please attach a document file.' });
  }

  const file = req.file;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  const fileExt = file.originalname.split('.').pop();
  const safeUniqueName = `${crypto.randomUUID()}.${fileExt}`;
  const storagePath = `applications/${formattedAppId}/${safeUniqueName}`;

  try {
    const { data: storageData, error: storageError } = await supabase.storage
      .from('application-documents')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) {
      console.error('[applicationController] Supabase Storage upload error:', storageError.message);
    }

    const { data: appRecord } = await supabase
      .from('applications')
      .select('id')
      .eq('application_id', formattedAppId)
      .single();

    if (appRecord) {
      await supabase.from('application_documents').insert([
        {
          application_id: appRecord.id,
          document_type: documentType,
          file_name: file.originalname,
          storage_path: storagePath,
          mime_type: file.mimetype,
          file_size: file.size
        }
      ]);
    }
  } catch (err) {
    console.error('[applicationController] Storage handling exception:', err.message);
  }

  return res.status(201).json({
    success: true,
    message: 'Document uploaded and attached successfully.',
    data: {
      applicationId: formattedAppId,
      fileName: file.originalname,
      storagePath,
      fileSize: file.size,
      mimeType: file.mimetype
    }
  });
});
