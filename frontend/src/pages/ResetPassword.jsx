import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { resetPassword as apiResetPassword } from '../services/api';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'CSC Center | Set New Password';
  }, []);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      const res = await apiResetPassword(password);
      setSuccessMessage(res.message || 'Password reset successfully! You can now log in.');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update password. Recovery link may be expired.');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Reset Password', path: '/reset-password' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-md mx-auto px-4 space-y-6">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 relative">
          
          {submitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20 rounded-2xl">
              <Loading message="Updating password..." />
            </div>
          )}

          <div className="text-center space-y-2 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Set New Password</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Please enter your new password below.
            </p>
          </div>

          {successMessage && (
            <div className="space-y-4">
              <Alert type="success" title="Password Updated">
                {successMessage}
              </Alert>
              <Link to="/login" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <span>Go to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {apiError && (
            <Alert type="error" title="Reset Error">
              {apiError}
            </Alert>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="form-label">New Password * (Min 8 characters)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1 font-medium">{errors.password}</p>}
              </div>

              <div>
                <label className="form-label">Confirm New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`form-input pl-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1 font-medium">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Updating...' : 'Update Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
