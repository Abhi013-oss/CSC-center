import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getStaffRoster, createStaffInvitation, updateStaffRoleStatus } from '../services/api';
import { UserCheck, UserPlus, Shield, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';

const Staff = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Staff Roster & Operator Management';
    fetchStaff();
  }, []);

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');
  const [submitting, setSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getStaffRoster();
      if (res && res.success) {
        setStaff(res.data || []);
      } else {
        setError(res.message || 'Failed to load staff roster.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading staff roster.');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || submitting) return;

    setSubmitting(true);
    setMsg('');
    setError('');

    try {
      const res = await createStaffInvitation({
        email: email.trim(),
        fullName: fullName.trim(),
        role
      });

      if (res && res.success && res.data) {
        setGeneratedLink(res.data.inviteLink);
        setMsg(`Staff invitation created for ${email}. Copy the invitation link below.`);
        await fetchStaff();
      } else {
        setError(res.message || 'Failed to create staff invitation.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff invitation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      const res = await updateStaffRoleStatus(staffId, { isActive: !currentStatus });
      if (res && res.success) {
        await fetchStaff();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update staff status.');
    }
  };

  const handleRoleChange = async (staffId, newRole) => {
    try {
      const res = await updateStaffRoleStatus(staffId, { role: newRole });
      if (res && res.success) {
        await fetchStaff();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update staff role.');
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Staff Roster & Operator Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Invite operators, manage role permissions, monitor staff workload, and enforce Last Admin protection.
          </p>
        </div>

        <button
          onClick={() => { setGeneratedLink(''); setInviteModalOpen(true); }}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Operator</span>
        </button>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading staff roster..." />
      ) : staff.length === 0 ? (
        <EmptyState icon={UserCheck} title="No Staff Found" description="No operator accounts found." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Operator Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Workload</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-3 text-slate-600 font-mono">{s.email}</td>
                    <td className="p-3">
                      <select
                        value={s.role}
                        onChange={(e) => handleRoleChange(s.id, e.target.value)}
                        className="form-input text-[11px] py-1 px-2 font-bold uppercase"
                      >
                        <option value="staff">Staff Operator</option>
                        <option value="admin">System Admin</option>
                      </select>
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-600">
                      {s.assignedApplications} Apps | {s.openTasks} Tasks
                    </td>
                    <td className="p-3">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <XCircle className="w-3 h-3 text-red-500" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleStatus(s.id, s.isActive)}
                        className={`text-[11px] py-1 px-3 rounded font-semibold cursor-pointer ${s.isActive ? 'btn-danger' : 'btn-secondary'}`}
                      >
                        {s.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Invitation Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Invite Staff Operator
            </h3>

            {generatedLink ? (
              <div className="space-y-4 text-xs">
                <Alert type="success" title="Invitation Created">
                  Share this activation link with the operator:
                </Alert>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] break-all select-all">
                  {generatedLink}
                </div>
                <button
                  onClick={copyInviteLink}
                  className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Activation Link'}</span>
                </button>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="btn-tertiary w-full py-2 text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="form-label text-xs">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Staff operator name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@csccenter.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Role Assignment</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-input text-xs"
                  >
                    <option value="staff">Staff Operator (Operational Access)</option>
                    <option value="admin">System Admin (Full Access)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setInviteModalOpen(false)} className="btn-tertiary text-xs py-2 px-4 cursor-pointer">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!email.trim() || !fullName.trim() || submitting}
                    className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Generating...' : 'Generate Invite Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Staff;
