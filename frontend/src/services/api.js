import axios from 'axios';

// Centralized API Client instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor for Auth Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('csc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Token Expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('csc_token');
      localStorage.removeItem('csc_user');
    }
    return Promise.reject(error);
  }
);

// Public Service, Notice & Site Settings API Endpoints
export const getServices = async (params) => {
  const response = await api.get('/services', { params });
  return response.data;
};

export const getServiceBySlug = async (slug) => {
  const response = await api.get(`/services/${slug}`);
  return response.data;
};

export const getNotices = async () => {
  const response = await api.get('/notices');
  return response.data;
};

export const getPublicSettings = async () => {
  const response = await api.get('/site-settings/public');
  return response.data;
};

// Application Submission & Tracking API Endpoints
export const createApplication = async (data) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const trackApplication = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);
  return response.data;
};

export const sendContactMessage = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Authentication API Endpoints
export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (newPassword) => {
  const response = await api.post('/auth/reset-password', { newPassword });
  return response.data;
};

// Customer Application & Document Endpoints
export const getMyApplications = async (params) => {
  const response = await api.get('/my-applications', { params });
  return response.data;
};

export const getMyApplicationDetails = async (applicationId) => {
  const response = await api.get(`/my-applications/${applicationId}`);
  return response.data;
};

export const uploadUserDocument = async (applicationId, file, documentType = 'general_proof') => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentType', documentType);

  const response = await api.post(`/my-applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSignedDocumentUrl = async (applicationId, documentId) => {
  const response = await api.get(`/my-applications/${applicationId}/documents/${documentId}/url`);
  return response.data;
};

export const deleteUserDocument = async (applicationId, documentId) => {
  const response = await api.delete(`/my-applications/${applicationId}/documents/${documentId}`);
  return response.data;
};

// Payment Gateway & Customer Receipts
export const createPaymentOrder = async (applicationId) => {
  const response = await api.post('/payments/order', { applicationId });
  return response.data;
};

export const verifyPayment = async (verificationData) => {
  const response = await api.post('/payments/verify', verificationData);
  return response.data;
};

export const getMyPayments = async (params) => {
  const response = await api.get('/payments/my-payments', { params });
  return response.data;
};

export const getMyPaymentDetails = async (paymentId) => {
  const response = await api.get(`/payments/my-payments/${paymentId}`);
  return response.data;
};

// Admin Operations & Dashboard API Endpoints
export const getAdminMe = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

export const getDashboardStats = async (params) => {
  const response = await api.get('/admin/dashboard/stats', { params });
  return response.data;
};

export const getStatusDistribution = async () => {
  const response = await api.get('/admin/dashboard/status-distribution');
  return response.data;
};

export const getServicePerformance = async () => {
  const response = await api.get('/admin/dashboard/service-performance');
  return response.data;
};

export const getApplicationTrend = async () => {
  const response = await api.get('/admin/dashboard/application-trend');
  return response.data;
};

export const getAdminApplications = async (params) => {
  const response = await api.get('/admin/applications', { params });
  return response.data;
};

export const getAdminApplicationDetails = async (applicationId) => {
  const response = await api.get(`/admin/applications/${applicationId}`);
  return response.data;
};

export const getAdminSignedDocumentUrl = async (applicationId, documentId) => {
  const response = await api.get(`/admin/applications/${applicationId}/documents/${documentId}/url`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, statusData) => {
  const response = await api.patch(`/admin/applications/${applicationId}/status`, statusData);
  return response.data;
};

export const getAdminUsers = async (params) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getAdminUserDetails = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
  return response.data;
};

export const getAdminServices = async () => {
  const response = await api.get('/admin/services');
  return response.data;
};

export const createService = async (data) => {
  const response = await api.post('/admin/services', data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/admin/services/${id}`, data);
  return response.data;
};

export const toggleServiceStatus = async (id, statusData) => {
  const response = await api.patch(`/admin/services/${id}/status`, statusData);
  return response.data;
};

export const getAdminNotices = async () => {
  const response = await api.get('/admin/notices');
  return response.data;
};

export const createNotice = async (data) => {
  const response = await api.post('/admin/notices', data);
  return response.data;
};

export const updateNotice = async (id, data) => {
  const response = await api.put(`/admin/notices/${id}`, data);
  return response.data;
};

export const toggleNoticePublish = async (id, isPublished) => {
  const response = await api.patch(`/admin/notices/${id}/publish`, { isPublished });
  return response.data;
};

export const deleteNotice = async (id) => {
  const response = await api.delete(`/admin/notices/${id}`);
  return response.data;
};

export const getAdminMessages = async (params) => {
  const response = await api.get('/admin/messages', { params });
  return response.data;
};

export const getAdminMessageDetails = async (id) => {
  const response = await api.get(`/admin/messages/${id}`);
  return response.data;
};

export const updateMessageStatus = async (id, status) => {
  const response = await api.patch(`/admin/messages/${id}/status`, { status });
  return response.data;
};

export const getAdminPayments = async (params) => {
  const response = await api.get('/admin/payments', { params });
  return response.data;
};

