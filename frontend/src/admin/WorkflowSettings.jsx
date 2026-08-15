import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getWorkflowSettings } from '../services/api';
import { Grid, Settings, CheckCircle2, XCircle } from 'lucide-react';

const WorkflowSettings = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Service Workflow & SLA Settings';
    fetchWorkflows();
  }, []);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkflows = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getWorkflowSettings();
      if (res && res.success) {
        setServices(res.data || []);
      } else {
        setError(res.message || 'Failed to load workflow settings.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading workflows.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Service Workflows & Requirement Rules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure service workflow requirements (Payment, Document Upload, Appointment requirement).
          </p>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading service workflow configurations..." />
      ) : services.length === 0 ? (
        <EmptyState icon={Grid} title="No Services Found" description="No service records configured." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Requires Payment</th>
                  <th className="p-3">Requires Documents</th>
                  <th className="p-3">Requires Appointment</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{s.title}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px]">{s.category}</span></td>
                    <td className="p-3">
                      {s.requiresPayment ? (
                        <span className="text-emerald-700 font-bold">Yes (₹{s.serviceFee})</span>
                      ) : (
                        <span className="text-slate-400">Free Service</span>
                      )}
                    </td>
                    <td className="p-3"><span className="text-emerald-700 font-bold">Yes</span></td>
                    <td className="p-3"><span className="text-slate-400">Optional</span></td>
                    <td className="p-3">
                      {s.available ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase border border-emerald-200">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px] uppercase border border-red-200">Inactive</span>
                      )}
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

export default WorkflowSettings;
