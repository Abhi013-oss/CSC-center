import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { getAnalyticsOverview, getFunnelAnalytics, getServiceAnalytics } from '../services/api';
import { BarChart3, TrendingUp, Users, CreditCard, FileText, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const Analytics = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Business Intelligence & Analytics';
  }, []);

  const [range, setRange] = useState('30days');
  const [overview, setOverview] = useState(null);
  const [funnel, setFunnel] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      const [ovRes, fnRes, svRes] = await Promise.all([
        getAnalyticsOverview({ range }),
        getFunnelAnalytics(),
        getServiceAnalytics()
      ]);

      if (ovRes && ovRes.success && ovRes.data) {
        setOverview(ovRes.data.summary);
      }
      if (fnRes && fnRes.success) {
        setFunnel(fnRes.data || []);
      }
      if (svRes && svRes.success) {
        setServiceStats(svRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  return (
    <div className="space-y-8">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Business Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            100% real database metrics for application demand, revenue, conversion rates, and service ranking.
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="form-input text-xs py-2.5 sm:w-44 font-semibold shrink-0"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="this_year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Calculating database analytics..." />
      ) : overview && (
        <div className="space-y-8">
          
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                <span>Total Revenue</span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                ₹{overview.totalRevenue}
              </div>
              <p className="text-[11px] text-slate-400">Verified paid transactions</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                <span>Applications</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {overview.totalApplications}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">Completion Rate: {overview.completionRate}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                <span>Registered Customers</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {overview.totalCustomers}
              </div>
              <p className="text-[11px] text-slate-400">Customer accounts</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                <span>Open Support Tickets</span>
                <BarChart3 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {overview.openSupportTickets}
              </div>
              <p className="text-[11px] text-amber-600 font-medium">Active help requests</p>
            </div>

          </div>

          {/* Conversion Funnel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Measured Conversion Funnel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {funnel.map((f, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">{f.stage}</span>
                  <div className="text-xl font-extrabold text-indigo-600 font-mono">{f.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Service Performance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Service Performance Ranking</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Service Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Applications</th>
                    <th className="p-3">Completed</th>
                    <th className="p-3">Completion Rate</th>
                    <th className="p-3 text-right">Verified Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {serviceStats.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{s.title}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">{s.category}</span></td>
                      <td className="p-3 font-mono">{s.totalApplications}</td>
                      <td className="p-3 font-mono text-emerald-700">{s.completedApplications}</td>
                      <td className="p-3 font-bold text-indigo-600">{s.completionRate}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">₹{s.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Analytics;
