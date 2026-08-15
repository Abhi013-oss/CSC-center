import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminCustomers } from '../services/api';
import { Users, Search, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const Customers = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Customer CRM Management';
  }, []);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminCustomers({ page, limit: 15, search: search || undefined });
      if (res && res.success) {
        setCustomers(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load customers.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading customer CRM list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Customer CRM & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search customer records, inspect unified timelines, log internal notes, and review application histories.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by Name, Mobile, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 text-xs py-2.5"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-5 cursor-pointer">
            Search
          </button>
        </form>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading customer CRM list..." />
      ) : customers.length === 0 ? (
        <EmptyState icon={Users} title="No Customers Found" description="No customer profiles match your search criteria." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Contact Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Applications</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Registered Date</th>
                  <th className="p-3 text-right">CRM Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{c.fullName}</td>
                    <td className="p-3 text-slate-600">{c.email}</td>
                    <td className="p-3 font-mono">{c.mobile}</td>
                    <td className="p-3 font-mono font-bold text-indigo-600">{c.totalApplications} ({c.completedApplications} completed)</td>
                    <td className="p-3">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <XCircle className="w-3 h-3 text-red-500" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/customers/${c.id}`}
                        className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1"
                      >
                        <span>View CRM Profile</span>
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

export default Customers;
