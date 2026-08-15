import express from 'express';
import multer from 'multer';
import {
  getAccountDashboard,
  getAccountNotifications,
  updateCustomerProfile
} from '../controllers/accountController.js';
import {
  replaceDocument,
  downloadCustomerDocument
} from '../controllers/documentWorkflowController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', getAccountDashboard);
router.get('/notifications', getAccountNotifications);
router.put('/profile', updateCustomerProfile);

// Document Workflow Routes
router.post('/documents/:documentId/replace', upload.single('document'), replaceDocument);
router.get('/documents/:documentId/download', downloadCustomerDocument);

export default router;
