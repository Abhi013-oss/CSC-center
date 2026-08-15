import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getMyPayments } from '../services/api';
import { CreditCard, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const MyPayments = () => {
  useEffect(() => {
    document.title = 'CSC Center | My Payment Receipts';
  }, []);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyPayments({ page, limit: 10 });
      if (res && res.success) {
        setPayments(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load payment receipts.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading receipts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const breadcrumbs = [
    { label: 'Customer Account', path: '/account' },
    { label: 'My Payments', path: '/my-payments' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Payment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review and print official transaction receipts for your online service payments.
          </p>
        </div>

        {error && <Alert type="error" title="Error">{error}</Alert>}

        {loading ? (
          <Loading message="Loading payment receipts..." />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No Payment History Found"
            description="You have no logged payment transactions."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Application Ref</th>
                    <th className="p-3">Service Title</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{p.transactionId}</td>
                      <td className="p-3 font-mono font-bold text-indigo-600">{p.applicationId}</td>
                      <td className="p-3 font-semibold text-slate-800">{p.serviceTitle}</td>
                      <td className="p-3 font-bold text-emerald-700">₹{p.amount}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                          p.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/payment/success/${p.id}`}
                          className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1"
                        >
                          <span>View Receipt</span>
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
    </div>
  );
};

export default MyPayments;
