import express from 'express';
import {
  createApplication,
  trackApplication,
  uploadDocument
} from '../controllers/applicationController.js';
import { applicationLimiter } from '../middleware/rateLimiter.js';
import uploadSingleDocument from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', applicationLimiter, createApplication);
router.get('/:applicationId', trackApplication);
router.post('/:applicationId/documents', uploadSingleDocument, uploadDocument);

export default router;
