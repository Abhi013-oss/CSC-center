import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { getMyPaymentDetails } from '../services/api';
import { CheckCircle2, Download, Printer, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

const PaymentSuccess = () => {
  const { paymentId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'CSC Center | Payment Receipt Verified';

    const fetchReceipt = async () => {
      try {
        const res = await getMyPaymentDetails(paymentId);
        if (res && res.success && res.data) {
          setReceipt(res.data);
        } else {
          setError(res.message || 'Payment receipt not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Payment receipt not found or access denied.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [paymentId]);

  const handlePrint = () => {
    window.print();
  };

  const breadcrumbs = [
    { label: 'My Applications', path: '/my-applications' },
    { label: 'Payment Receipt', path: `/payment/success/${paymentId}` }
  ];

  if (loading) return <Loading message="Retrieving server-verified payment receipt..." />;

  if (error || !receipt) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <Breadcrumbs items={breadcrumbs} />
          <Alert type="error" title="Receipt Error">{error}</Alert>
          <Link to="/my-applications" className="btn-primary py-2.5 px-6 inline-flex items-center gap-2">
            Return to My Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8 print:p-0 print:bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="print:hidden">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Receipt Container */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 text-center print:shadow-none print:border-none print:p-0">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              Server-Verified Payment Receipt
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Payment Confirmed & Verified
            </h1>
            <p className="text-xs text-slate-500">
              Your transaction has been logged in our PostgreSQL database system.
            </p>
          </div>

          {/* Printable Receipt Table */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4 font-mono text-xs text-slate-800">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400 font-sans">Transaction Reference ID</span>
              <span className="font-bold text-slate-900">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400 font-sans">Application Reference ID</span>
              <span className="font-bold text-indigo-600">{receipt.applicationId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400 font-sans">Applicant Name</span>
              <span className="font-bold">{receipt.applicantName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400 font-sans">Target Service Title</span>
              <span className="font-bold">{receipt.serviceTitle}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400 font-sans">Amount Paid</span>
              <span className="font-bold text-emerald-700 text-sm">₹{receipt.amount} INR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Payment Date</span>
              <span>{new Date(receipt.paidAt || receipt.createdAt).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="btn-tertiary text-xs py-3 px-6 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
            <Link
              to={`/my-applications/${receipt.applicationId}`}
              className="btn-primary text-xs py-3 px-6 flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
            >
              <span>View Application Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
