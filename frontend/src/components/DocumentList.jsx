import React from 'react';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const DocumentList = ({ documents = [], notes }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 italic border border-slate-200">
        No specific document list specified. Please contact our center for guidance.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-sm font-medium text-slate-800 leading-snug">{doc}</span>
          </div>
        ))}
      </div>

      {notes && (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Service Note:</strong> {notes}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 italic">
        * Note: Document requirements may vary depending on the specific service, scheme rules, and applicable government authority.
      </p>
    </div>
  );
};

export default DocumentList;
