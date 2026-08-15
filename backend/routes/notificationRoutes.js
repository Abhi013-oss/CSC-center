import express from 'express';
import {
  getAdminNotifications,
  retryNotification
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/admin', getAdminNotifications);
router.post('/admin/:id/retry', retryNotification);

export default router;
