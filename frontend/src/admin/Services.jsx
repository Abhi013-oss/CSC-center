import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminServices, createService, updateService, toggleServiceStatus } from '../services/api';
import { Grid, Plus, Edit3, CheckCircle2, XCircle, Star, X, Save } from 'lucide-react';

const Services = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Service Catalog Management';
  }, []);

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'identity-pan',
    shortDescription: '',
    description: '',
    estimatedTime: '2-3 Business Days',
    serviceFee: '107',
    featured: false,
    available: true
  });
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminServices();
      if (res && res.success) {
        setServicesList(res.data || []);
      } else {
        setError(res.message || 'Failed to load service catalog.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'identity-pan',
      shortDescription: '',
      description: '',
      estimatedTime: '2-3 Business Days',
      serviceFee: '107',
      featured: false,
      available: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditingId(s.id);
    setFormData({
      title: s.title || '',
      slug: s.slug || '',
      category: s.category || 'identity-pan',
      shortDescription: s.shortDescription || '',
      description: s.description || '',
      estimatedTime: s.estimatedTime || '',
      serviceFee: s.serviceFee || '',
      featured: s.featured || false,
      available: s.available !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Service title is required.');
      return;
    }

    setSaving(true);
    setMsg('');

    try {
      if (editingId) {
        const res = await updateService(editingId, formData);
        if (res && res.success) setMsg(res.message);
      } else {
        const res = await createService(formData);
        if (res && res.success) setMsg(res.message);
      }
      setShowModal(false);
      await fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailable = async (s) => {
    try {
      await toggleServiceStatus(s.id, { available: !s.available });
      await fetchServices();
    } catch (err) {
      alert('Failed to toggle availability.');
    }
  };

  const handleToggleFeatured = async (s) => {
    try {
      await toggleServiceStatus(s.id, { featured: !s.featured });
      await fetchServices();
    } catch (err) {
      alert('Failed to toggle featured status.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Service Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, feature, or disable public service catalog items.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {msg && <Alert type="success" title="Catalog Updated">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Fetching service catalog..." />
      ) : servicesList.length === 0 ? (
        <EmptyState icon={Grid} title="No Services Found" description="Click 'Add New Service' to create a service." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {s.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(s)}
                      className={`p-1 rounded cursor-pointer ${s.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-amber-400'}`}
                      title={s.featured ? 'Featured Service' : 'Mark as Featured'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{s.shortDescription || s.description}</p>
                <div className="pt-1 text-xs font-semibold text-slate-700">
                  Fee: <strong className="text-slate-900">{s.serviceFee ? `₹${s.serviceFee}` : 'Contact Center'}</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailable(s)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border cursor-pointer ${
                    s.available !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {s.available !== false ? 'Available' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleOpenEdit(s)}
                  className="btn-tertiary text-xs py-1 px-3 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Service Catalog Item' : 'Create New Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
              <div>
                <label className="form-label">Service Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                  placeholder="e.g. Income Certificate Assistance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    <option value="identity-pan">Identity & PAN</option>
                    <option value="government-documents">Government Documents</option>
                    <option value="education">Education & Scholarships</option>
                    <option value="jobs-exams">Jobs & Recruitment</option>
                    <option value="financial-utility">Financial & Banking</option>
                    <option value="travel-passport">Travel & Passport</option>
                    <option value="digital-services">Digital Assistance</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Center Service Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.serviceFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceFee: e.target.value }))}
                    className="form-input"
                    placeholder="107"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Short Summary</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Full Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-tertiary py-2 px-4">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary py-2 px-6 flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
