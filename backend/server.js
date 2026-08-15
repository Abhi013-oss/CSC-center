import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { validateEnv, env } from './config/env.js';
import { requestIdMiddleware } from './middleware/requestIdMiddleware.js';
import { generalLimiter, authLimiter, contactLimiter, paymentLimiter } from './middleware/rateLimiter.js';

import serviceRoutes from './routes/serviceRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import myApplicationRoutes from './routes/myApplicationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicSettingsRoutes from './routes/publicSettingsRoutes.js';

import analyticsRoutes from './routes/analyticsRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

import accountRoutes from './routes/accountRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

import staffRoutes from './routes/staffRoutes.js';
import workflowSettingsRoutes from './routes/workflowSettingsRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';

import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// 1. Fail-Fast Environment Secret Audit on Startup
validateEnv();

const app = express();
const PORT = env.PORT;
const FRONTEND_URL = env.FRONTEND_URL;

// 2. Request ID & Security Headers Middleware
app.use(requestIdMiddleware);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 3. Strict CORS Origin Configuration
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature', 'X-Webhook-Signature', 'X-Request-ID'],
  credentials: true
}));

// 4. Request Body Parsing with Raw Body Preservation for Webhook Signature Checks
app.use(express.json({
  limit: '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Global Rate Limiter
app.use('/api', generalLimiter);

// 6. API Metadata, Health & Readiness Endpoints
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'CSC Center API',
    version: '1.0.0',
    description: 'Digital Service Center Production Backend API'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ready', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ready',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// 7. Mount Core API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/my-applications', myApplicationRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/site-settings', publicSettingsRoutes);

// 8. Mount Phase 11 & Phase 12 Advanced Operations Routes
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin/tasks', taskRoutes);
app.use('/api/admin/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use('/api/account', accountRoutes);
app.use('/api/appointments', appointmentRoutes);

// 9. Mount Phase 13 Staff Management & Workflow Control Routes
app.use('/api/admin/staff', staffRoutes);
app.use('/api/admin/workflows', workflowSettingsRoutes);
app.use('/api/admin/audit-logs', auditLogRoutes);

// 10. Centralized Error & 404 Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 11. Production Server Startup
app.listen(PORT, () => {
  console.log(`[CSC Production Backend] Server running on http://localhost:${PORT} (${env.NODE_ENV} mode)`);
});

export default app;
