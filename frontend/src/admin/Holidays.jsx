import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getCenterHolidays, createCenterHoliday } from '../services/api';
import { Calendar, Plus, CheckCircle2 } from 'lucide-react';

const Holidays = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Center Holidays Management';
    fetchHolidays();
  }, []);

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getCenterHolidays();
      if (res && res.success) {
        setHolidays(res.data || []);
      } else {
        setError(res.message || 'Failed to load holidays.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading center holidays.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!date || !name.trim() || submitting) return;

    setSubmitting(true);
    setMsg('');
    setError('');

    try {
      const res = await createCenterHoliday({ date, name: name.trim() });
      if (res && res.success) {
        setDate('');
        setName('');
        setModalOpen(false);
        setMsg('Holiday added to center calendar.');
        await fetchHolidays();
      } else {
        setError(res.message || 'Failed to add holiday.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Holiday already exists for this date.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Center Holidays Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage official center holidays to automatically block customer appointment slots.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holiday</span>
        </button>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading holiday calendar..." />
      ) : holidays.length === 0 ? (
        <EmptyState icon={Calendar} title="No Holidays Configured" description="No center holidays added to calendar." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4 max-w-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Holiday Date</th>
                  <th className="p-3">Holiday Name</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 font-mono">{h.date}</td>
                    <td className="p-3 font-bold text-slate-800">{h.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase border border-emerald-200">
                        Active Block
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Add Center Holiday
            </h3>

            <form onSubmit={handleAddHoliday} className="space-y-4 text-xs">
              <div>
                <label className="form-label text-xs">Holiday Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label text-xs">Holiday Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Independence Day"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!date || !name.trim() || submitting}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Holiday'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Holidays;
