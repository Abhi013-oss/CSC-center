import express from 'express';
import {
  getAdminReportData,
  exportReportCsv
} from '../controllers/reportController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/:type', getAdminReportData);
router.get('/:type/export', exportReportCsv);

export default router;
