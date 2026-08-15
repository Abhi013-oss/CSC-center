import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAuditLogs } from '../services/api';
import { Shield, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const AuditLogs = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Immutable Audit Logs';
    fetchLogs();
  }, []);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAuditLogs({ page, limit: 20 });
      if (res && res.success) {
        setLogs(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load audit logs.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            System Audit Trail Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Immutable operational event log tracking staff actions, application status transitions, and administrative overrides.
          </p>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading audit logs..." />
      ) : logs.length === 0 ? (
        <EmptyState icon={Shield} title="No Audit Logs" description="No audit log records recorded yet." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Resource</th>
                  <th className="p-3">Target ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium font-mono">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 text-[11px]">
                    <td className="p-3 text-slate-500">{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-slate-900">{l.actorName}</td>
                    <td className="p-3 font-bold text-indigo-600 uppercase">{l.action}</td>
                    <td className="p-3 text-slate-700">{l.targetResource}</td>
                    <td className="p-3 text-slate-500">{l.targetId || 'N/A'}</td>
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
              <span className="text-slate-500 font-medium font-sans">Page {page} of {totalPages}</span>
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

export default AuditLogs;
