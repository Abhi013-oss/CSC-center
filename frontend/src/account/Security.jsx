import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import SEO from '../components/SEO';
import { resetPassword } from '../services/api';
import { Shield, Key, Lock } from 'lucide-react';

const Security = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Account Security | Customer Portal';
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setMsg('');
    setError('');

    try {
      const res = await resetPassword(newPassword);
      if (res && res.success) {
        setMsg('Password updated successfully.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Failed to update password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error updating password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Account Security | Customer Portal" description="Update your customer account password and security settings." noIndex={true} />

      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Account Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your account credentials, password changes, and security preferences.
        </p>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-lg space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-600" />
          <span>Change Account Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div>
            <label className="form-label text-xs">New Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input pl-10 text-xs py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Confirm New Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input pl-10 text-xs py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            <span>{submitting ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Security;
