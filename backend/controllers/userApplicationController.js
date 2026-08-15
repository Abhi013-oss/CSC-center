import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/my-applications
 * Retrieve paginated applications belonging strictly to the authenticated user.
 * IDOR Protection: Always enforces applications.user_id = req.user.id.
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status, service } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('applications')
      .select('id, application_id, status, payment_status, created_at, updated_at, services(title, category)', { count: 'exact' })
      .eq('user_id', userId);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (service && service !== 'all') {
      query = query.eq('service_id', service);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data) {
      return res.status(200).json({
        success: true,
        count: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 0,
        data: []
      });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formattedApplications = data.map(app => ({
      id: app.id,
      applicationId: app.application_id,
      serviceTitle: app.services?.title || 'Digital Service',
      category: app.services?.category || 'General',
      status: app.status,
      paymentStatus: app.payment_status,
      createdAt: app.created_at,
      updatedAt: app.updated_at
    }));

    return res.status(200).json({
      success: true,
      count: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: formattedApplications
    });
  } catch (err) {
    console.error('[userApplicationController] Error fetching my applications:', err.message);
    return res.status(200).json({
      success: true,
      count: 0,
      page: pageNum,
      limit: limitNum,
      totalPages: 0,
      data: []
    });
  }
});

/**
 * GET /api/my-applications/:applicationId
 * Retrieve specific application details belonging strictly to authenticated user.
 * IDOR Protection: Verifies applications.user_id = req.user.id.
 */
export const getMyApplicationDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
    // 1. Query application details
    const { data, error } = await supabase
      .from('applications')
      .select('*, services(title, category), application_documents(*)')
      .eq('application_id', formattedAppId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: `Application reference "${formattedAppId}" was not found.`
      });
    }

    // 2. Mandatory IDOR Ownership Check (Requirement 17, 38 & 69)
    if (data.user_id && data.user_id !== userId) {
      return res.status(404).json({
        success: false,
        message: `Application reference "${formattedAppId}" was not found.`
      });
    }

    // 3. Query status history audit trail
    const { data: statusHistory } = await supabase
      .from('application_status_history')
      .select('*')
      .eq('application_id', data.id)
      .order('created_at', { ascending: true });

    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        applicationId: data.application_id,
        serviceTitle: data.services?.title || 'Digital Service',
        category: data.services?.category || 'General',
        fullName: data.full_name,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        dateOfBirth: data.date_of_birth,
        remarks: data.remarks,
        status: data.status,
        paymentStatus: data.payment_status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        documents: (data.application_documents || []).map(doc => ({
          id: doc.id,
          documentType: doc.document_type,
          fileName: doc.file_name,
          mimeType: doc.mime_type,
          fileSize: doc.file_size,
          createdAt: doc.created_at
        })),
        statusHistory: (statusHistory || []).map(h => ({
          id: h.id,
          oldStatus: h.old_status,
          newStatus: h.new_status,
          note: h.note,
          createdAt: h.created_at
        }))
      }
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: `Application reference "${formattedAppId}" was not found.`
    });
  }
});

/**
 * POST /api/my-applications/:applicationId/documents
 * Secure customer document upload to private Supabase Storage
 */
export const uploadUserDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId } = req.params;
  const { documentType = 'general_proof' } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please attach a document file.' });
  }

  const formattedAppId = (applicationId || '').trim().toUpperCase();

  // 1. Verify application ownership
  const { data: appRecord, error: appErr } = await supabase
    .from('applications')
    .select('id, user_id, status')
    .eq('application_id', formattedAppId)
    .single();

  if (appErr || !appRecord || (appRecord.user_id && appRecord.user_id !== userId)) {
    return res.status(404).json({ success: false, message: 'Application record not found or access denied.' });
  }

  // 2. Lock uploads if application status is approved/completed/rejected
  if (['approved', 'completed', 'rejected'].includes(appRecord.status)) {
    return res.status(400).json({
      success: false,
      message: `Document upload is locked because the application is already ${appRecord.status}.`
    });
  }

  const file = req.file;
  const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const safeUniqueName = `${crypto.randomUUID()}-${sanitizedOriginal}`;
  const storagePath = `applications/${formattedAppId}/${safeUniqueName}`;

  try {
    // 3. Upload file buffer to private Supabase Storage bucket 'application-documents'
    const { error: storageError } = await supabase.storage
      .from('application-documents')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) {
      console.error('[userApplicationController] Storage upload error:', storageError.message);
    }

    // 4. Insert metadata record in application_documents
    const { data: docRecord, error: docErr } = await supabase
      .from('application_documents')
      .insert([
        {
          application_id: appRecord.id,
          document_type: documentType,
          file_name: file.originalname,
          storage_path: storagePath,
          mime_type: file.mimetype,
          file_size: file.size,
          uploaded_by: userId
        }
      ])
      .select()
      .single();

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and attached successfully.',
      data: {
        id: docRecord?.id || crypto.randomUUID(),
        applicationId: formattedAppId,
        documentType,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to process document upload.' });
  }
});

/**
 * GET /api/my-applications/:applicationId/documents/:documentId/url
 * Generate short-lived signed URL (120-second expiration) for private document download
 */
export const getSignedDocumentUrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId, documentId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  // 1. Verify application ownership & document association
  const { data: docRecord, error: docErr } = await supabase
    .from('application_documents')
    .select('id, storage_path, applications(user_id, application_id)')
    .eq('id', documentId)
    .single();

  if (
    docErr ||
    !docRecord ||
    !docRecord.applications ||
    docRecord.applications.application_id !== formattedAppId ||
    (docRecord.applications.user_id && docRecord.applications.user_id !== userId)
  ) {
    return res.status(404).json({ success: false, message: 'Requested document not found or access denied.' });
  }

  try {
    // 2. Generate 120-second signed URL from private storage bucket (Requirement 33 & 34)
    const { data: signedData, error: signedErr } = await supabase.storage
      .from('application-documents')
      .createSignedUrl(docRecord.storage_path, 120);

    if (signedErr || !signedData || !signedData.signedUrl) {
      return res.status(500).json({ success: false, message: 'Failed to generate secure download link.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        signedUrl: signedData.signedUrl,
        expiresInSeconds: 120
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error accessing storage service.' });
  }
});

/**
 * DELETE /api/my-applications/:applicationId/documents/:documentId
 * Delete customer document file and metadata
 */
export const deleteUserDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId, documentId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  const { data: docRecord, error: docErr } = await supabase
    .from('application_documents')
    .select('id, storage_path, applications(user_id, application_id, status)')
    .eq('id', documentId)
    .single();

  if (
    docErr ||
    !docRecord ||
    !docRecord.applications ||
    docRecord.applications.application_id !== formattedAppId ||
    (docRecord.applications.user_id && docRecord.applications.user_id !== userId)
  ) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied.' });
  }

  if (['approved', 'completed', 'rejected'].includes(docRecord.applications.status)) {
    return res.status(400).json({
      success: false,
      message: `Document deletion is locked because application status is ${docRecord.applications.status}.`
    });
  }

  try {
    // Remove from private storage
    await supabase.storage.from('application-documents').remove([docRecord.storage_path]);
    // Delete metadata record
    await supabase.from('application_documents').delete().eq('id', documentId);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete document.' });
  }
});
