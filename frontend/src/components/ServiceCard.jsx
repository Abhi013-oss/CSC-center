import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle
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

const ServiceCard = ({ service }) => {
  const IconComponent = iconMap[service.iconName] || Grid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group card-base p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white"
    >
      
      {/* Top Tag & Availability */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider truncate max-w-[170px]">
            {service.category}
          </span>
          
          {service.available ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
              <XCircle className="w-3 h-3 text-slate-400" /> Unavailable
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="space-y-2.5 mb-5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-xs">
            <IconComponent className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {service.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {service.shortDescription || service.description}
          </p>

          {service.estimatedTime && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Time: {service.estimatedTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/services/${service.slug}`}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          View Details
        </Link>

        <Link
          to={`/apply/${service.id}`}
          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </motion.div>
  );
};

export default ServiceCard;
