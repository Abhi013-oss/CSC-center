import express from 'express';
import {
  createSupportTicket,
  getMyTickets,
  getTicketDetails,
  getAdminTickets,
  addSupportMessage,
  updateTicketStatus
} from '../controllers/supportController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer Support Endpoints
router.post('/', requireAuth, createSupportTicket);
router.get('/my-tickets', requireAuth, getMyTickets);
router.get('/my-tickets/:ticketId', requireAuth, getTicketDetails);

// Support Conversation Thread Endpoint (Accessible by Customer owner or Admin)
router.post('/:ticketId/messages', requireAuth, addSupportMessage);

// Admin Support Operations Desk
router.get('/admin', requireAuth, requireAdmin, getAdminTickets);
router.patch('/admin/:ticketId/status', requireAuth, requireAdmin, updateTicketStatus);

export default router;
