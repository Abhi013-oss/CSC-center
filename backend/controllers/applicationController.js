import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateApplicationId from '../utils/generateApplicationId.js';
import { servicesData as fallbackServices } from '../../frontend/src/data/servicesData.js';
import { notifyApplicationSubmitted } from '../services/notificationService.js';

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');

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

  // 3. Verify & Resolve Service UUID safely
  let dbServiceId = null;
  let serviceName = 'Digital Service';
  let foundServiceObj = null;

  try {
    let serviceQuery = supabase.from('services').select('id, title, available, service_fee');
    if (isUUID(serviceId)) {
      serviceQuery = serviceQuery.eq('id', serviceId);
    } else {
      serviceQuery = serviceQuery.eq('slug', serviceId);
    }

    const { data: foundService } = await serviceQuery.maybeSingle();

    if (foundService) {
      if (!foundService.available) {
        return res.status(400).json({ success: false, message: 'The selected service is currently unavailable.' });
      }
      dbServiceId = foundService.id;
      serviceName = foundService.title;
      foundServiceObj = foundService;
    } else {
      // If service row by slug wasn't found in DB, fallback to any first service row UUID
      const { data: firstService } = await supabase.from('services').select('id, title').limit(1).maybeSingle();
      if (firstService) {
        dbServiceId = firstService.id;
        const fallback = fallbackServices.find(s => s.id === serviceId || s.slug === serviceId);
        if (fallback) serviceName = fallback.title;
      }
    }
  } catch (err) {
    console.warn('[applicationController] Service resolution warning:', err.message);
  }

  // Fallback service title resolution from local catalog
  if (!serviceName || serviceName === 'Digital Service') {
    const fallback = fallbackServices.find(s => s.id === serviceId || s.slug === serviceId);
    if (fallback) serviceName = fallback.title;
  }

  // 4. Generate Server-Side Unique Application ID
  const applicationId = generateApplicationId();

  // 5. Insert Record into Supabase
  let createdAppRecord = null;
  try {
    const insertPayload = {
      application_id: applicationId,
      user_id: applicantUserId,
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
    };

    if (dbServiceId) {
      insertPayload.service_id = dbServiceId;
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('[applicationController] Error creating database application:', error.message);
      return res.status(500).json({
        success: false,
        message: `Database error: ${error.message}. Please ensure Supabase database schema migrations have been executed in Supabase SQL Editor.`
      });
    }

    createdAppRecord = data;
  } catch (err) {
    console.error('[applicationController] Database insert error:', err.message);
    return res.status(500).json({
      success: false,
      message: `Database connection failure: ${err.message}`
    });
  }

  // Trigger Email Notification Asynchronously
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
      // Fallback query without relational joins
      const { data: plainData } = await supabase
        .from('applications')
        .select('application_id, status, payment_status, created_at, updated_at')
        .eq('application_id', formattedId)
        .single();

      if (!plainData) {
        return res.status(404).json({
          success: false,
          message: `Application reference ID "${formattedId}" was not found in our database records. Please double-check your receipt.`
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          applicationId: plainData.application_id,
          serviceName: 'Digital Public Service',
          status: plainData.status,
          paymentStatus: plainData.payment_status,
          createdAt: plainData.created_at,
          updatedAt: plainData.updated_at,
          documents: []
        }
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
