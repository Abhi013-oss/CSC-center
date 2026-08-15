import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, FileText, LogOut, Edit3, CheckCircle2, Save, X } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();

  useEffect(() => {
    document.title = 'CSC Center | My Customer Account';
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || ''
  });
  const [editError, setEditError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || '',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    setSuccessMsg('');

    if (!editForm.fullName.trim()) {
      setEditError('Full name cannot be empty.');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!editForm.mobile.trim() || !phoneRegex.test(editForm.mobile.trim())) {
      setEditError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        fullName: editForm.fullName,
        mobile: editForm.mobile
      });
      setSuccessMsg('Profile details updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const breadcrumbs = [
    { label: 'Customer Account', path: '/account' }
  ];

  if (!user) {
    return <Loading message="Loading profile details..." />;
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={breadcrumbs} />

        {/* Welcome Header Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold border border-indigo-400 shadow-md">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{user.fullName}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                {user.email} • {user.mobile || 'No Mobile Registered'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/my-applications"
              className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <FileText className="w-4 h-4" />
              <span>My Applications</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-tertiary bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <Alert type="success" title="Success">
            {successMsg}
          </Alert>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Your verified account details on the CSC Center portal.</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-tertiary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {editError && (
            <Alert type="error" title="Update Failed">
              {editError}
            </Alert>
          )}

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name
                </span>
                <p className="text-base font-bold text-slate-800">{user.fullName}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email Address
                </span>
                <p className="text-base font-bold text-slate-800">{user.email}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" /> Mobile Number
                </span>
                <p className="text-base font-bold text-slate-800">{user.mobile || 'Not set'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" /> Account Role
                </span>
                <p className="text-base font-bold text-slate-800 capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 max-w-lg">
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  maxLength="10"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-tertiary text-sm py-2.5 px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default Account;
