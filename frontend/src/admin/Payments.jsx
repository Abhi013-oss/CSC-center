import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminPayments } from '../services/api';
import { CreditCard, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Payments = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Logged Payment Transactions';
  }, []);

  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminPayments({
        page,
        limit: 15,
        search: search.trim() || undefined
      });

      if (res && res.success) {
        setPaymentsList(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load payment transactions.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Payment Transactions Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Read-only record of logged service transactions in database. (Phase 7 Read-Only Mode)
          </p>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID..."
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

      {loading ? (
        <Loading message="Fetching transaction records..." />
      ) : paymentsList.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Payment Records Found"
          description="No transaction logs present in database."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Application Ref</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paymentsList.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.transactionId}</td>
                    <td className="p-3 font-mono font-bold text-indigo-700">{p.applicationId}</td>
                    <td className="p-3">{p.applicantName}</td>
                    <td className="p-3 font-bold text-slate-900">₹{p.amount}</td>
                    <td className="p-3">{p.paymentMethod}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                        p.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-tertiary text-xs py-1 px-3 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-tertiary text-xs py-1 px-3 disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Payments;
