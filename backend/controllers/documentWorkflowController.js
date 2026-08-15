import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

const BUCKET_NAME = 'application-documents';

/**
 * POST /api/account/documents/:documentId/replace
 * Customer Upload Replacement Document
 */
export const replaceDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { documentId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'Please upload a replacement document file.' });
  }

  try {
    // 1. Fetch document and verify application ownership
    const { data: docRecord, error: docErr } = await supabase
      .from('application_documents')
      .select('id, application_id, storage_path, applications(user_id)')
      .eq('id', documentId)
      .single();

    if (docErr || !docRecord || docRecord.applications?.user_id !== userId) {
      return res.status(404).json({ success: false, message: 'Document not found or access denied.' });
    }

    // 2. Upload replacement file to private bucket
    const fileExt = file.originalname.split('.').pop();
    const newStoragePath = `${docRecord.application_id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newStoragePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadErr) {
      return res.status(500).json({ success: false, message: 'Failed to upload document file.' });
    }

    // 3. Update document record status to uploaded / under_review
    const { data: updatedDoc, error: updateErr } = await supabase
      .from('application_documents')
      .update({
        storage_path: newStoragePath,
        file_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Log document version entry
    await supabase.from('application_document_versions').insert([
      {
        document_id: documentId,
        storage_path: newStoragePath,
        status: 'under_review'
      }
    ]);

    // Automatically transition application status back to under_review
    await supabase.from('applications').update({ status: 'under_review', updated_at: new Date().toISOString() }).eq('id', docRecord.application_id);

    return res.status(200).json({
      success: true,
      message: 'Replacement document uploaded successfully. Application status set to Under Review.',
      data: updatedDoc
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to replace document.' });
  }
});

/**
 * GET /api/account/documents/:documentId/download
 * Customer Download Signed Short-Lived URL (120s)
 */
export const downloadCustomerDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { documentId } = req.params;

  try {
    const { data: docRecord, error: docErr } = await supabase
      .from('application_documents')
      .select('id, storage_path, file_name, applications(user_id)')
      .eq('id', documentId)
      .single();

    if (docErr || !docRecord || docRecord.applications?.user_id !== userId) {
      return res.status(404).json({ success: false, message: 'Document not found or access denied.' });
    }

    const { data: signedData, error: signErr } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(docRecord.storage_path, 120);

    if (signErr || !signedData) {
      return res.status(500).json({ success: false, message: 'Failed to generate secure document download URL.' });
    }

    return res.status(200).json({
      success: true,
      signedUrl: signedData.signedUrl,
      fileName: docRecord.file_name,
      expiresIn: 120
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve document.' });
  }
});
