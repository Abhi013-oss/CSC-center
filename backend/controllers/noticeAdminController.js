import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/notices
 */
export const getAdminNotices = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = data.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      priority: n.priority,
      isPublished: n.is_published,
      startsAt: n.starts_at,
      expiresAt: n.expires_at,
      createdAt: n.created_at,
      updatedAt: n.updated_at
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * POST /api/admin/notices
 */
export const createNotice = asyncHandler(async (req, res) => {
  const { title, content, type = 'info', priority = 0, startsAt, expiresAt, isPublished = true } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Notice title is required.' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Notice content is required.' });
  }

  const { data, error } = await supabase
    .from('notices')
    .insert([
      {
        title: title.trim(),
        content: content.trim(),
        type,
        priority: parseInt(priority, 10) || 0,
        starts_at: startsAt || new Date().toISOString(),
        expires_at: expiresAt || null,
        is_published: Boolean(isPublished),
        created_by: req.user.id
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create notice.' });
  }

  return res.status(201).json({
    success: true,
    message: 'Notice created successfully.',
    data
  });
});

/**
 * PUT /api/admin/notices/:id
 */
export const updateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, type, priority, startsAt, expiresAt, isPublished } = req.body;

  const updateFields = { updated_at: new Date().toISOString() };
  if (title) updateFields.title = title.trim();
  if (content) updateFields.content = content.trim();
  if (type) updateFields.type = type;
  if (priority !== undefined) updateFields.priority = parseInt(priority, 10) || 0;
  if (startsAt !== undefined) updateFields.starts_at = startsAt;
  if (expiresAt !== undefined) updateFields.expires_at = expiresAt;
  if (isPublished !== undefined) updateFields.is_published = Boolean(isPublished);

  const { data, error } = await supabase
    .from('notices')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update notice.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Notice updated successfully.',
    data
  });
});

/**
 * PATCH /api/admin/notices/:id/publish
 */
export const toggleNoticePublish = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isPublished } = req.body;

  const { data, error } = await supabase
    .from('notices')
    .update({ is_published: Boolean(isPublished), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: 'Failed to update publication status.' });
  }

  return res.status(200).json({
    success: true,
    message: `Notice ${isPublished ? 'published' : 'unpublished'}.`,
    data
  });
});

/**
 * DELETE /api/admin/notices/:id
 */
export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(400).json({ success: false, message: 'Failed to delete notice.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Notice deleted successfully.'
  });
});
