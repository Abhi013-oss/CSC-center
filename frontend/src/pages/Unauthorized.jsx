import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  useEffect(() => {
    document.title = 'CSC Center | 403 Access Denied';
  }, []);

  return (
    <div className="py-16 sm:py-24 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider border border-red-100">
            403 Access Denied
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Unauthorized Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You do not have administrative permission to access this section of the CSC Center portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary text-sm py-3 px-6 flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Page</span>
          </Link>
          <Link
            to="/account"
            className="btn-tertiary text-sm py-3 px-6 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Customer Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
