import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const variantStyles = {
  info: {
    bg: 'bg-indigo-50/90 border-indigo-200 text-indigo-900',
    icon: Info,
    iconColor: 'text-indigo-600',
  },
  success: {
    bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
  },
  warning: {
    bg: 'bg-amber-50/90 border-amber-200 text-amber-900',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  error: {
    bg: 'bg-red-50/90 border-red-200 text-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
};

const Alert = ({ type = 'info', title, children }) => {
  const style = variantStyles[type] || variantStyles.info;
  const IconComponent = style.icon;

  return (
    <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 shadow-xs ${style.bg}`}>
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="space-y-1">
        {title && <h5 className="font-bold leading-tight">{title}</h5>}
        <div className="leading-relaxed text-xs opacity-90">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
