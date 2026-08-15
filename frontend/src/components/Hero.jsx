import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ShieldCheck, FileText, CheckCircle2, Award, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>DIGITAL SEVA KENDRA</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              All Your Online Services,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-200 to-emerald-300">
                In One Place
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Get reliable assistance for government forms, certificates, PAN card services, education applications, online admissions, and essential digital public services.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <Link
                to="/services"
                className="btn-primary text-base px-6 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/track"
                className="px-6 py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-800 text-slate-200 hover:text-white font-medium text-base border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-indigo-400" />
                <span>Track Application</span>
              </Link>
            </div>

            {/* Quick Feature Bullet Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 w-full text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Expert Form Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Fast Service Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Transparent Process</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Representation Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Service Quick Card */}
              <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">CSC Digital Desk</h3>
                      <p className="text-xs text-slate-400">Quick Assistance Portal</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Center Active
                  </span>
                </div>

                {/* Service Cards Showcase Stack */}
                <div className="space-y-3">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        01
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-200">PAN Card Services</div>
                        <div className="text-xs text-slate-400">New PAN & Correction Assistance</div>
                      </div>
                    </div>
                    <Link to="/apply/pan-card" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                      Apply <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        02
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-200">State Govt Certificates</div>
                        <div className="text-xs text-slate-400">Income, Caste & Domicile Forms</div>
                      </div>
                    </div>
                    <Link to="/apply/govt-certificates" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                      Apply <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                        03
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-200">Scholarships & Recruitment</div>
                        <div className="text-xs text-slate-400">NSP Portal & Job Applications</div>
                      </div>
                    </div>
                    <Link to="/apply/scholarship-assistance" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                      Apply <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-400">
                    Need help choosing? <Link to="/contact" className="text-indigo-300 hover:underline">Contact our service desk</Link>
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
