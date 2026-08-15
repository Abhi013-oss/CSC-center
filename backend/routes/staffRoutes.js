import express from 'express';
import {
  getStaffRoster,
  createStaffInvitation,
  acceptStaffInvitation,
  updateStaffRoleStatus
} from '../controllers/staffController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// Public Activation Endpoint for Invited Staff
router.post('/activate', acceptStaffInvitation);

// Admin Staff Operations Desk
router.get('/', requireAuth, requirePermission('staff.read'), getStaffRoster);
router.post('/invite', requireAuth, requireAdmin, createStaffInvitation);
router.patch('/:staffId/status', requireAuth, requireAdmin, updateStaffRoleStatus);

export default router;
