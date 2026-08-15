import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', getAuditLogs);

export default router;
