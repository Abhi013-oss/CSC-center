import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import {
  ShieldCheck,
  Target,
  Eye,
  CheckCircle2,
  HelpCircle,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Clock,
  Headphones,
  Lock,
  Grid
} from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = 'CSC Center | About Us';
  }, []);

  const breadcrumbs = [
    { label: 'About Us', path: '/about' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Bar */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-xl text-center max-w-4xl mx-auto space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Digital Service Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Our Digital Service Center
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Providing citizens, students, and local residents with reliable online form filing guidance, document review, and public digital service assistance.
          </p>
        </div>

        {/* Important Disclaimer Banner */}
        <Alert type="warning" title="Independent Assistance Notice">
          This is an independent digital assistance service center. It is not an official government website unless explicitly stated. All trademarks, portal names, and government schemes belong to their respective official authorities.
        </Alert>

        {/* About the Center Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Community Digital Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Empowering Citizens Through Digital Assistance
            </h2>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Navigating online portals, government recruitment sites, scholarship portals, and certificate applications can often be confusing due to technical guidelines, photo formatting requirements, and portal errors. Our center acts as a friendly digital assistance desk where applicants receive end-to-end guidance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Who We Help</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students applying for scholarships/admissions, job seekers submitting recruitment forms, elderly citizens seeking pension guidance, and local families needing certificate assistance.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Why Assistance is Useful</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents form rejections caused by spelling mismatches, wrong photo sizes, missing documents, or unverified details prior to final portal submission.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To make digital public services, educational applications, and essential documents accessible, understandable, and error-free for every citizen in our local community.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To build a simple, accessible, transparent, customer-friendly, and digital-first service center where every applicant receives prompt support.
            </p>
          </div>
        </div>

        {/* Why Customers Choose Us Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Customers Choose Us</h2>
            <p className="text-slate-600 text-sm mt-2">Core pillars that define our service experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Easy Process</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Streamlined application steps with zero complicated portal jargon.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Local Assistance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Friendly operators available in-person at our physical desk or online.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Document Guidance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear document checklists to ensure you bring valid proofs before filing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Application Tracking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reference application IDs issued so you can check progress anytime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Grid className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Multiple Categories</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                PAN, e-District certificates, scholarships, job forms, and passport booking under one roof.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Customer Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prompt help desk for answering portal questions and resolving submission issues.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Step Process */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
              Customer Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">How We Assist You</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">1</div>
              <h4 className="text-sm font-bold">Select Service</h4>
              <p className="text-[11px] text-slate-400">Choose required digital service catalog item.</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">2</div>
              <h4 className="text-sm font-bold">Review Requirements</h4>
              <p className="text-[11px] text-slate-400">Check document list and validity rules.</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">3</div>
              <h4 className="text-sm font-bold">Submit Info</h4>
              <p className="text-[11px] text-slate-400">Fill in essential applicant information.</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">4</div>
              <h4 className="text-sm font-bold">Provide Documents</h4>
              <p className="text-[11px] text-slate-400">Supply clear scans for operator verification.</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">5</div>
              <h4 className="text-sm font-bold">Track Application</h4>
              <p className="text-[11px] text-slate-400">Receive tracking ref ID for status monitoring.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Link to="/services" className="btn-primary text-base py-3 px-8 inline-flex items-center gap-2 shadow-md">
            <span>Explore All 25+ Available Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
