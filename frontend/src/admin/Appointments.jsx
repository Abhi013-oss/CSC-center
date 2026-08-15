import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminAppointments, updateAdminAppointmentStatus } from '../services/api';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

const Appointments = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Assistance Appointments';
    fetchAppointments();
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminAppointments();
      if (res && res.success) {
        setAppointments(res.data || []);
      } else {
        setError(res.message || 'Failed to load appointments.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading admin appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateAdminAppointmentStatus(id, newStatus);
      if (res && res.success) {
        await fetchAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Center Assistance Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage scheduled in-person consultation appointments, confirm bookings, and mark completed/cancelled visits.
          </p>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading appointment schedule..." />
      ) : appointments.length === 0 ? (
        <EmptyState icon={Calendar} title="No Appointments Booked" description="No customer appointments scheduled." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Service Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-indigo-600">#{a.appointmentNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{a.customerName}</td>
                    <td className="p-3 font-mono">{a.customerMobile}</td>
                    <td className="p-3 font-bold text-slate-800">{a.serviceTitle}</td>
                    <td className="p-3 text-slate-800">{a.date}</td>
                    <td className="p-3 font-mono">{a.startTime}</td>
                    <td className="p-3">
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        className="form-input text-[11px] py-1 px-2 font-bold uppercase"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Appointments;
