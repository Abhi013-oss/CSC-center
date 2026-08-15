import express from 'express';
import {
  submitFeedback,
  getAdminFeedback
} from '../controllers/feedbackController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, submitFeedback);
router.get('/admin', requireAuth, requireAdmin, getAdminFeedback);

export default router;
