import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';

const Terms = () => {
  const breadcrumbs = [
    { label: 'Terms of Service', path: '/terms' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <SEO
        title="Terms of Service | CSC Digital Service Center"
        description="Terms and conditions for utilizing online service assistance and document application submission services."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Legal Disclosure
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-400">Last updated: August 15, 2026</p>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">1. Service Nature & Disclaimer</h3>
            <p>
              CSC Assistance & Digital Service Center provides application assistance, form preparation, and document upload support. Official government departments, issuing authorities, and sanctioning bodies remain solely responsible for approving, issuing, or rejecting official documents.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. Applicant Responsibilities</h3>
            <p>
              Applicants are responsible for providing accurate, truthful information and genuine supporting documents. Submitting fraudulent, forged, or altered documents will lead to immediate rejection of the application without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. Center Service Fee</h3>
            <p>
              Center Service Fees cover assistance, verification, form filing, and tracking support. Service fees are non-refundable once document verification and processing has commenced.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. Modifications to Terms</h3>
            <p>
              We reserve the right to update these terms at any time. Continued use of our online assistance platform constitutes acceptance of updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
