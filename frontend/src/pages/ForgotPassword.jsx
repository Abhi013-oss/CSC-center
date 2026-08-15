import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { forgotPassword as apiForgotPassword } from '../services/api';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  useEffect(() => {
    document.title = 'CSC Center | Forgot Password';
  }, []);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResultMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    } else if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiForgotPassword(email.trim());
      setResultMessage(res.message || 'If an account exists for this email, password reset instructions will be sent.');
    } catch (err) {
      setResultMessage('If an account exists for this email, password reset instructions will be sent.');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Login', path: '/login' },
    { label: 'Forgot Password', path: '/forgot-password' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-md mx-auto px-4 space-y-6">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 relative">
          
          {submitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20 rounded-2xl">
              <Loading message="Processing recovery request..." />
            </div>
          )}

          <div className="text-center space-y-2 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-100">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Reset Your Password</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your registered email address to receive password recovery instructions.
            </p>
          </div>

          {resultMessage && (
            <Alert type="info" title="Password Reset Request">
              {resultMessage}
            </Alert>
          )}

          {!resultMessage && (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="form-label">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`form-input pl-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Sending...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Return to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
