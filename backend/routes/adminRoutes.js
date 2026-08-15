import express from 'express';
import {
  getAdminMe,
  getAdminApplications,
  getAdminApplicationDetails,
  getAdminSignedDocumentUrl,
  updateApplicationStatus,
  getDashboardStats as getLegacyStats
} from '../controllers/adminController.js';

import {
  getDashboardStats,
  getStatusDistribution,
  getServicePerformance,
  getApplicationTrend
} from '../controllers/dashboardController.js';

import {
  getAdminUsers,
  getAdminUserDetails,
  updateUserStatus
} from '../controllers/userAdminController.js';

import {
  getAdminServices,
  createService,
  updateService,
  toggleServiceStatus
} from '../controllers/serviceAdminController.js';

import {
  getAdminNotices,
  createNotice,
  updateNotice,
  toggleNoticePublish,
  deleteNotice
} from '../controllers/noticeAdminController.js';

import {
  getAdminMessages,
  getAdminMessageDetails,
  updateMessageStatus
} from '../controllers/messageAdminController.js';

import {
  getAdminPayments,
  getAdminSettings,
  updateAdminSettings
} from '../controllers/settingsAdminController.js';

import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Strict Server-Side Authorization Boundary (Requirement 84)
router.use(requireAuth, requireAdmin);

// Identity & Dashboard Routes
router.get('/me', getAdminMe);
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/status-distribution', getStatusDistribution);
router.get('/dashboard/service-performance', getServicePerformance);
router.get('/dashboard/application-trend', getApplicationTrend);
router.get('/stats', getLegacyStats);

// Application Management Routes
router.get('/applications', getAdminApplications);
router.get('/applications/:applicationId', getAdminApplicationDetails);
router.get('/applications/:applicationId/documents/:documentId/url', getAdminSignedDocumentUrl);
router.patch('/applications/:applicationId/status', updateApplicationStatus);

// User Account Management Routes
router.get('/users', getAdminUsers);
router.get('/users/:userId', getAdminUserDetails);
router.patch('/users/:userId/status', updateUserStatus);

// Service Catalog Management Routes
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.patch('/services/:id/status', toggleServiceStatus);

// Notice Banner Management Routes
router.get('/notices', getAdminNotices);
router.post('/notices', createNotice);
router.put('/notices/:id', updateNotice);
router.patch('/notices/:id/publish', toggleNoticePublish);
router.delete('/notices/:id', deleteNotice);

// Contact Message Management Routes
router.get('/messages', getAdminMessages);
router.get('/messages/:id', getAdminMessageDetails);
router.patch('/messages/:id/status', updateMessageStatus);

// Read-Only Payments & Settings Routes
router.get('/payments', getAdminPayments);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
