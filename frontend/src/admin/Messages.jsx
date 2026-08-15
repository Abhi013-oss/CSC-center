import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminMessages, updateMessageStatus } from '../services/api';
import { MessageSquare, Search, Clock, Mail, Phone, User, CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const statusBadges = {
  new: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const Messages = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Contact Inquiries Desk';
  }, []);

  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // View Details Modal
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminMessages({
        page,
        limit: 15,
        status: activeTab !== 'all' ? activeTab : undefined,
        search: search.trim() || undefined
      });

      if (res && res.success) {
        setMessagesList(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to load messages.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeTab, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMessages();
  };

  const handleStatusChange = async (msgId, newStatus) => {
    setUpdating(true);
    try {
      const res = await updateMessageStatus(msgId, newStatus);
      if (res && res.success) {
        if (selectedMsg && selectedMsg.id === msgId) {
          setSelectedMsg(prev => ({ ...prev, status: newStatus }));
        }
        await fetchMessages();
      }
    } catch (err) {
      alert('Failed to update message status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Contact Inquiries Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review and respond to citizen contact inquiries submitted through the public website.
          </p>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, Mobile, Email, or Subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 text-xs py-2.5"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-5 cursor-pointer">
            Search
          </button>
        </form>

        <select
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value);
            setPage(1);
          }}
          className="form-input text-xs py-2.5 sm:w-44 font-semibold"
        >
          <option value="all">All Inquiries</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <Loading message="Fetching contact inquiries..." />
      ) : messagesList.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No Messages Found" description="No contact messages match your active filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Citizen Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Received Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {messagesList.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{m.name}</td>
                    <td className="p-3">
                      <div>{m.mobile}</div>
                      <div className="text-[11px] text-slate-400">{m.email}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{m.subject}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase ${statusBadges[m.status] || 'bg-slate-100'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMsg(m);
                          if (m.status === 'new') handleStatusChange(m.id, 'read');
                        }}
                        className="btn-primary text-[11px] py-1 px-3"
                      >
                        Read Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-tertiary text-xs py-1 px-3 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-tertiary text-xs py-1 px-3 disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Inquiry Details</h3>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              <p><strong>From:</strong> {selectedMsg.name} ({selectedMsg.mobile} • {selectedMsg.email})</p>
              <p><strong>Subject:</strong> {selectedMsg.subject}</p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed">
                {selectedMsg.message}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={selectedMsg.status}
                  onChange={(e) => handleStatusChange(selectedMsg.id, e.target.value)}
                  disabled={updating}
                  className="form-input text-xs py-1"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <button onClick={() => setSelectedMsg(null)} className="btn-tertiary text-xs py-1.5 px-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;
