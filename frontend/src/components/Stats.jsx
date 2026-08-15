import React from 'react';
import { motion } from 'framer-motion';
import { Layers, FileCheck2, Zap, Calendar } from 'lucide-react';

const Stats = () => {
  const statsList = [
    {
      id: 1,
      metric: "12+",
      label: "Service Categories",
      description: "Comprehensive digital assistance",
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      id: 2,
      metric: "1,000+",
      label: "Applications Assisted",
      description: "Citizens guided with documentation",
      icon: FileCheck2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      id: 3,
      metric: "Fast",
      label: "Online Processing",
      description: "Prompt application submission",
      icon: Zap,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      id: 4,
      metric: "6 Days",
      label: "Center Availability",
      description: "Monday to Saturday assistance",
      icon: Calendar,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-40px' }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
        >
          {statsList.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg border ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.metric}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{stat.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
