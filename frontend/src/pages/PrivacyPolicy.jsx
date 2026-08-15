import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { ShieldCheck, Lock } from 'lucide-react';

const PrivacyPolicy = () => {
  const breadcrumbs = [
    { label: 'Privacy Policy', path: '/privacy-policy' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <SEO
        title="Privacy Policy | CSC Digital Service Center"
        description="Learn how CSC Assistance Center collects, processes, and protects your personal information and documents."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Legal Disclosure
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Last updated: August 15, 2026</p>
          </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
            <p>
              When you submit an online application through our service center, we collect your full name, 10-digit mobile number, email address, residential address, date of birth, and attached identity proof documents required to process your selected service.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. Document Storage & Security</h3>
            <p>
              Uploaded identity documents (PDF, JPG, PNG) are stored in private encrypted cloud storage buckets. Access to these documents is restricted and granted only through short-lived signed URLs (120-second expiration) accessible exclusively by authenticated application owners and authorized operators.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. How We Use Your Data</h3>
            <p>
              Your information is used solely to process your requested online digital services, verify applicant identity, issue status notifications, and communicate operational updates regarding your application. We do not sell or rent your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. Contact Us</h3>
            <p>
              If you have any questions regarding our privacy practices or wish to request data updates, please contact support@csccenter.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
