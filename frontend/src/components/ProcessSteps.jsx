import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ProcessSteps = ({ steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
        {steps.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline Circle */}
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white ring-4 ring-slate-100 flex items-center justify-center"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Step 0{item.step || index + 1}
                </span>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;
