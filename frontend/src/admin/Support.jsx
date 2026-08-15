import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminTickets, addSupportMessage, updateTicketStatus } from '../services/api';
import { LifeBuoy, Send, ChevronLeft, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

const priorityBadges = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  normal: 'bg-blue-50 text-blue-700 border-blue-200',
  low: 'bg-slate-50 text-slate-700 border-slate-200'
};

const Support = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Support Help Desk';
  }, []);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminTickets({
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined
      });

      if (res && res.success) {
        setTickets(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load support tickets.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading support tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, page]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await updateTicketStatus(ticketId, { status: newStatus });
      if (res && res.success) {
        await fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status.');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMsg.trim() || !selectedTicket || replySubmitting) return;

    setReplySubmitting(true);
    try {
      const res = await addSupportMessage(selectedTicket.id, replyMsg.trim());
      if (res && res.success) {
        setReplyMsg('');
        alert('Reply sent to customer.');
        setSelectedTicket(null);
        await fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply.');
    } finally {
      setReplySubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Customer Support Help Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage incoming customer support inquiries, SLA priorities, and threaded communications.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="form-input text-xs py-2 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_customer">Waiting Customer</option>
            <option value="resolved">Resolved</option>
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
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading support tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No Support Tickets" description="No customer help tickets match your filter criteria." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Ticket Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{t.ticketNumber}</td>
                    <td className="p-3 font-bold text-slate-800">{t.customerName}</td>
                    <td className="p-3 font-medium text-slate-700">{t.subject}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">{t.category}</span></td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${priorityBadges[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className="form-input text-[11px] py-1 px-2 font-bold uppercase"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_customer">Waiting Customer</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Reply</span>
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

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Reply to Ticket {selectedTicket.ticketNumber}
            </h3>
            <p className="text-xs text-slate-600"><strong>Customer:</strong> {selectedTicket.customerName}</p>
            <p className="text-xs text-slate-600"><strong>Subject:</strong> {selectedTicket.subject}</p>

            <textarea
              rows="4"
              placeholder="Type your response to the customer..."
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              className="form-input text-xs"
            ></textarea>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSelectedTicket(null)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyMsg.trim() || replySubmitting}
                className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{replySubmitting ? 'Sending...' : 'Send Response'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Support;
