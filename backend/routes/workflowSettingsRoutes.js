import express from 'express';
import {
  getWorkflowSettings,
  getEmailTemplates,
  getCenterHolidays,
  createCenterHoliday
} from '../controllers/workflowSettingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', getWorkflowSettings);
router.get('/email-templates', getEmailTemplates);
router.get('/holidays', getCenterHolidays);
router.post('/holidays', createCenterHoliday);

export default router;
