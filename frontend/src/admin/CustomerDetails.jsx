import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { getAdminCustomerDetails, createCustomerNote } from '../services/api';
import { User, Mail, Phone, Calendar, Clock, FileText, LifeBuoy, MessageSquare, Plus, ArrowLeft, ShieldCheck } from 'lucide-react';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newNote, setNewNote] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminCustomerDetails(customerId);
      if (res && res.success && res.data) {
        setProfile(res.data);
      } else {
        setError(res.message || 'Customer profile not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customer profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'CSC Admin | Customer Profile';
    fetchProfile();
  }, [customerId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || noteSubmitting) return;

    setNoteSubmitting(true);
    setMsg('');

    try {
      const res = await createCustomerNote(customerId, newNote.trim());
      if (res && res.success) {
        setNewNote('');
        setMsg('Internal note added.');
        await fetchProfile();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading customer CRM profile..." />;

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <Alert type="error" title="Error">{error}</Alert>
        <Link to="/admin/customers" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
      </div>
    );
  }

  const { user, applications, tickets, notes, timeline } = profile;

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <Link to="/admin/customers" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer List
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user.fullName}
          </h1>
          <p className="text-xs text-slate-500 font-mono">Customer ID: {user.id}</p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {user.isActive ? 'Active Account' : 'Inactive Account'}
        </span>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Email Address</div>
            <div className="text-xs font-bold text-slate-800">{user.email}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Mobile Number</div>
            <div className="text-xs font-bold text-slate-800 font-mono">{user.mobile || 'N/A'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Registered Date</div>
            <div className="text-xs font-bold text-slate-800">{new Date(user.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Internal Notes & Application/Ticket Summary */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Internal Customer Notes Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Internal CRM Notes (Staff Only)</span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows="2"
                placeholder="Log internal follow-up notes, phone call summaries, or customer preferences..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="form-input text-xs"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim() || noteSubmitting}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{noteSubmitting ? 'Adding...' : 'Add Note'}</span>
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No internal customer notes logged.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-800 font-medium">{n.note}</p>
                    <p className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Applications History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Customer Application History</span>
            </h3>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No applications submitted by this customer.</p>
            ) : (
              <div className="space-y-2">
                {applications.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-indigo-600">{a.applicationId}</span>
                      <p className="font-semibold text-slate-800">{a.serviceTitle}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase bg-white">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Unified Activity Timeline */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Unified Customer Timeline</span>
          </h3>

          <div className="space-y-4 relative border-l-2 border-slate-200 pl-4 ml-2">
            {timeline.map((ev, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white"></div>
                <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                <p className="text-[11px] text-slate-600">{ev.description}</p>
                <p className="text-[10px] text-slate-400 font-mono">{new Date(ev.date).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CustomerDetails;
