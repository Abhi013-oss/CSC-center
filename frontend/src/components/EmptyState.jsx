import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

const EmptyState = ({
  title = "No services found",
  message = "Try another search term or select a different category filter.",
  onReset
}) => {
  return (
    <div className="text-center py-12 px-6 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <SearchX className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="btn-tertiary text-xs py-2 px-4 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters & Reset</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
