import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesData as fallbackServices } from '../data/servicesData';
import { getServiceBySlug } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import DocumentList from '../components/DocumentList';
import ProcessSteps from '../components/ProcessSteps';
import FAQAccordion from '../components/FAQAccordion';
import SEO from '../components/SEO';
import Loading from '../components/Loading';
import {
  CreditCard,
  Fingerprint,
  FileCheck,
  GraduationCap,
  Briefcase,
  BookOpen,
  Receipt,
  Globe,
  Printer,
  Image,
  Laptop,
  Grid,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

const iconMap = {
  CreditCard,
  Fingerprint,
  FileCheck,
  GraduationCap,
  Briefcase,
  BookOpen,
  Receipt,
  Globe,
  Printer,
  Image,
  Laptop,
  Grid,
};

const ServiceDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await getServiceBySlug(slug);
        if (res && res.success && res.data) {
          setService(res.data);
        } else {
          const fallback = fallbackServices.find(s => s.slug === slug || s.id === slug);
          setService(fallback || null);
        }
      } catch (err) {
        const fallback = fallbackServices.find(s => s.slug === slug || s.id === slug);
        setService(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) return <Loading message="Loading service details..." />;

  if (!service) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <SEO title="Service Not Found | CSC Digital Service Center" noIndex={true} />
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-slate-600 text-sm">
          The requested service URL does not exist or has been updated in our catalog.
        </p>
        <Link to="/services" className="btn-primary text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Services Catalog
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[service.iconName] || Grid;

  const breadcrumbs = [
    { label: 'Services', path: '/services' },
    { label: service.title, path: `/services/${service.slug}` }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <SEO
        title={`${service.title} Assistance | CSC Digital Service Center`}
        description={service.shortDescription || service.description}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={breadcrumbs} />

        {/* Service Header Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                <IconComponent className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100 uppercase tracking-wider">
                    {service.category}
                  </span>
                  {service.available ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      <XCircle className="w-3 h-3 text-slate-400" /> Currently Unavailable
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {service.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Link
                to="/services"
                className="btn-tertiary text-xs py-2.5 px-4 text-center flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Services</span>
              </Link>
              {service.available ? (
                <Link
                  to={`/apply/${service.id || service.slug}`}
                  className="btn-primary text-sm py-2.5 px-5 text-center flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Apply for This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="btn-secondary text-sm py-2.5 px-5 opacity-50 cursor-not-allowed">
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>

          {/* Overview & Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Service Overview</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Estimated Time & Fee Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Processing Time</div>
                <div className="text-sm font-bold text-slate-800">
                  {service.estimatedTime || "Depends on applicable service/authority."}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Center Service Fee</div>
                <div className="text-sm font-bold text-slate-800">
                  {service.serviceFee || service.service_fee ? `₹${service.service_fee || service.serviceFee} INR` : "Contact center"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents Section */}
        {service.documents && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Documents You May Need</h3>
            </div>
            <p className="text-xs text-slate-500">
              Please prepare legible scanned copies or originals of the following documents:
            </p>
            <DocumentList documents={service.documents} notes={service.notes} />
          </div>
        )}

        {/* Step-by-step Process Section */}
        {service.process && service.process.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Application Process</h3>
            </div>
            <ProcessSteps steps={service.process} />
          </div>
        )}

        {/* Apply CTA Card */}
        {service.available && (
          <div className="bg-indigo-600 text-white rounded-2xl p-8 text-center space-y-4 shadow-lg">
            <h3 className="text-2xl font-extrabold">Ready to start your {service.title}?</h3>
            <p className="text-indigo-100 text-sm max-w-lg mx-auto">
              Fill out our simplified digital application form to provide your details for operator review.
            </p>
            <div className="pt-2">
              <Link
                to={`/apply/${service.id || service.slug}`}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-base py-3 px-8 rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
              >
                <span>Proceed to Application Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ServiceDetails;
