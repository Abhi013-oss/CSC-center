import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { getAdminSettings, updateAdminSettings } from '../services/api';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Center Business Settings';
  }, []);

  const [formData, setFormData] = useState({
    centerName: '',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    whatsapp: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await getAdminSettings();
      if (res && res.success && res.data) {
        setFormData(res.data);
      }
    } catch (err) {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const res = await updateAdminSettings(formData);
      if (res && res.success) {
        setMsg(res.message || 'Settings updated successfully.');
      }
    } catch (err) {
      setError('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading center settings..." />;

  return (
    <div className="max-w-3xl space-y-6">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Center Business Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Update public contact info, operating hours, and center identity.
        </p>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="space-y-4">
          <div>
            <label className="form-label">CSC Center Branding Name *</label>
            <input
              type="text"
              value={formData.centerName}
              onChange={(e) => setFormData(prev => ({ ...prev, centerName: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Official Phone Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Support Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Physical Center Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Operating Hours *</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">WhatsApp Helpline Number</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default Settings;
