import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  getAdminApplicationDetails,
  getAdminSignedDocumentUrl,
  updateApplicationStatus
} from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Tag,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  History,
  Shield,
  Edit3,
  X
} from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Document Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const statusOptions = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'document_required', label: 'Document Required' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
];

const ApplicationDetails = () => {
  const { id: applicationId } = useParams();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('under_review');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState('');

  const [downloadingDocId, setDownloadingDocId] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await getAdminApplicationDetails(applicationId);
      if (res && res.success && res.data) {
        setAppData(res.data);
      } else {
        setError(res.message || 'Application record not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application record not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `CSC Admin | Application ${applicationId || ''}`;
    fetchDetails();
  }, [applicationId]);

  const handleDownloadDocument = async (docId) => {
    setDownloadingDocId(docId);
    try {
      const res = await getAdminSignedDocumentUrl(applicationId, docId);
      if (res && res.success && res.data?.signedUrl) {
        window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Failed to generate admin signed URL.');
      }
    } catch (err) {
      alert('Error fetching signed URL.');
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');
    setUpdateMsg('');

    try {
      const res = await updateApplicationStatus(applicationId, {
        status: targetStatus,
        note: statusNote
      });

      if (res && res.success) {
        setUpdateMsg(res.message || 'Status updated successfully.');
        setShowStatusModal(false);
        setStatusNote('');
        await fetchDetails();
      } else {
        setUpdateError(res.message || 'Failed to update status.');
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Status transition rejected by server state machine.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading message="Loading application details..." />;

  if (error || !appData) {
    return (
      <div className="space-y-6">
        <Alert type="error" title="Record Error">{error || 'Application not found.'}</Alert>
        <Link to="/admin/applications" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Applications List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase">Application Reference</span>
          <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">{appData.applicationId}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${
            statusBadges[appData.status]?.color || 'bg-slate-100 text-slate-800'
          }`}>
            {statusBadges[appData.status]?.label || appData.status}
          </span>

          <button
            onClick={() => {
              setShowStatusModal(true);
              setTargetStatus(appData.status === 'pending' ? 'under_review' : appData.status);
            }}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {updateMsg && <Alert type="success" title="Updated">{updateMsg}</Alert>}

      {/* Applicant Info & Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Applicant Information</h3>
          <div className="space-y-1.5 text-xs text-slate-800 font-medium">
            <p><strong>Full Name:</strong> {appData.fullName}</p>
            <p><strong>Mobile:</strong> {appData.mobile}</p>
            <p><strong>Email:</strong> {appData.email || 'None'}</p>
            <p><strong>Date of Birth:</strong> {appData.dateOfBirth || 'Not specified'}</p>
            <p><strong>Address:</strong> {appData.address} {appData.city} {appData.state} {appData.pincode}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Service Details</h3>
          <div className="space-y-1.5 text-xs text-slate-800 font-medium">
            <p><strong>Service Title:</strong> {appData.serviceTitle}</p>
            <p><strong>Category:</strong> {appData.category}</p>
            <p><strong>Payment Status:</strong> <span className="capitalize font-bold text-emerald-700">{appData.paymentStatus}</span></p>
            <p><strong>Submission Date:</strong> {new Date(appData.createdAt).toLocaleString('en-IN')}</p>
            <p><strong>Remarks:</strong> {appData.remarks || 'None'}</p>
          </div>
        </div>

      </div>

      {/* Documents List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Attached Documents ({appData.documents.length})
        </h3>

        {appData.documents.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No documents attached.</p>
        ) : (
          <div className="space-y-2">
            {appData.documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800">{doc.fileName}</span>
                  <span className="text-slate-400">({(doc.fileSize / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  onClick={() => handleDownloadDocument(doc.id)}
                  disabled={downloadingDocId === doc.id}
                  className="btn-tertiary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingDocId === doc.id ? 'Loading Link...' : 'Download'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status History Audit Trail */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Status Audit Trail</h3>
        {appData.statusHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Application is in initial pending status.</p>
        ) : (
          <div className="space-y-2">
            {appData.statusHistory.map(h => (
              <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{h.oldStatus || 'initial'} → <strong className="text-indigo-600">{h.newStatus}</strong></span>
                  <span className="text-slate-400 font-mono">{new Date(h.createdAt).toLocaleString('en-IN')}</span>
                </div>
                {h.note && <p className="text-slate-600">Note: "{h.note}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Update Application Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateError && <Alert type="error" title="Transition Error">{updateError}</Alert>}

            <form onSubmit={handleStatusSubmit} className="space-y-4" noValidate>
              <div>
                <label className="form-label">New Status Target *</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="form-input"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Audit Note / Reason for Customer</label>
                <textarea
                  rows="3"
                  placeholder="Mention verification details or document requirements..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="form-input"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="btn-tertiary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {updating ? 'Saving Status...' : 'Confirm Status Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationDetails;
