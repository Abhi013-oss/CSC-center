import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

const PaymentFailure = () => {
  const breadcrumbs = [
    { label: 'My Applications', path: '/my-applications' },
    { label: 'Payment Notice', path: '/payment/failure' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-red-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider border border-red-200">
              Payment Cancelled or Unverified
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Payment Could Not Be Completed
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your transaction was not completed or failed verification. If any funds were deducted, your bank will automatically process a refund per standard banking timelines.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/my-applications"
              className="btn-primary text-xs py-3 px-6 flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to My Applications & Retry</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
