import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminTasks, createTask, updateTaskStatus } from '../services/api';
import { CheckSquare, Plus, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const priorityBadges = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  normal: 'bg-blue-50 text-blue-700 border-blue-200',
  low: 'bg-slate-50 text-slate-700 border-slate-200'
};

const Tasks = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Staff Operations Tasks';
  }, []);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [dueAt, setDueAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminTasks({
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined
      });

      if (res && res.success) {
        setTasks(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load staff tasks.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, page]);

  const handleStatusToggle = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    try {
      const res = await updateTaskStatus(taskId, nextStatus);
      if (res && res.success) {
        await fetchTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await createTask({
        title: title.trim(),
        description: description ? description.trim() : null,
        priority,
        dueAt: dueAt || null
      });

      if (res && res.success) {
        setTitle('');
        setDescription('');
        setPriority('normal');
        setDueAt('');
        setCreateModalOpen(false);
        await fetchTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Internal Staff Operations Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create follow-ups, review tasks, callback reminders, and assign work queues.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Staff Task</span>
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="form-input text-xs py-2 font-semibold"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="form-input text-xs py-2 font-semibold"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading internal tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No Tasks Found" description="No internal staff tasks match your filter criteria." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Task Title</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <button
                        onClick={() => handleStatusToggle(t.id, t.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer border ${t.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}
                      >
                        {t.status}
                      </button>
                    </td>
                    <td className="p-3">
                      <p className={`font-bold text-slate-900 ${t.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{t.title}</p>
                      {t.description && <p className="text-[11px] text-slate-500 font-normal">{t.description}</p>}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${priorityBadges[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{t.dueAt ? new Date(t.dueAt).toLocaleDateString('en-IN') : 'No Due Date'}</td>
                    <td className="p-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleStatusToggle(t.id, t.status)}
                        className="btn-secondary text-[11px] py-1 px-3 cursor-pointer"
                      >
                        {t.status === 'completed' ? 'Mark Todo' : 'Complete'}
                      </button>
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

      {/* Create Task Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Create Internal Staff Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="form-label text-xs">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on document scan for application CSC-2026-00123"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label text-xs">Task Description</label>
                <textarea
                  rows="2"
                  placeholder="Additional context or phone instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="form-input text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs">Due Date</label>
                  <input
                    type="date"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || submitting}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tasks;
