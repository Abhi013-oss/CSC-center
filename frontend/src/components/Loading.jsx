import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ fullPage = false, message = "Loading, please wait...", size = "md" }) => {
  const spinnerSizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center p-4 text-slate-600">
      <Loader2 className={`${spinnerSizes[size] || spinnerSizes.md} animate-spin text-indigo-600 mb-3`} />
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full mx-4 text-center">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loading;
