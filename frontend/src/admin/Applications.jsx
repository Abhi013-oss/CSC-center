import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminApplications, getStaffRoster } from '../services/api';
import { FileText, Search, ArrowRight, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Doc Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'document_required', label: 'Doc Required' },
  { key: 'approved', label: 'Approved' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected', label: 'Rejected' }
];

const Applications = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Applications Management';
    fetchStaff();
  }, []);

  const [applications, setApplications] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await getStaffRoster();
      if (res && res.success) {
        setStaffList(res.data || []);
      }
    } catch (err) {}
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminApplications({
        page,
        limit: 15,
        status: activeTab !== 'all' ? activeTab : undefined,
        search: search.trim() || undefined
      });

      if (res && res.success) {
        setApplications(res.data || []);
        setTotalPages(res.totalPages || 1);
        setSelectedIds([]);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map(a => a.id || a.applicationId));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Applications Management Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, assign operators, review documents, and process lifecycle transitions.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Ref ID, Applicant Name, Mobile, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 text-xs py-2.5"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-5 cursor-pointer">
            Search
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs font-bold text-indigo-900">
          <span>{selectedIds.length} application(s) selected</span>
          <span className="text-slate-500 text-[11px]">Select an action to apply to all selected records</span>
        </div>
      )}

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Fetching applications from database..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Applications Found"
          description="No application records match your filter criteria."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === applications.length && applications.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-indigo-600"
                    />
                  </th>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Service Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.map(app => {
                  const appId = app.id || app.applicationId;
                  return (
                    <tr key={appId} className="hover:bg-slate-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(appId)}
                          onChange={() => toggleSelectRow(appId)}
                          className="rounded text-indigo-600"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">{app.applicationId}</td>
                      <td className="p-3 font-bold text-slate-800">{app.fullName}</td>
                      <td className="p-3">{app.serviceTitle}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                          statusBadges[app.status]?.color || 'bg-slate-100 text-slate-800'
                        }`}>
                          {statusBadges[app.status]?.label || app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/admin/applications/${app.applicationId}`}
                          className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-tertiary text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-tertiary text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Applications;
