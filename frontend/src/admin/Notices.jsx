import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminNotices, createNotice, updateNotice, toggleNoticePublish, deleteNotice } from '../services/api';
import { Bell, Plus, Edit3, Trash2, CheckCircle2, XCircle, X, Save } from 'lucide-react';

const typeBadges = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const Notices = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Notice Banner Management';
  }, []);

  const [noticesList, setNoticesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 0,
    isPublished: true
  });
  const [saving, setSaving] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminNotices();
      if (res && res.success) {
        setNoticesList(res.data || []);
      } else {
        setError(res.message || 'Failed to load notices.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 0,
      isPublished: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (n) => {
    setEditingId(n.id);
    setFormData({
      title: n.title || '',
      content: n.content || '',
      type: n.type || 'info',
      priority: n.priority || 0,
      isPublished: n.isPublished !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and Content are required.');
      return;
    }

    setSaving(true);
    setMsg('');

    try {
      if (editingId) {
        const res = await updateNotice(editingId, formData);
        if (res && res.success) setMsg(res.message);
      } else {
        const res = await createNotice(formData);
        if (res && res.success) setMsg(res.message);
      }
      setShowModal(false);
      await fetchNotices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save notice.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (n) => {
    try {
      await toggleNoticePublish(n.id, !n.isPublished);
      await fetchNotices();
    } catch (err) {
      alert('Failed to update publication status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice banner?')) return;

    try {
      await deleteNotice(id);
      await fetchNotices();
    } catch (err) {
      alert('Failed to delete notice.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Notice Banner Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish site-wide alert banners and announcements for citizens.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notice Banner</span>
        </button>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Fetching notice banners..." />
      ) : noticesList.length === 0 ? (
        <EmptyState icon={Bell} title="No Notice Banners" description="Click 'Create Notice Banner' to add public alerts." />
      ) : (
        <div className="space-y-4">
          {noticesList.map(n => (
            <div key={n.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase ${typeBadges[n.type] || typeBadges.info}`}>
                    {n.type}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${n.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                    {n.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600">{n.content}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublish(n)}
                  className="btn-tertiary text-xs py-1.5 px-3 cursor-pointer"
                >
                  {n.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleOpenEdit(n)}
                  className="btn-tertiary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg border border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Notice Banner' : 'Create Notice Banner'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
              <div>
                <label className="form-label">Notice Banner Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                  placeholder="e.g. Center Holiday Announcement"
                />
              </div>

              <div>
                <label className="form-label">Notice Content *</label>
                <textarea
                  rows="3"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="form-input"
                  placeholder="Enter notice details..."
                ></textarea>
              </div>

              <div>
                <label className="form-label">Notice Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input"
                >
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="urgent">Urgent (Red)</option>
                  <option value="success">Success (Green)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-tertiary py-2 px-4">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary py-2 px-6 flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notices;
