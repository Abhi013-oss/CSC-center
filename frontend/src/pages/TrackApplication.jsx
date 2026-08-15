import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { trackApplication as apiTrackApplication } from '../services/api';
import { Search, Clock, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, FileText, Calendar, Tag } from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Document Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const TrackApplication = () => {
  const [appId, setAppId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null);

  useEffect(() => {
    document.title = 'CSC Center | Track Application';
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setStatusResult(null);

    const formatted = appId.trim().toUpperCase();
    if (!formatted) {
      setError('Please enter your Application Reference ID.');
      return;
    }

    if (formatted.length < 5) {
      setError('Application Reference ID must be at least 5 characters long (e.g., CSC-2026-123456).');
      return;
    }

    setLoading(true);

    try {
      const res = await apiTrackApplication(formatted);
      if (res && res.success && res.data) {
        setStatusResult(res.data);
      } else {
        setError(res.message || 'Application not found. Please check your application ID.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Application not found. Please check your application ID.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Track Application', path: '/track' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Bar */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Status Tracking Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Application Status
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Enter your application reference ID provided on your submission receipt.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Ref ID (e.g. CSC-2026-123456)"
                value={appId}
                onChange={(e) => {
                  setAppId(e.target.value);
                  if (error) setError('');
                }}
                className={`form-input pl-12 pr-4 py-3 text-base ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base flex items-center justify-center gap-2 whitespace-nowrap shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Searching...' : 'Track Status'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <p className="text-xs text-red-600 font-medium pl-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && <Loading message="Querying application status..." />}

        {/* Live Search Result Card */}
        {statusResult && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Reference</span>
                <h3 className="text-xl font-mono font-extrabold text-slate-900">{statusResult.applicationId}</h3>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                statusBadges[statusResult.status]?.color || 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                <Clock className="w-3.5 h-3.5" /> {statusBadges[statusResult.status]?.label || statusResult.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Service Name</span>
                </div>
                <div className="text-sm font-bold text-slate-800">{statusResult.serviceName}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Submission Date</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {new Date(statusResult.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <Alert type="info" title="Center Support Note">
              If additional document scans or verification steps are required for your application, our operator will contact you at your registered mobile number.
            </Alert>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackApplication;
