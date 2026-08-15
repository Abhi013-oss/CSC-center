import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { getAvailableSlots, bookAppointment, getMyAppointments, cancelAppointment } from '../services/api';
import { Calendar, Clock, CheckCircle2, XCircle, Plus, AlertCircle } from 'lucide-react';

const Appointments = () => {
  useEffect(() => {
    document.title = 'Book Appointment | Customer Portal';
    fetchMyAppointments();
  }, []);

  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const fetchMyAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyAppointments();
      if (res && res.success) {
        setMyAppointments(res.data || []);
      } else {
        setError(res.message || 'Failed to load appointments.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading appointments.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (dateStr) => {
    setSlotsLoading(true);
    setSelectedSlot(null);
    try {
      const res = await getAvailableSlots(dateStr);
      if (res && res.success) {
        setSlots(res.slots || []);
      }
    } catch (err) {
      alert('Failed to load time slots for date.');
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (bookingModalOpen) {
      fetchSlots(selectedDate);
    }
  }, [bookingModalOpen, selectedDate]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || bookingSubmitting) return;

    setBookingSubmitting(true);
    setMsg('');
    setError('');

    try {
      const res = await bookAppointment({
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });

      if (res && res.success) {
        setBookingModalOpen(false);
        setMsg('Appointment booked successfully!');
        await fetchMyAppointments();
      } else {
        setError(res.message || 'Failed to book appointment.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Selected slot is no longer available.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleCancelApt = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await cancelAppointment(id);
      if (res && res.success) {
        setMsg('Appointment cancelled.');
        await fetchMyAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Book Appointment | Customer Portal" description="Schedule an in-person assistance appointment at CSC Center." noIndex={true} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Assistance Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Schedule an in-person consultation or document verification appointment at our center.
          </p>
        </div>

        <button
          onClick={() => setBookingModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading appointments..." />
      ) : myAppointments.length === 0 ? (
        <EmptyState icon={Calendar} title="No Appointments Booked" description="You have no scheduled appointments." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Appointment Ref</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myAppointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-indigo-600">#{a.appointmentNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{a.serviceTitle}</td>
                    <td className="p-3 font-bold text-slate-800">{a.date}</td>
                    <td className="p-3 font-mono">{a.startTime}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {a.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelApt(a.id)}
                          className="btn-danger text-[11px] py-1 px-3 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Book Assistance Appointment
            </h3>
            
            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="form-label text-xs">Select Appointment Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="form-label text-xs">Available Time Slots *</label>
                {slotsLoading ? (
                  <p className="text-xs text-slate-400">Loading available time slots...</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          !s.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : selectedSlot?.startTime === s.startTime
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        {s.label} {!s.available && '(Booked)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setBookingModalOpen(false)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlot || bookingSubmitting}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {bookingSubmitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Appointments;
