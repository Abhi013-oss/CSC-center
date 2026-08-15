import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 text-xs text-slate-600 overflow-x-auto scrollbar-none">
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-slate-500 hover:text-indigo-600 font-medium transition-colors truncate max-w-[120px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
