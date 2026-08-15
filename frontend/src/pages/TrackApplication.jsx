import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { trackApplication as apiTrackApplication } from '../services/api';
import { Search, Clock, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, FileText, Calendar, Tag, CreditCard, FolderCheck, ExternalLink } from 'lucide-react';

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
    document.title = 'Maa Vindhyawasini Online Centre | Track Real Application & Document Status';
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
    { label: 'Track Application Status', path: '/track' }
  ];

  // Progress Stepper Status Calculation
  const getStepStatus = (currentStatus, stepName) => {
    const order = ['pending', 'under_review', 'document_required', 'approved', 'completed'];
    const currentIndex = order.indexOf(currentStatus);
    
    if (stepName === 'submitted') return true;
    if (stepName === 'under_review') return currentIndex >= 1;
    if (stepName === 'processing') return currentIndex >= 3;
    if (stepName === 'completed') return currentStatus === 'completed' || currentStatus === 'approved';
    return false;
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Bar */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Real-Time Status Tracking Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Application & Document Status
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Enter your unique Application Reference ID (e.g., <code className="bg-slate-200 px-1.5 py-0.5 rounded text-indigo-700 font-mono">CSC-2026-XXXXXX</code>) to view real-time verification and document progress.
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
              <span>{loading ? 'Searching...' : 'Track Real Status'}</span>
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
        {loading && <Loading message="Querying PostgreSQL database for application & document records..." />}

        {/* Live Search Result Card */}
        {statusResult && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Reference ID</span>
                <h3 className="text-xl font-mono font-extrabold text-slate-900">{statusResult.applicationId}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                  statusBadges[statusResult.status]?.color || 'bg-slate-100 text-slate-800 border-slate-200'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> {statusBadges[statusResult.status]?.label || statusResult.status}
                </span>

                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold uppercase ${
                  statusResult.paymentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <CreditCard className="w-3 h-3" /> Fee: {statusResult.paymentStatus}
                </span>
              </div>
            </div>

            {/* Service & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Applied Service</span>
                </div>
                <div className="text-sm font-bold text-slate-800">{statusResult.serviceName}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Date of Submission</span>
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

            {/* Real-Time Processing Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Application Lifecycle Timeline</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className={`p-3 rounded-xl border text-xs font-semibold space-y-1 ${
                  getStepStatus(statusResult.status, 'submitted')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-extrabold text-[10px] uppercase tracking-wider">Step 1</div>
                  <div>Submitted</div>
                </div>

                <div className={`p-3 rounded-xl border text-xs font-semibold space-y-1 ${
                  getStepStatus(statusResult.status, 'under_review')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-extrabold text-[10px] uppercase tracking-wider">Step 2</div>
                  <div>Doc Verification</div>
                </div>

                <div className={`p-3 rounded-xl border text-xs font-semibold space-y-1 ${
                  getStepStatus(statusResult.status, 'processing')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-extrabold text-[10px] uppercase tracking-wider">Step 3</div>
                  <div>Govt Processing</div>
                </div>

                <div className={`p-3 rounded-xl border text-xs font-semibold space-y-1 ${
                  getStepStatus(statusResult.status, 'completed')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <div className="font-extrabold text-[10px] uppercase tracking-wider">Step 4</div>
                  <div>Completed</div>
                </div>
              </div>
            </div>

            {/* Attached Real Documents Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FolderCheck className="w-4 h-4 text-indigo-600" />
                <span>Attached Proof Documents ({statusResult.documents ? statusResult.documents.length : 0})</span>
              </h4>

              {statusResult.documents && statusResult.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {statusResult.documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate">{doc.fileName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.documentType}</p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>No documents attached yet or initial review in progress.</span>
                </div>
              )}
            </div>

            {/* Customer Portal Link Banner */}
            <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-indigo-900">Want to upload additional documents or download receipts?</span>
                <p className="text-slate-600 text-[11px]">Log in to your Customer Portal to manage all application documents safely.</p>
              </div>
              <Link to="/account/documents" className="btn-primary text-xs py-2 px-4 whitespace-nowrap flex items-center gap-1 shrink-0">
                <span>Customer Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackApplication;
