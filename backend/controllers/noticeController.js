import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/notices
 * Returns active published notices for top notice bar
 */
export const getNotices = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const now = new Date().toISOString();

  try {
    let query = supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .lte('starts_at', now)
      .or(`expires_at.is.null,expires_at.gt.${now}`);

    if (type) {
      query = query.eq('type', type);
    }

    query = query.order('priority', { ascending: false }).order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback default notice if database notices table has no active records
      return res.status(200).json({
        success: true,
        data: [
          {
            id: 'notice-default-1',
            title: 'Notice',
            content: 'Important: Online service assistance available. Contact our center for document requirements.',
            type: 'info',
            isPublished: true,
            createdAt: new Date().toISOString()
          }
        ]
      });
    }

    const formattedNotices = data.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      isPublished: n.is_published,
      priority: n.priority,
      startsAt: n.starts_at,
      expiresAt: n.expires_at,
      createdAt: n.created_at
    }));

    return res.status(200).json({
      success: true,
      data: formattedNotices
    });
  } catch (err) {
    console.error('[noticeController] Error fetching notices:', err.message);
    return res.status(200).json({
      success: true,
      data: [
        {
          id: 'notice-default-1',
          title: 'Notice',
          content: 'Important: Online service assistance available. Contact our center for document requirements.',
          type: 'info',
          isPublished: true,
          createdAt: new Date().toISOString()
        }
      ]
    });
  }
});
