import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Alert from '../components/Alert';
import { submitFeedback } from '../services/api';
import { Star, CheckCircle2, ArrowLeft } from 'lucide-react';

const Feedback = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'CSC Assistance | Service Feedback';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await submitFeedback({
        applicationId,
        rating,
        comment: comment ? comment.trim() : null
      });

      if (res && res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEO title="Service Feedback | CSC Assistance" description="Rate your service experience with CSC Center." noIndex={true} />
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-12 w-full flex-1 space-y-6">
        
        {success ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Thank You For Your Feedback!</h2>
            <p className="text-xs text-slate-600">Your feedback helps us continuously improve our digital application assistance services.</p>
            <Link to="/account" className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Customer Portal
            </Link>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900">Application Service Feedback</h1>
              <p className="text-xs text-slate-500 font-mono">Ref ID: {applicationId}</p>
            </div>

            {error && <Alert type="error" title="Error">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="form-label text-xs">How was your service experience? *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 cursor-pointer focus:outline-hidden"
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="form-label text-xs">Your Comments (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Tell us what went well or how we can improve..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-input text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
