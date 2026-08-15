import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { getAccountNotifications } from '../services/api';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const Notifications = () => {
  useEffect(() => {
    document.title = 'Notification Inbox | Customer Portal';
    fetchNotifications();
  }, []);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAccountNotifications();
      if (res && res.success) {
        setNotifications(res.data || []);
      } else {
        setError(res.message || 'Failed to load notifications.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading notifications.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Notification Inbox | Customer Portal" description="View application updates and account notifications." noIndex={true} />

      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Notification Inbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Stay updated on your application status changes, document requests, and payment receipts.
        </p>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading notification messages..." />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No Notifications" description="You have no notification messages." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-xs font-bold text-slate-900">{n.subject}</h3>
                <p className="text-[11px] text-slate-500">{new Date(n.created_at).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Notifications;
