import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { getMyPayments, getMyPaymentDetails } from '../services/api';
import { CreditCard, Printer, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

const Payments = () => {
  useEffect(() => {
    document.title = 'Payment Receipts | Customer Portal';
    fetchPayments();
  }, []);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyPayments({ page: 1, limit: 15 });
      if (res && res.success) {
        setPayments(res.data || []);
      } else {
        setError(res.message || 'Failed to load payment history.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading payments.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = async (paymentId) => {
    try {
      const res = await getMyPaymentDetails(paymentId);
      if (res && res.success && res.data) {
        setSelectedReceipt(res.data);
      }
    } catch (err) {
      alert('Failed to load printable receipt.');
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Payment Receipts | Customer Portal" description="View transaction history and print official payment receipts." noIndex={true} />

      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Payment Receipts & Billing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review verified application payment transactions and download printable receipts.
        </p>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading payment transaction records..." />
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No Payment Receipts" description="You have not completed any payments yet." />
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
                  <th className="p-3">Paid Date</th>
                  <th className="p-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.transactionId || 'N/A'}</td>
                    <td className="p-3 font-mono font-bold text-indigo-600">{p.applicationId}</td>
                    <td className="p-3 font-bold text-slate-900">{p.serviceTitle}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{p.amount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenReceipt(p.id)}
                        className="btn-secondary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-6 border border-slate-200 shadow-xl print:m-0 print:p-0 print:border-none print:shadow-none">
            
            <div className="border-b border-slate-200 pb-4 text-center space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 uppercase">CSC ASSISTANCE CENTER</h2>
              <p className="text-xs text-slate-500">Official Payment Transaction Receipt</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Receipt Ref:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Application ID:</span>
                <span className="font-mono font-bold text-indigo-600">{selectedReceipt.applicationId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.serviceTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">₹{selectedReceipt.amount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold uppercase text-emerald-700">{selectedReceipt.status}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 print:hidden">
              <button onClick={() => setSelectedReceipt(null)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                Close
              </button>
              <button onClick={() => window.print()} className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5 cursor-pointer">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;
