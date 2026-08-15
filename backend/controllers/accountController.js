import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/account/dashboard
 * Aggregated Customer Dashboard Summary
 */
export const getAccountDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Customer Applications
    const { data: apps } = await supabase
      .from('applications')
      .select('id, application_id, status, payment_status, created_at, services(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const totalApps = apps ? apps.length : 0;
    let completedApps = 0;
    let pendingPayments = 0;
    let docsRequired = 0;

    (apps || []).forEach(a => {
      if (a.status === 'completed') completedApps++;
      if (a.payment_status === 'pending') pendingPayments++;
      if (a.status === 'document_required') docsRequired++;
    });

    // 2. Open Support Tickets
    const { count: openTickets } = await supabase
      .from('support_tickets')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .in('status', ['open', 'in_progress', 'waiting_customer']);

    // 3. Upcoming Appointment
    const { data: appointment } = await supabase
      .from('appointments')
      .select('id, appointment_number, date, start_time, end_time, status, services(title)')
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(1)
      .single();

    // 4. Notifications
    const { data: notifications } = await supabase
      .from('notifications')
      .select('id, subject, type, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Compute Customer Next Action Banner Prompt
    let nextAction = null;
    if (docsRequired > 0) {
      nextAction = { type: 'document_required', message: `${docsRequired} application(s) require document upload attention.`, link: '/account/documents' };
    } else if (pendingPayments > 0) {
      nextAction = { type: 'payment_pending', message: `${pendingPayments} application(s) have pending payment.`, link: '/account/payments' };
    } else if (appointment) {
      nextAction = { type: 'upcoming_appointment', message: `Upcoming Appointment #${appointment.appointment_number} on ${appointment.date}`, link: '/account/appointments' };
    }

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalApplications: totalApps,
          completedApplications: completedApps,
          pendingPayments,
          documentsRequired: docsRequired,
          openSupportTickets: openTickets || 0
        },
        nextAction,
        recentApplications: (apps || []).slice(0, 5).map(a => ({
          id: a.id,
          applicationId: a.application_id,
          serviceTitle: a.services?.title || 'Digital Service',
          status: a.status,
          paymentStatus: a.payment_status,
          createdAt: a.created_at
        })),
        upcomingAppointment: appointment ? {
          id: appointment.id,
          appointmentNumber: appointment.appointment_number,
          date: appointment.date,
          startTime: appointment.start_time,
          serviceTitle: appointment.services?.title || 'Digital Service',
          status: appointment.status
        } : null,
        recentNotifications: (notifications || []).map(n => ({
          id: n.id,
          subject: n.subject,
          type: n.type,
          createdAt: n.created_at
        }))
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load customer dashboard.' });
  }
});

/**
 * GET /api/account/notifications
 * Customer Notifications Center
 */
export const getAccountNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, subject, type, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * PUT /api/account/profile
 * Customer Profile Update
 */
export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { fullName, mobile } = req.body;

  const updates = {};
  if (fullName) updates.full_name = fullName.trim();
  if (mobile) updates.mobile = mobile.trim();
  updates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, full_name, email, mobile, role, is_active')
      .single();

    if (error || !data) {
      return res.status(400).json({ success: false, message: 'Failed to update profile.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        mobile: data.mobile,
        role: data.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});
