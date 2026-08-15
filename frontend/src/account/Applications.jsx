import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { getMyApplications } from '../services/api';
import { FileText, Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Applications = () => {
  useEffect(() => {
    document.title = 'My Applications | CSC Assistance Customer Portal';
  }, []);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyApplications({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (res && res.success) {
        setApplications(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load applications.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  return (
    <div className="space-y-6">
      <SEO title="My Applications | Customer Portal" description="Track and view all submitted digital service applications." noIndex={true} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View status, upload documents, make payments, and track processing steps.
          </p>
        </div>

        <Link to="/services" className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 shrink-0">
          <span>Apply New Service</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Application ID or Service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 text-xs py-2"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2 px-4 cursor-pointer">
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="form-input text-xs py-2 sm:w-44 font-semibold shrink-0"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="document_required">Document Required</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading customer applications..." />
      ) : applications.length === 0 ? (
        <EmptyState icon={FileText} title="No Applications Found" description="You have no applications matching your filter criteria." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Submission Date</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-indigo-600">{a.applicationId}</td>
                    <td className="p-3 font-bold text-slate-900">{a.serviceTitle}</td>
                    <td className="p-3"><span className="px-2.5 py-0.5 rounded-full border font-bold uppercase text-[10px] bg-white">{a.status}</span></td>
                    <td className="p-3"><span className="px-2.5 py-0.5 rounded-full border font-bold uppercase text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">{a.paymentStatus}</span></td>
                    <td className="p-3 text-slate-500">{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/account/applications/${a.applicationId}`}
                        className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-tertiary text-xs py-1.5 px-3 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-tertiary text-xs py-1.5 px-3 disabled:opacity-40">
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
