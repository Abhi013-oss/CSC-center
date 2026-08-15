import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Grid, AlertTriangle, ArrowRight } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = 'CSC Center | 404 Page Not Found';
  }, []);

  return (
    <div className="py-20 sm:py-32 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* CSS/Icon Illustration */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-md"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-extrabold text-indigo-600 tracking-tight">404</span>
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Sorry, the page or service URL you are looking for doesn't exist or has been relocated in our catalog.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary text-xs py-2.5 px-5 w-full sm:w-auto flex items-center justify-center gap-2 shadow-xs"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/services"
            className="btn-tertiary text-xs py-2.5 px-5 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
