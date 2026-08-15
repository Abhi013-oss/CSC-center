import express from 'express';
import {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAdminAppointments,
  updateAdminAppointmentStatus
} from '../controllers/appointmentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer Appointment Routes
router.get('/slots', requireAuth, getAvailableSlots);
router.post('/', requireAuth, bookAppointment);
router.get('/my-appointments', requireAuth, getMyAppointments);
router.patch('/:id/cancel', requireAuth, cancelAppointment);

// Admin Appointments Operations Desk
router.get('/admin', requireAuth, requireAdmin, getAdminAppointments);
router.patch('/admin/:id/status', requireAuth, requireAdmin, updateAdminAppointmentStatus);

export default router;
