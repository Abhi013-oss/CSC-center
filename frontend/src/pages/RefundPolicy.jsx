import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

const RefundPolicy = () => {
  const breadcrumbs = [
    { label: 'Refund & Return Policy', path: '/refund-policy' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <SEO
        title="Refund & Return Policy | CSC Digital Service Center"
        description="Understand center service fee refund terms, duplicate transaction guidelines, and payment failure resolution."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Legal Disclosure
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Refund & Return Policy</h1>
            <p className="text-xs text-slate-400">Last updated: August 15, 2026</p>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">1. Center Service Fee Refund Terms</h3>
            <p>
              Center service fees cover application verification, data entry, and assistance processing. If an application is cancelled prior to operator verification, a full refund of the service fee will be issued. Once operator verification has commenced, service fees are non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. Duplicate Payments</h3>
            <p>
              In case of duplicate payment deductions due to payment gateway or network glitches, the duplicate amount will be refunded back to the original source account within 5-7 business days upon verification.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. Payment Failure Resolution</h3>
            <p>
              If funds are debited from your bank account but the payment signature verification fails on our system, your bank will automatically process a refund per standard banking timelines.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. Support Contact</h3>
            <p>
              To request assistance regarding payment or refund inquiries, please email support@csccenter.in with your Reference ID and payment receipt details.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
