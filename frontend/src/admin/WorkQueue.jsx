import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { getWorkQueue } from '../services/api';
import { ListTodo, FileText, LifeBuoy, CheckSquare, ArrowRight, AlertCircle } from 'lucide-react';

const WorkQueue = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Prioritized Daily Work Queue';
  }, []);

  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQueue = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getWorkQueue();
      if (res && res.success && res.data) {
        setQueue(res.data);
      } else {
        setError(res.message || 'Failed to load work queue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading work queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  if (loading) return <Loading message="Aggregating prioritized operator work queue..." />;

  if (error || !queue) return <Alert type="error" title="Error">{error}</Alert>;

  const { pendingApplications, urgentTickets, pendingTasks } = queue;

  return (
    <div className="space-y-8">
      
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Prioritized Operator Work Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Actionable daily queue sorting pending reviews, urgent customer help tickets, and staff tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Pending Applications for Review */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Applications Needing Action</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
              {pendingApplications.length}
            </span>
          </h3>

          {pendingApplications.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No pending applications requiring review.</p>
          ) : (
            <div className="space-y-3">
              {pendingApplications.map((a) => (
                <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-600">{a.applicationId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border">
                      {a.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{a.applicantName}</p>
                    <p className="text-[11px] text-slate-500">{a.serviceTitle}</p>
                  </div>
                  <Link
                    to={`/admin/applications/${a.applicationId}`}
                    className="btn-primary text-[11px] py-1 px-3 w-full flex items-center justify-center gap-1"
                  >
                    <span>Review Application</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Urgent Customer Support Tickets */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-amber-600" />
              <span>Urgent Support Tickets</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-mono font-bold">
              {urgentTickets.length}
            </span>
          </h3>

          {urgentTickets.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No open support tickets requiring reply.</p>
          ) : (
            <div className="space-y-3">
              {urgentTickets.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{t.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                      {t.priority}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{t.subject}</p>
                  <Link
                    to="/admin/support"
                    className="btn-secondary text-[11px] py-1 px-3 w-full flex items-center justify-center gap-1"
                  >
                    <span>Open Support Desk</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: High Priority Staff Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <span>Staff Tasks To Do</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold">
              {pendingTasks.length}
            </span>
          </h3>

          {pendingTasks.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No open internal staff tasks.</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-900">{t.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Priority: {t.priority}</span>
                    <span>Due: {t.dueAt ? new Date(t.dueAt).toLocaleDateString('en-IN') : 'None'}</span>
                  </div>
                  <Link
                    to="/admin/tasks"
                    className="btn-tertiary text-[11px] py-1 px-3 w-full flex items-center justify-center gap-1"
                  >
                    <span>View Task Manager</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default WorkQueue;
