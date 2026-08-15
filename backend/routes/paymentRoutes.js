import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getMyPayments,
  getMyPaymentDetails
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer Authenticated Payment Endpoints
router.post('/order', requireAuth, createPaymentOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/my-payments', requireAuth, getMyPayments);
router.get('/my-payments/:paymentId', requireAuth, getMyPaymentDetails);

// Webhook Endpoint (Isolated from customer JWT auth; uses raw body signature verification)
router.post('/webhook', handleWebhook);

export default router;
