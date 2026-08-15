import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NoticeBar from '../components/NoticeBar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import ServiceGrid from '../components/ServiceGrid';
import ContactSection from '../components/ContactSection';
import {
  FileText,
  UserCheck,
  Upload,
  SearchCheck,
  ShieldCheck,
  Clock,
  Lock,
  Headphones,
  CheckSquare,
  AlertCircle,
  ArrowRight,
  FileCheck2,
  PhoneCall
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: '-60px' }
};

const cardItem = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' }
};

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Top Notice Strip */}
      <NoticeBar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Stats & Trust Section */}
      <Stats />

      {/* 4. Popular Services Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Popular Digital Services
            </h2>
            <p className="text-slate-600 text-base mt-3">
              Get expert assistance with commonly requested online applications, certificates, and document services.
            </p>
          </motion.div>

          <ServiceGrid featuredOnly={true} />

        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
              Simple Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              How It Works
            </h2>
            <p className="text-slate-600 text-base mt-3">
              We streamline complex government and online forms into a clear four-step process.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            
            {/* Step 1 */}
            <motion.div variants={cardItem} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Choose a Service</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select from our wide range of services including PAN, certificates, job forms, or education portals.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={cardItem} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Submit Your Details</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fill in the essential applicant information in our simplified digital form or visit our center.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={cardItem} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload Documents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide clean copies of mandatory ID proofs, photos, and certificates for verification.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={cardItem} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative space-y-4 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900">Track Application</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive your unique application reference ID to track status updates through our portal.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
              Trusted Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Why Choose CSC Service Desk
            </h2>
            <p className="text-slate-600 text-base mt-3">
              We prioritize accuracy, applicant privacy, and guidance to ensure your applications succeed without delays.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            
            <motion.div variants={cardItem} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Simple Online Process</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No need to decipher complex government portal layouts. We simplify input steps for quick submission.
              </p>
            </motion.div>

            <motion.div variants={cardItem} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Document Review & Formatting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We double-check file dimensions, signature sizes, and photo guidelines before uploading to portals.
              </p>
            </motion.div>

            <motion.div variants={cardItem} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <SearchCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Application Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get application reference details so you can monitor progress and receipt status anytime.
              </p>
            </motion.div>

            <motion.div variants={cardItem} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Transparent Service Process</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Clear estimated timelines and fee breakdowns for every service before application submission.
              </p>
            </motion.div>

            <motion.div variants={cardItem} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Local Center Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visit our physical center or call our helpline whenever you need help with technical portal errors.
              </p>
            </motion.div>

            <motion.div variants={cardItem} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 hover:border-indigo-300 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Secure Document Handling</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your personal IDs and photos are protected with strict privacy standards and confidential handling.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 7. Document Assistance Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            {...fadeInUp}
            className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden"
          >
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
                  Preparation Guide
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Documents You May Need
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Having the right documents ready accelerates your application process. Ensure your scanned copies are legible.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Aadhaar / Identity Proof</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Address & Domicile Proof</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Passport Photographs</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Active Mobile Number</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Valid Email Address</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Academic Marksheets</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Important Requirement Note</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Required documents vary depending on the selected service and government portal. Always confirm requirements before submitting your details.
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700/60 flex justify-end">
                  <Link to="/services" className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1">
                    Check Service Specific Requirements <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* 8. Track Application CTA Section */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Status Desk
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Already Submitted an Application?
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Check the latest status of your application anytime using your application reference ID provided at submission.
          </p>
          <div className="pt-2">
            <Link
              to="/track"
              className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <SearchCheck className="w-5 h-5" />
              <span>Track Application Status</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 9. Contact Section */}
      <ContactSection />

    </div>
  );
};

export default Home;
