import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Navigation, Send } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Center Contact Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
            Visit or Contact Our Center
          </h2>
          <p className="text-slate-300 text-base mt-3">
            We are available for in-person consultation, document review, and online form submissions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Center Address</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Maa Vindhyawasini Online Centre<br />
                    Main Market Road, Near City Post Office,<br />
                    Mirzapur, Uttar Pradesh
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Working Hours</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Mon - Sat: 9:30 AM - 7:00 PM<br />
                    Sunday: Emergency assistance only<br />
                    Lunch Break: 1:30 PM - 2:00 PM
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Phone Support</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    +91 9876543210<br />
                    <span className="text-slate-500 text-[11px]">Direct Helpline Desk</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Email Address</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    support@csccenter.in<br />
                    <span className="text-slate-500 text-[11px]">Online Queries Desk</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Quick WhatsApp & Action Bar */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-800 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">WhatsApp Consultation</h4>
                  <p className="text-xs text-emerald-300">Quick queries regarding document lists</p>
                </div>
              </div>
              <button
                onClick={() => alert("WhatsApp assistance support is set up for Maa Vindhyawasini Online Centre.")}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>WhatsApp Desk</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>

          {/* Interactive Directions / Map Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Center Location Map</h3>
                <p className="text-xs text-slate-400">Find us on Google Maps</p>
              </div>
              <button
                onClick={() => alert("Redirecting to Google Business Location for Maa Vindhyawasini Online Centre.")}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Map Frame Placeholder */}
            <div className="w-full h-64 sm:h-72 rounded-xl bg-slate-950 border border-slate-700/60 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 mx-auto animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Maa Vindhyawasini Online Centre</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Main Market Road, Near City Post Office, Mirzapur
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic text-center">
              * Visit during operational hours for physical document scanning and photo capture.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
