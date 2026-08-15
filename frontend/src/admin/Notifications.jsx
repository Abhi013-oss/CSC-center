import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminNotifications, retryNotification } from '../services/api';
import { Bell, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

const statusBadges = {
  sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200'
};

const Notifications = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Email Notification Monitoring';
  }, []);

  const [notifList, setNotifList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [retryingId, setRetryingId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminNotifications({
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (res && res.success) {
        setNotifList(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load notification logs.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading notification logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [statusFilter, page]);

  const handleRetry = async (id) => {
    setRetryingId(id);
    setMsg('');

    try {
      const res = await retryNotification(id);
      if (res && res.success) {
        setMsg(res.message || 'Notification retry dispatched.');
        await fetchNotifications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to retry notification.');
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Notification Delivery Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Decoupled notification dispatcher logs, SMTP delivery statuses, and manual retry controls.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="form-input text-xs py-2.5 sm:w-44 font-semibold shrink-0"
        >
          <option value="all">All Statuses</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {msg && <Alert type="success" title="Retry Dispatched">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Querying notification logs..." />
      ) : notifList.length === 0 ? (
        <EmptyState icon={Bell} title="No Notification Logs Found" description="No logged email notifications match your filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Retries</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {notifList.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{n.type}</td>
                    <td className="p-3 font-semibold text-slate-800">{n.recipient}</td>
                    <td className="p-3 font-medium text-slate-700">{n.subject}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase ${statusBadges[n.status] || 'bg-slate-100'}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{n.retryCount}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(n.sentAt || n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right">
                      {n.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(n.id)}
                          disabled={retryingId === n.id}
                          className="btn-tertiary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{retryingId === n.id ? 'Retrying...' : 'Retry Email'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-tertiary text-xs py-1.5 px-3 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-tertiary text-xs py-1.5 px-3 disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Notifications;
