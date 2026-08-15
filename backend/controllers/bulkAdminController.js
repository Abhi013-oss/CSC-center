import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * POST /api/admin/applications/bulk-assign
 * Bulk Application Assignment to Authorized Staff
 */
export const bulkAssignApplications = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { applicationIds, assignedTo, reason } = req.body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Select at least one application.' });
  }

  try {
    let updatedCount = 0;
    let failedCount = 0;

    for (const appId of applicationIds) {
      const { data, error } = await supabase
        .from('applications')
        .update({ assigned_to: assignedTo || null, updated_at: new Date().toISOString() })
        .eq('id', appId)
        .select()
        .single();

      if (error || !data) {
        failedCount++;
      } else {
        updatedCount++;
        // Log assignment history entry
        await supabase.from('application_assignment_history').insert([
          {
            application_id: appId,
            assigned_to: assignedTo || null,
            assigned_by: adminId,
            reason: reason ? reason.trim() : 'Bulk operator assignment'
          }
        ]);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Bulk assignment complete. ${updatedCount} updated, ${failedCount} failed.`,
      results: { updated: updatedCount, failed: failedCount }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Bulk assignment failed.' });
  }
});
