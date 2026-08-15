import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendEmail } from '../services/emailService.js';

/**
 * GET /api/admin/notifications
 * Paginated Notification Audit Logs
 */
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data) {
      return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formatted = data.map(n => ({
      id: n.id,
      userId: n.user_id,
      applicationId: n.application_id,
      type: n.type,
      channel: n.channel,
      recipient: n.recipient,
      subject: n.subject,
      status: n.status,
      errorMessage: n.error_message,
      retryCount: n.retry_count,
      createdAt: n.created_at,
      sentAt: n.sent_at
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
    return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
  }
});

/**
 * POST /api/admin/notifications/:id/retry
 * Re-attempt delivery of a failed notification log
 */
export const retryNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: notifRecord, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !notifRecord) {
    return res.status(404).json({ success: false, message: 'Notification log not found.' });
  }

  if (notifRecord.retry_count >= 5) {
    return res.status(400).json({ success: false, message: 'Maximum retry limit (5 attempts) exceeded.' });
  }

  try {
    const result = await sendEmail({
      to: notifRecord.recipient,
      subject: notifRecord.subject,
      html: `<p>Notification Retry Event (${notifRecord.type})</p>`
    });

    await supabase
      .from('notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        provider_message_id: result.messageId,
        retry_count: notifRecord.retry_count + 1
      })
      .eq('id', id);

    return res.status(200).json({
      success: true,
      message: 'Notification delivery re-attempted successfully.'
    });
  } catch (err) {
    await supabase
      .from('notifications')
      .update({
        status: 'failed',
        error_message: err.message,
        retry_count: notifRecord.retry_count + 1
      })
      .eq('id', id);

    return res.status(400).json({
      success: false,
      message: `Notification retry failed: ${err.message}`
    });
  }
});
