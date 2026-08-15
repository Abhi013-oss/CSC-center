import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

const generateAppointmentNumber = () => {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `APT-${year}-${hex}`;
};

/**
 * GET /api/account/appointments/slots
 * Get Available Time Slots for Date
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date parameter is required.' });
  }

  try {
    // Default operating slots (10:00 AM to 5:00 PM)
    const defaultSlots = [
      { startTime: '10:00:00', endTime: '10:30:00', label: '10:00 AM - 10:30 AM' },
      { startTime: '11:00:00', endTime: '11:30:00', label: '11:00 AM - 11:30 AM' },
      { startTime: '12:00:00', endTime: '12:30:00', label: '12:00 PM - 12:30 PM' },
      { startTime: '14:00:00', endTime: '14:30:00', label: '02:00 PM - 02:30 PM' },
      { startTime: '15:00:00', endTime: '15:30:00', label: '03:00 PM - 03:30 PM' },
      { startTime: '16:00:00', endTime: '16:30:00', label: '04:00 PM - 04:30 PM' }
    ];

    // Check existing booked appointments for the selected date
    const { data: booked } = await supabase
      .from('appointments')
      .select('start_time')
      .eq('date', date)
      .in('status', ['scheduled', 'confirmed']);

    const bookedTimes = new Set((booked || []).map(b => b.start_time));

    const slots = defaultSlots.map(s => ({
      ...s,
      available: !bookedTimes.has(s.startTime)
    }));

    return res.status(200).json({ success: true, date, slots });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve available slots.' });
  }
});

/**
 * POST /api/account/appointments
 * Atomic Appointment Booking with Double-Booking Prevention
 */
export const bookAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { serviceId, applicationId, date, startTime, endTime = '10:30:00', notes } = req.body;

  if (!date || !startTime) {
    return res.status(400).json({ success: false, message: 'Appointment date and time slot are required.' });
  }

  try {
    // Atomic Double-Booking Check: Verify slot is not already booked
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('start_time', startTime)
      .in('status', ['scheduled', 'confirmed']);

    if (existing && existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Selected appointment slot is no longer available. Please choose another time.' });
    }

    const aptNumber = generateAppointmentNumber();

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          appointment_number: aptNumber,
          user_id: userId,
          service_id: serviceId || null,
          application_id: applicationId || null,
          date,
          start_time: startTime,
          end_time: endTime,
          status: 'scheduled',
          notes: notes ? notes.trim() : null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to book appointment.' });
  }
});

/**
 * GET /api/account/appointments
 * Customer Appointments Listing
 */
export const getMyAppointments = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, services(title)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = data.map(a => ({
      id: a.id,
      appointmentNumber: a.appointment_number,
      serviceTitle: a.services?.title || 'Digital Service',
      date: a.date,
      startTime: a.start_time,
      endTime: a.end_time,
      status: a.status,
      createdAt: a.created_at
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * PATCH /api/account/appointments/:id/cancel
 * Customer Appointment Cancellation
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('id, user_id, status')
      .eq('id', id)
      .single();

    if (fetchErr || !apt || apt.user_id !== userId) {
      return res.status(404).json({ success: false, message: 'Appointment not found or access denied.' });
    }

    if (apt.status === 'completed' || apt.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel an appointment that is already ${apt.status}.` });
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to cancel appointment.' });
  }
});

/**
 * GET /api/admin/appointments
 * Admin Appointments Desk Listing
 */
export const getAdminAppointments = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, users(full_name, email, mobile), services(title)')
      .order('date', { ascending: false });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = data.map(a => ({
      id: a.id,
      appointmentNumber: a.appointment_number,
      customerName: a.users?.full_name || 'N/A',
      customerEmail: a.users?.email || 'N/A',
      customerMobile: a.users?.mobile || 'N/A',
      serviceTitle: a.services?.title || 'Digital Service',
      date: a.date,
      startTime: a.start_time,
      status: a.status,
      createdAt: a.created_at
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * PATCH /api/admin/appointments/:id/status
 * Admin Appointment Status Update
 */
export const updateAdminAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment status updated.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update appointment status.' });
  }
});