export const getAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (data) => {
  const response = await api.put('/admin/settings', data);
  return response.data;
};

export const getAdminNotifications = async (params) => {
  const response = await api.get('/notifications/admin', { params });
  return response.data;
};

export const retryNotification = async (id) => {
  const response = await api.post(`/notifications/admin/${id}/retry`);
  return response.data;
};

// Phase 11 Advanced Operations Endpoints
export const getAnalyticsOverview = async (params) => {
  const response = await api.get('/admin/analytics/overview', { params });
  return response.data;
};

export const getFunnelAnalytics = async () => {
  const response = await api.get('/admin/analytics/funnel');
  return response.data;
};

export const getServiceAnalytics = async () => {
  const response = await api.get('/admin/analytics/services');
  return response.data;
};

export const getAdminCustomers = async (params) => {
  const response = await api.get('/admin/customers', { params });
  return response.data;
};

export const getAdminCustomerDetails = async (customerId) => {
  const response = await api.get(`/admin/customers/${customerId}`);
  return response.data;
};

export const createCustomerNote = async (customerId, note) => {
  const response = await api.post(`/admin/customers/${customerId}/notes`, { note });
  return response.data;
};

export const createSupportTicket = async (ticketData) => {
  const response = await api.post('/support', ticketData);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get('/support/my-tickets');
  return response.data;
};

export const getTicketDetails = async (ticketId) => {
  const response = await api.get(`/support/my-tickets/${ticketId}`);
  return response.data;
};

export const getAdminTickets = async (params) => {
  const response = await api.get('/support/admin', { params });
  return response.data;
};

export const addSupportMessage = async (ticketId, message) => {
  const response = await api.post(`/support/${ticketId}/messages`, { message });
  return response.data;
};

export const updateTicketStatus = async (ticketId, statusData) => {
  const response = await api.patch(`/support/admin/${ticketId}/status`, statusData);
  return response.data;
};

export const getAdminTasks = async (params) => {
  const response = await api.get('/admin/tasks', { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/admin/tasks', taskData);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/admin/tasks/${id}/status`, { status });
  return response.data;
};

export const getWorkQueue = async () => {
  const response = await api.get('/admin/tasks/work-queue');
  return response.data;
};

export const getAdminReportData = async (type, params) => {
  const response = await api.get(`/admin/reports/${type}`, { params });
  return response.data;
};

export const exportReportCsvUrl = (type) => {
  return `${API_BASE_URL}/admin/reports/${type}/export`;
};

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getAdminFeedback = async () => {
  const response = await api.get('/feedback/admin');
  return response.data;
};

// Phase 12 Customer Portal & Appointments Endpoints
export const getAccountDashboard = async () => {
  const response = await api.get('/account/dashboard');
  return response.data;
};

export const getAccountNotifications = async () => {
  const response = await api.get('/account/notifications');
  return response.data;
};

export const updateCustomerAccountProfile = async (data) => {
  const response = await api.put('/account/profile', data);
  return response.data;
};

export const replaceCustomerDocument = async (documentId, file) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await api.post(`/account/documents/${documentId}/replace`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const downloadCustomerDocumentUrl = async (documentId) => {
  const response = await api.get(`/account/documents/${documentId}/download`);
  return response.data;
};

export const getAvailableSlots = async (date) => {
  const response = await api.get('/appointments/slots', { params: { date } });
  return response.data;
};

export const bookAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get('/appointments/my-appointments');
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.patch(`/appointments/${id}/cancel`);
  return response.data;
};

export const getAdminAppointments = async () => {
  const response = await api.get('/appointments/admin');
  return response.data;
};

export const updateAdminAppointmentStatus = async (id, status) => {
  const response = await api.patch(`/appointments/admin/${id}/status`, { status });
  return response.data;
};

// Phase 13 Staff Roster, Workflows & Audit Log Endpoints
export const getStaffRoster = async () => {
  const response = await api.get('/admin/staff');
  return response.data;
};

export const createStaffInvitation = async (inviteData) => {
  const response = await api.post('/admin/staff/invite', inviteData);
  return response.data;
};

export const acceptStaffInvitation = async (activationData) => {
  const response = await api.post('/admin/staff/activate', activationData);
  return response.data;
};

export const updateStaffRoleStatus = async (staffId, data) => {
  const response = await api.patch(`/admin/staff/${staffId}/status`, data);
  return response.data;
};

export const getWorkflowSettings = async () => {
  const response = await api.get('/admin/workflows');
  return response.data;
};

export const getEmailTemplates = async () => {
  const response = await api.get('/admin/workflows/email-templates');
  return response.data;
};

export const getCenterHolidays = async () => {
  const response = await api.get('/admin/workflows/holidays');
  return response.data;
};

export const createCenterHoliday = async (holidayData) => {
  const response = await api.post('/admin/workflows/holidays', holidayData);
  return response.data;
};

export const getAuditLogs = async (params) => {
  const response = await api.get('/admin/audit-logs', { params });
  return response.data;
};

export default api;
