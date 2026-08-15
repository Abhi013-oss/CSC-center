import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { createSupportTicket, getMyTickets, getTicketDetails, addSupportMessage } from '../services/api';
import { LifeBuoy, Plus, MessageSquare, Send, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Application');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyTickets();
      if (res && res.success) {
        setTickets(res.data || []);
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
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || submitting) return;

    setSubmitting(true);
    setMsg('');
    setError('');

    try {
      const res = await createSupportTicket({
        subject: subject.trim(),
        category,
        description: description.trim()
      });

      if (res && res.success) {
        setSubject('');
        setDescription('');
        setCreateModalOpen(false);
        setMsg('Support ticket submitted successfully.');
        await fetchTickets();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenTicketThread = async (ticketId) => {
    setThreadLoading(true);
    try {
      const res = await getTicketDetails(ticketId);
      if (res && res.success && res.data) {
        setSelectedTicket(res.data);
      }
    } catch (err) {
      alert('Failed to load ticket conversation.');
    } finally {
      setThreadLoading(false);
    }
  };

  const handleSendCustomerReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket || replySubmitting) return;

    setReplySubmitting(true);
    try {
      const res = await addSupportMessage(selectedTicket.id, replyText.trim());
      if (res && res.success) {
        setReplyText('');
        await handleOpenTicketThread(selectedTicket.id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setReplySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <SEO title="Customer Help Desk & Support | CSC Assistance" description="Get help with your digital service applications and payments." noIndex={true} />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full flex-1 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Customer Help Desk & Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Need assistance with an application, payment, or document? Open a support ticket to chat with our staff.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Help Ticket</span>
          </button>
        </div>

        {msg && <Alert type="success" title="Success">{msg}</Alert>}
        {error && <Alert type="error" title="Error">{error}</Alert>}

        {loading ? (
          <Loading message="Loading support tickets..." />
        ) : tickets.length === 0 ? (
          <EmptyState icon={LifeBuoy} title="No Support Tickets" description="You have not created any support help tickets." />
        ) : selectedTicket ? (
          /* Ticket Conversation View */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <button onClick={() => setSelectedTicket(null)} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 mb-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to My Tickets
                </button>
                <h2 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h2>
                <p className="text-xs text-slate-500 font-mono">Ref: {selectedTicket.ticketNumber}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 border">
                {selectedTicket.status}
              </span>
            </div>

            {/* Conversation Thread Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl max-w-md text-xs space-y-1 ${m.senderType === 'customer' ? 'bg-indigo-600 text-white ml-auto' : 'bg-white text-slate-900 border border-slate-200 mr-auto shadow-xs'}`}
                >
                  <div className="flex items-center justify-between font-bold text-[10px] opacity-80 border-b border-white/20 pb-1 mb-1">
                    <span>{m.senderName}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="whitespace-pre-line">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Customer Reply Composer */}
            <form onSubmit={handleSendCustomerReply} className="space-y-3">
              <textarea
                rows="3"
                placeholder="Type your reply to CSC support staff..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="form-input text-xs"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!replyText.trim() || replySubmitting}
                  className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{replySubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Tickets Table */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Ticket Ref</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3 text-right">Conversation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-600">{t.ticketNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{t.subject}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">{t.category}</span></td>
                      <td className="p-3"><span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">{t.status}</span></td>
                      <td className="p-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenTicketThread(t.id)}
                          className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>View Thread</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Create Ticket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Create Help Support Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="form-label text-xs">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue or question..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label text-xs">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="Application">Application Inquiry</option>
                  <option value="Payment">Payment & Billing</option>
                  <option value="Document">Document Upload Verification</option>
                  <option value="Technical">Website / Account Technical Issue</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Description *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide detailed description of your question or issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!subject.trim() || !description.trim() || submitting}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerSupport;
