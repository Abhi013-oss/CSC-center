import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getMyApplications } from '../services/api';
import { FileText, Clock, ArrowRight, Tag, Calendar, PlusCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Document Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const filterTabs = [
  { key: 'all', label: 'All Applications' },
  { key: 'pending', label: 'Pending' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'document_required', label: 'Doc Required' },
  { key: 'approved', label: 'Approved' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected', label: 'Rejected' }
];

const MyApplications = () => {
  useEffect(() => {
    document.title = 'CSC Center | My Applications History';
  }, []);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyApplications({
        page,
        limit: 10,
        status: activeTab !== 'all' ? activeTab : undefined
      });

      if (res && res.success) {
        setApplications(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to fetch application records.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab, page]);

  const breadcrumbs = [
    { label: 'Customer Account', path: '/account' },
    { label: 'My Applications', path: '/my-applications' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Application History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review and track all your online service submissions in one place.
            </p>
          </div>

          <Link
            to="/services"
            className="btn-primary text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for New Service</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <Alert type="error" title="Error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Loading message="Loading application records..." />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Applications Found"
            description="No applications matching your active filter. Browse our catalog to apply online."
            actionText="Browse Available Services"
            actionLink="/services"
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id || app.applicationId}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reference ID</span>
                    <h3 className="text-lg font-mono font-extrabold text-slate-900">{app.applicationId}</h3>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold ${
                    statusBadges[app.status]?.color || 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{statusBadges[app.status]?.label || app.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" /> Service Title
                    </span>
                    <p className="text-sm font-bold text-slate-800">{app.serviceTitle}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Submitted On
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(app.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/my-applications/${app.applicationId}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Application Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-tertiary text-xs py-2 px-4 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-xs text-slate-500 font-medium">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-tertiary text-xs py-2 px-4 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyApplications;
