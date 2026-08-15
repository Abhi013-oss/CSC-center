import express from 'express';
import {
  getAnalyticsOverview,
  getFunnelAnalytics,
  getServiceAnalytics
} from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/overview', getAnalyticsOverview);
router.get('/funnel', getFunnelAnalytics);
router.get('/services', getServiceAnalytics);

export default router;
