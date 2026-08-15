import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import SEO from '../components/SEO';
import { updateCustomerAccountProfile } from '../services/api';
import { User, Mail, Phone, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Profile Settings | Customer Portal';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    setError('');

    try {
      const res = await updateCustomerAccountProfile({ fullName, mobile });
      if (res && res.success) {
        setMsg('Profile information updated successfully.');
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error updating profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Profile Settings | Customer Portal" description="Manage your customer account personal information." noIndex={true} />

      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal account contact details and contact preference numbers.
        </p>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="form-label text-xs">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input pl-10 text-xs py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Email Address (Read Only)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="form-input pl-10 text-xs py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="form-input pl-10 text-xs py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Profile;
