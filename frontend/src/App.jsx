import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Auth Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Apply from './pages/Apply';
import TrackApplication from './pages/TrackApplication';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PublicNotices from './pages/Notices';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import CustomerSupportPortal from './pages/CustomerSupport';
import Feedback from './pages/Feedback';
import StaffInviteAccept from './pages/StaffInviteAccept';
import NotFound from './pages/NotFound';

// Phase 12 Customer Portal Architecture Pages
import AccountLayout from './account/AccountLayout';
import AccountDashboard from './account/Dashboard';
import CustomerApplications from './account/Applications';
import ApplicationDetails from './pages/ApplicationDetails';
import CustomerDocuments from './account/Documents';
import CustomerPayments from './account/Payments';
import CustomerNotifications from './account/Notifications';
import CustomerAppointments from './account/Appointments';
import CustomerProfile from './account/Profile';
import CustomerSecurity from './account/Security';

// Admin Operations Pages
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Applications from './admin/Applications';
import AdminAppDetails from './admin/ApplicationDetails';
import Users from './admin/Users';
import ServicesAdmin from './admin/Services';
import Payments from './admin/Payments';
import NoticesAdmin from './admin/Notices';
import Documents from './admin/Documents';
import Messages from './admin/Messages';
import NotificationsAdmin from './admin/Notifications';
import Settings from './admin/Settings';
import Profile from './admin/Profile';

// Phase 11, 12 & 13 Advanced Admin Pages
import Analytics from './admin/Analytics';
import Customers from './admin/Customers';
import CustomerDetails from './admin/CustomerDetails';
import Support from './admin/Support';
import Tasks from './admin/Tasks';
import Reports from './admin/Reports';
import WorkQueue from './admin/WorkQueue';
import AppointmentsAdmin from './admin/Appointments';
import Staff from './admin/Staff';
import WorkflowSettings from './admin/WorkflowSettings';
import AuditLogs from './admin/AuditLogs';
import EmailTemplates from './admin/EmailTemplates';
import Holidays from './admin/Holidays';

// Public Main Shell Layout
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetails />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/apply/:serviceId" element={<Apply />} />
              <Route path="/track" element={<TrackApplication />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/notices" element={<PublicNotices />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/accept-staff-invite" element={<StaffInviteAccept />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/feedback/:applicationId"
                element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:applicationId"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/success/:paymentId"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/failure"
                element={
                  <ProtectedRoute>
                    <PaymentFailure />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Customer Self-Service Portal Architecture (/account/*) */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountDashboard />} />
              <Route path="applications" element={<CustomerApplications />} />
              <Route path="applications/:applicationId" element={<ApplicationDetails />} />
              <Route path="documents" element={<CustomerDocuments />} />
              <Route path="payments" element={<CustomerPayments />} />
              <Route path="notifications" element={<CustomerNotifications />} />
              <Route path="support" element={<CustomerSupportPortal />} />
              <Route path="appointments" element={<CustomerAppointments />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="security" element={<CustomerSecurity />} />
            </Route>

            {/* Legacy Fallback Route Wrappers */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerApplications />} />
              <Route path=":applicationId" element={<ApplicationDetails />} />
            </Route>
            <Route
              path="/my-payments"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerPayments />} />
            </Route>

            {/* Admin Routes Architecture (Strictly Protected for Admin Role) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="work-queue" element={<WorkQueue />} />
              <Route path="staff" element={<Staff />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:customerId" element={<CustomerDetails />} />
              <Route path="support" element={<Support />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="appointments" element={<AppointmentsAdmin />} />
              <Route path="workflows" element={<WorkflowSettings />} />
              <Route path="settings/holidays" element={<Holidays />} />
              <Route path="settings/email-templates" element={<EmailTemplates />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="reports" element={<Reports />} />
              <Route path="applications" element={<Applications />} />
              <Route path="applications/:id" element={<AdminAppDetails />} />
              <Route path="users" element={<Users />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="notices" element={<NoticesAdmin />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<Payments />} />
              <Route path="notifications" element={<NotificationsAdmin />} />
              <Route path="documents" element={<Documents />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
