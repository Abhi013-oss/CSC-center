import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/messages
 */
export const getAdminMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,mobile.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
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

    const formatted = data.map(m => ({
      id: m.id,
      name: m.name,
      mobile: m.mobile,
      email: m.email,
      subject: m.subject,
      message: m.message,
      status: m.status,
      createdAt: m.created_at,
      updatedAt: m.updated_at
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
 * GET /api/admin/messages/:id
 */
export const getAdminMessageDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }
});

/**
 * PATCH /api/admin/messages/:id/status
 */
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['new', 'read', 'in_progress', 'resolved'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid message status.' });
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return res.status(400).json({ success: false, message: 'Failed to update message status.' });
  }

  return res.status(200).json({
    success: true,
    message: `Message status updated to "${status}".`,
    data
  });
});
