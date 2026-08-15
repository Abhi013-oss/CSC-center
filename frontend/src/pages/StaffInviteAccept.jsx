import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Alert from '../components/Alert';
import { acceptStaffInvitation } from '../services/api';
import { Shield, Key, CheckCircle2 } from 'lucide-react';

const StaffInviteAccept = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Staff Account Activation | CSC Assistance';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await acceptStaffInvitation({ token, password });
      if (res && res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to activate staff account.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired staff invitation token.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEO title="Staff Account Activation | CSC Assistance" description="Activate your staff operator account." noIndex={true} />
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-12 w-full flex-1 space-y-6">
        
        {success ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Staff Account Activated!</h2>
            <p className="text-xs text-slate-600">Your operator account has been created and verified. You can now sign in.</p>
            <Link to="/login" className="btn-primary text-xs py-2.5 px-6 inline-block">
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">Activate Staff Account</h1>
              <p className="text-xs text-slate-500">Set your password to activate your operator account.</p>
            </div>

            {!token && (
              <Alert type="error" title="Missing Token">
                Invalid staff invitation link. Please check your invitation email.
              </Alert>
            )}

            {error && <Alert type="error" title="Error">{error}</Alert>}

            {token && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="form-label text-xs">Set Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3 text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Activating Account...' : 'Activate Staff Account'}
                </button>
              </form>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default StaffInviteAccept;
