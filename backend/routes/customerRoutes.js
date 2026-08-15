import express from 'express';
import {
  getAdminCustomers,
  getAdminCustomerDetails,
  createCustomerNote
} from '../controllers/customerController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', getAdminCustomers);
router.get('/:customerId', getAdminCustomerDetails);
router.post('/:customerId/notes', createCustomerNote);

export default router;
