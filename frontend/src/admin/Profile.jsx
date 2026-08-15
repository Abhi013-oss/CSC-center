import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'CSC Admin | My Administrator Profile';
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Administrator Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspect authenticated operator credentials and permissions.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.fullName || 'System Administrator'}</h2>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                {user?.role || 'admin'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name
            </span>
            <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email Address
            </span>
            <p className="text-sm font-bold text-slate-900">{user?.email}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> Mobile Number
            </span>
            <p className="text-sm font-bold text-slate-900">{user?.mobile || 'Not specified'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Operational Status
            </span>
            <p className="text-sm font-bold text-emerald-700">Active Verified Administrator</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
