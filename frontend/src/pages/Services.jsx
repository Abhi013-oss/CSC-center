import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ServiceGrid from '../components/ServiceGrid';
import Alert from '../components/Alert';
import { HelpCircle, FileCheck2, ArrowRight, ShieldCheck } from 'lucide-react';

const Services = () => {
  useEffect(() => {
    document.title = 'CSC Center | Online Services';
  }, []);

  const breadcrumbs = [
    { label: 'Services Catalog', path: '/services' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100/90 px-3 py-1 rounded-full border border-indigo-200">
            Complete Digital Service Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore All Available Services
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Browse our comprehensive service directory, check required documents, and begin your application.
          </p>
        </div>

        {/* Disclaimer Alert */}
        <Alert type="info" title="Independent Assistance Desk">
          All service items listed below provide application guidance, form filling assistance, and document formatting. Official government portal fees or state charges are paid directly to respective authorities.
        </Alert>

        {/* Service Catalog Grid with Real-Time Search & Category Filters */}
        <ServiceGrid showFilters={true} />

        {/* Helpful Information Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Need Help Finding a Specific Form?</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If a specific government scheme, entrance exam, or custom state portal form is not listed in the categories above, our center staff can assist you with custom online form filling.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link to="/contact" className="btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5">
              <span>Contact Service Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/track" className="btn-tertiary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5">
              <span>Already applied? Track status</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
