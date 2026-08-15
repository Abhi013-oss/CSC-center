import express from 'express';
import {
  getMyApplications,
  getMyApplicationDetails,
  uploadUserDocument,
  getSignedDocumentUrl,
  deleteUserDocument
} from '../controllers/userApplicationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import uploadSingleDocument from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getMyApplications);
router.get('/:applicationId', requireAuth, getMyApplicationDetails);
router.post('/:applicationId/documents', requireAuth, uploadSingleDocument, uploadUserDocument);
router.get('/:applicationId/documents/:documentId/url', requireAuth, getSignedDocumentUrl);
router.delete('/:applicationId/documents/:documentId', requireAuth, deleteUserDocument);

export default router;
