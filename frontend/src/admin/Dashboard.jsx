import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  getDashboardStats,
  getStatusDistribution,
  getServicePerformance,
  getAdminApplications
} from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Grid,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Doc Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const Dashboard = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Real-Time Operational Dashboard';
  }, []);

  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsRes, distRes, perfRes, appsRes] = await Promise.all([
        getDashboardStats({ range: dateRange }),
        getStatusDistribution(),
        getServicePerformance(),
        getAdminApplications({ page: 1, limit: 5 })
      ]);

      if (statsRes && statsRes.success) setStats(statsRes.data);
      if (distRes && distRes.success) setDistribution(distRes.data || []);
      if (perfRes && perfRes.success) setPerformance(perfRes.data || []);
      if (appsRes && appsRes.success) setRecentApps(appsRes.data || []);
    } catch (err) {
      console.error('[Dashboard.jsx] Analytics error:', err);
      setError('Failed to load real-time analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  if (loading && !stats) {
    return <Loading message="Querying real-time database analytics..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header & Date Range Filter (Requirement 10) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Operational Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real database analytics directly calculated from active application records.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-transparent outline-none pr-2 cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* Real Statistics Metric Cards (Requirement 8) */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Apps</span>
            <div className="text-2xl font-black text-slate-900">{stats.totalApplications}</div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
            <span className="text-xs text-amber-700 font-semibold uppercase">Pending</span>
            <div className="text-2xl font-black text-amber-900">{stats.pendingApplications}</div>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 shadow-xs space-y-2">
            <span className="text-xs text-blue-700 font-semibold uppercase">Under Review</span>
            <div className="text-2xl font-black text-blue-900">{stats.underReviewApplications}</div>
          </div>

          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 shadow-xs space-y-2">
            <span className="text-xs text-purple-700 font-semibold uppercase">Doc Required</span>
            <div className="text-2xl font-black text-purple-900">{stats.documentRequiredApplications}</div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
            <span className="text-xs text-emerald-700 font-semibold uppercase">Completed</span>
            <div className="text-2xl font-black text-emerald-900">{stats.completedApplications}</div>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 shadow-xs space-y-2">
            <span className="text-xs text-indigo-700 font-semibold uppercase">Customers</span>
            <div className="text-2xl font-black text-indigo-900">{stats.totalUsers}</div>
          </div>

        </div>
      )}

      {/* Analytics Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Status Distribution Summary */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Application Status Distribution</h3>
          </div>

          {distribution.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No application records found.</p>
          ) : (
            <div className="space-y-3">
              {distribution.map(d => {
                const total = stats?.totalApplications || 1;
                const pct = Math.round((d.count / total) * 100);
                return (
                  <div key={d.status} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="capitalize">{d.status.replace('_', ' ')}</span>
                      <span>{d.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Services Performance */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Top Demanded Services</h3>
          </div>

          {performance.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No service demand data available.</p>
          ) : (
            <div className="space-y-3">
              {performance.map(p => (
                <div key={p.service} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                  <span>{p.service}</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{p.count} applications</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Applications Table (Requirement 14) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
          <Link to="/admin/applications" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
            View All Applications <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No recent applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentApps.map(app => (
                  <tr key={app.id || app.applicationId} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{app.applicationId}</td>
                    <td className="p-3">{app.fullName}</td>
                    <td className="p-3">{app.serviceTitle}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                        statusBadges[app.status]?.color || 'bg-slate-100 text-slate-800'
                      }`}>
                        {statusBadges[app.status]?.label || app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/applications/${app.applicationId}`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
