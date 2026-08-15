import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { getPublicSettings } from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    centerName: 'Maa Vindhyawasini Online Centre',
    phone: '+91 9876543210',
    email: 'support@csccenter.in',
    address: 'Shop No. 12, Main Market Road, Near Bus Stand',
    workingHours: 'Mon - Sat: 9:30 AM - 7:00 PM',
    whatsapp: '+91 9876543210'
  });

  useEffect(() => {
    getPublicSettings()
      .then(res => {
        if (res && res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight leading-none">Maa Vindhyawasini Online Centre</span>
                <span className="text-[11px] text-slate-400 font-medium">Digital Service Assistance</span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We assist citizens with online application submissions, document verification, and digital services with transparency and security.
            </p>
            <div className="space-y-1 text-[11px] font-medium text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{settings.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{settings.workingHours}</span>
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/services" className="hover:text-white transition-colors">Available Services</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Application</Link></li>
              <li><Link to="/notices" className="hover:text-white transition-colors">Public Notice Board</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Center</Link></li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Popular Services</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/services/pan-card-assistance" className="hover:text-white transition-colors">PAN Card Assistance</Link></li>
              <li><Link to="/services/income-certificate" className="hover:text-white transition-colors">Income Certificate</Link></li>
              <li><Link to="/services/caste-certificate" className="hover:text-white transition-colors">Caste Certificate</Link></li>
              <li><Link to="/services/domicile-certificate" className="hover:text-white transition-colors">Domicile Certificate</Link></li>
              <li><Link to="/services/passport-application-assistance" className="hover:text-white transition-colors">Passport Assistance</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Legal & Trust Policies</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund & Return Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Clear Disclaimer */}
        <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">Important Disclaimer:</p>
          <p>
            {settings.centerName} is an independent digital service assistance center facilitating online application processing. Official government departments, authorities, and bodies remain solely responsible for official application approvals and document issuance.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.centerName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-300">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
            <Link to="/refund-policy" className="hover:text-slate-300">Refunds</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
