import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/audit-logs
 * Audit Logs Reader
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, action } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('admin_audit_logs')
      .select('*, users(full_name, email)', { count: 'exact' });

    if (action) {
      query = query.eq('action', action);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data) {
      return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formatted = data.map(l => ({
      id: l.id,
      actorName: l.users?.full_name || 'System Operator',
      actorEmail: l.users?.email || 'N/A',
      action: l.action,
      targetResource: l.target_resource,
      targetId: l.target_id,
      details: l.details,
      createdAt: l.created_at
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
