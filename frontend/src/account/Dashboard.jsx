import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import { getAccountDashboard } from '../services/api';
import { FileText, CheckCircle2, CreditCard, FolderArchive, LifeBuoy, Calendar, ArrowRight, AlertTriangle, Bell } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Customer Self-Service Portal | CSC Assistance';
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAccountDashboard();
      if (res && res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to load customer dashboard.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading customer dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading customer portal..." />;

  if (error || !data) return <Alert type="error" title="Error">{error}</Alert>;

  const { summary, nextAction, recentApplications, upcomingAppointment, recentNotifications } = data;

  return (
    <div className="space-y-8">
      <SEO title="Customer Portal Dashboard | CSC Assistance" description="Manage your digital service applications, payments, documents, and support tickets." noIndex={true} />

      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Customer Portal Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Welcome back! Here is a summary of your active service applications, document tasks, and appointments.
        </p>
      </div>

      {/* Prominent Next Action Card Prompt */}
      {nextAction && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">Action Required</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{nextAction.message}</p>
            </div>
          </div>
          <Link to={nextAction.link} className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 shrink-0">
            <span>Take Action</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Customer KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Applications</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">{summary.totalApplications}</div>
          <p className="text-[10px] text-slate-400">Total submitted</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono text-emerald-700">{summary.completedApplications}</div>
          <p className="text-[10px] text-slate-400">Delivered services</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Payments</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono text-amber-700">{summary.pendingPayments}</div>
          <p className="text-[10px] text-slate-400">Pending payment</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Documents</span>
            <FolderArchive className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono text-blue-700">{summary.documentsRequired}</div>
          <p className="text-[10px] text-slate-400">Action needed</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Support</span>
            <LifeBuoy className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono text-purple-700">{summary.openSupportTickets}</div>
          <p className="text-[10px] text-slate-400">Open help tickets</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
            <Link to="/account/applications" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No applications submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((a) => (
                <div key={a.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-indigo-600">{a.applicationId}</span>
                    <p className="font-bold text-slate-900">{a.serviceTitle}</p>
                    <p className="text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right space-y-1 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase bg-white">
                      {a.status}
                    </span>
                    <Link to={`/account/applications/${a.applicationId}`} className="block text-[11px] font-bold text-indigo-600 hover:underline">
                      Track Status
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Appointment & Notifications */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upcoming Appointment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Upcoming Appointment</span>
              </span>
            </h3>

            {upcomingAppointment ? (
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
                <span className="font-mono font-bold text-indigo-700">#{upcomingAppointment.appointmentNumber}</span>
                <p className="font-bold text-slate-900">{upcomingAppointment.serviceTitle}</p>
                <p className="text-slate-600">Date: {upcomingAppointment.date} at {upcomingAppointment.startTime}</p>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-400">No scheduled appointments.</p>
                <Link to="/account/appointments" className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Book Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>Recent Notifications</span>
              </span>
            </h3>

            {recentNotifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notifications yet.</p>
            ) : (
              <div className="space-y-2">
                {recentNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-0.5">
                    <p className="font-semibold text-slate-800">{n.subject}</p>
                    <p className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
