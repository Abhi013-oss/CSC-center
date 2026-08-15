import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { isValidStatus, isValidTransition } from '../utils/applicationState.js';
import { notifyStatusChanged } from '../services/notificationService.js';

/**
 * GET /api/admin/me
 * Verify Admin Role & Token
 */
export const getAdminMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      isAdmin: true,
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
});

/**
 * GET /api/admin/applications
 * Paginated Application Listing for Administrator Desk
 */
export const getAdminApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, service, search } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('applications')
      .select('id, application_id, full_name, mobile, email, status, payment_status, created_at, updated_at, services(title, category)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (service && service !== 'all') {
      query = query.eq('service_id', service);
    }

    if (search) {
      query = query.or(`application_id.ilike.%${search}%,full_name.ilike.%${search}%,mobile.ilike.%${search}%,email.ilike.%${search}%`);
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

    const formatted = data.map(app => ({
      id: app.id,
      applicationId: app.application_id,
      fullName: app.full_name,
      mobile: app.mobile,
      email: app.email,
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
      data: formatted
    });
  } catch (err) {
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
 * GET /api/admin/applications/:applicationId
 * Admin Application Details View
 */
export const getAdminApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  try {
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

    // Query status history audit records
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
        userId: data.user_id,
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
          changedBy: h.changed_by,
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
 * GET /api/admin/applications/:applicationId/documents/:documentId/url
 * Generate short-lived signed URL for Admin Document Review
 */
export const getAdminSignedDocumentUrl = asyncHandler(async (req, res) => {
  const { applicationId, documentId } = req.params;
  const formattedAppId = (applicationId || '').trim().toUpperCase();

  const { data: docRecord, error: docErr } = await supabase
    .from('application_documents')
    .select('id, storage_path, applications(application_id)')
    .eq('id', documentId)
    .single();

  if (docErr || !docRecord || docRecord.applications?.application_id !== formattedAppId) {
    return res.status(404).json({ success: false, message: 'Requested document record not found.' });
  }

  try {
    const { data: signedData, error: signedErr } = await supabase.storage
      .from('application-documents')
      .createSignedUrl(docRecord.storage_path, 120);

    if (signedErr || !signedData || !signedData.signedUrl) {
      return res.status(500).json({ success: false, message: 'Failed to generate signed document URL.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        signedUrl: signedData.signedUrl,
        expiresInSeconds: 120
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error accessing document storage.' });
  }
});

/**
 * PATCH /api/admin/applications/:applicationId/status
 * Admin Application Status Transition & Audit Trail Logging
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { applicationId } = req.params;
  const { status: targetStatus, note } = req.body;

  const formattedAppId = (applicationId || '').trim().toUpperCase();

  // 1. Validate status format
  if (!targetStatus || !isValidStatus(targetStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid target status "${targetStatus}". Valid statuses are: pending, under_review, document_required, approved, completed, rejected.`
    });
  }

  // 2. Fetch current application state
  const { data: appRecord, error: fetchErr } = await supabase
    .from('applications')
    .select('*, services(title)')
    .eq('application_id', formattedAppId)
    .single();

  if (fetchErr || !appRecord) {
    return res.status(404).json({ success: false, message: `Application reference "${formattedAppId}" not found.` });
  }

  const currentStatus = appRecord.status;

  // 3. Enforce Server-Side State Machine Transition Rules (Requirement 21 & 62)
  if (!isValidTransition(currentStatus, targetStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status transition from "${currentStatus}" to "${targetStatus}".`
    });
  }

  // 4. Update Application Status
  const { error: updateErr } = await supabase
    .from('applications')
    .update({
      status: targetStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', appRecord.id);

  if (updateErr) {
    return res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }

  // 5. Create Append-Only Audit Trail Record in application_status_history
  await supabase.from('application_status_history').insert([
    {
      application_id: appRecord.id,
      old_status: currentStatus,
      new_status: targetStatus,
      changed_by: adminId, // Derived server-side!
      note: note || null
    }
  ]);

  // Trigger Email Notification Asynchronously (Decoupled execution)
  notifyStatusChanged(appRecord, currentStatus, targetStatus, note).catch(err => {
    console.warn('[adminController] Asynchronous email status notification warning:', err.message);
  });

  return res.status(200).json({
    success: true,
    message: `Application status updated to "${targetStatus}".`,
    data: {
      applicationId: formattedAppId,
      oldStatus: currentStatus,
      newStatus: targetStatus,
      note: note || null,
      updatedAt: new Date().toISOString()
    }
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Admin management APIs scheduled for later phase.'
  });
});
