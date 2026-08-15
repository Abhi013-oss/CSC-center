import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * POST /api/feedback
 * Submit Customer Feedback for Completed Application
 */
export const submitFeedback = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId, rating, comment } = req.body;

  if (!applicationId || !rating) {
    return res.status(400).json({ success: false, message: 'Application ID and rating score (1-5) are required.' });
  }

  const ratingNum = parseInt(rating, 10);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
  }

  // 1. Fetch application and verify user ownership & completed status
  const { data: appRecord, error: appErr } = await supabase
    .from('applications')
    .select('id, user_id, status')
    .eq('application_id', (applicationId || '').trim().toUpperCase())
    .single();

  if (appErr || !appRecord || (appRecord.user_id && appRecord.user_id !== userId)) {
    return res.status(404).json({ success: false, message: 'Application not found or access denied.' });
  }

  if (appRecord.status !== 'completed') {
    return res.status(400).json({ success: false, message: 'Feedback can only be submitted for completed applications.' });
  }

  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .insert([
        {
          application_id: appRecord.id,
          user_id: userId,
          rating: ratingNum,
          comment: comment ? comment.trim() : null
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'Feedback for this application has already been submitted.' });
      }
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
});

/**
 * GET /api/admin/feedback
 * Admin Customer Satisfaction Overview
 */
export const getAdminFeedback = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('id, rating, comment, created_at, applications(application_id, full_name, services(title))')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return res.status(200).json({ success: true, averageRating: 0, totalFeedback: 0, data: [] });
    }

    const total = data.length;
    let sum = 0;
    data.forEach(f => { sum += f.rating; });
    const avg = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;

    const formatted = data.map(f => ({
      id: f.id,
      applicationId: f.applications?.application_id || 'N/A',
      customerName: f.applications?.full_name || 'N/A',
      serviceTitle: f.applications?.services?.title || 'Digital Service',
      rating: f.rating,
      comment: f.comment,
      createdAt: f.created_at
    }));

    return res.status(200).json({
      success: true,
      averageRating: avg,
      totalFeedback: total,
      data: formatted
    });
  } catch (err) {
    return res.status(200).json({ success: true, averageRating: 0, totalFeedback: 0, data: [] });
  }
});
