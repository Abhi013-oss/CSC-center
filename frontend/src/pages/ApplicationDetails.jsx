import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import FileUpload from '../components/FileUpload';
import {
  getMyApplicationDetails,
  getSignedDocumentUrl,
  uploadUserDocument
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
  UploadCloud,
  History,
  ShieldCheck
} from 'lucide-react';

const statusBadges = {
  pending: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  under_review: { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  document_required: { label: 'Document Required', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const timelineSteps = [
  { key: 'pending', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'completed', label: 'Completed' }
];

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Document upload state when status is document_required
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Download URL loading state
  const [downloadingDocId, setDownloadingDocId] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await getMyApplicationDetails(applicationId);
      if (res && res.success && res.data) {
        setAppData(res.data);
      } else {
        setError(res.message || 'Application not found or access denied.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `CSC Center | Application ${applicationId || ''}`;
    fetchDetails();
  }, [applicationId]);

  const handleDownloadDocument = async (docId) => {
    setDownloadingDocId(docId);
    try {
      const res = await getSignedDocumentUrl(applicationId, docId);
      if (res && res.success && res.data?.signedUrl) {
        window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Failed to generate secure download link.');
      }
    } catch (err) {
      alert('Error fetching secure download URL.');
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleUploadAdditional = async () => {
    if (newFiles.length === 0) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      for (const file of newFiles) {
        await uploadUserDocument(applicationId, file, 'additional_required_proof');
      }
      setUploadSuccess('Additional documents uploaded successfully.');
      setNewFiles([]);
      await fetchDetails();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const breadcrumbs = [
    { label: 'My Applications', path: '/my-applications' },
    { label: applicationId || 'Details', path: `/my-applications/${applicationId}` }
  ];

  if (loading) {
    return <Loading message="Retrieving application details & timeline..." />;
  }

  if (error || !appData) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Breadcrumbs items={breadcrumbs} />
          <Alert type="error" title="Access Error">
            {error || 'Application reference not found.'}
          </Alert>
          <div className="pt-2">
            <Link to="/my-applications" className="btn-primary py-2.5 px-6 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Applications</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={breadcrumbs} />

        {/* Application Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Application Reference ID</span>
              <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">{appData.applicationId}</h1>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold ${
              statusBadges[appData.status]?.color || 'bg-slate-100 text-slate-800'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{statusBadges[appData.status]?.label || appData.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-600" /> Target Service
              </span>
              <p className="text-sm font-bold text-slate-800">{appData.serviceTitle}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Submitted On
              </span>
              <p className="text-sm font-bold text-slate-800">
                {new Date(appData.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Timeline Progress Indicator (Requirement 52) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Application Lifecycle Progress
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative text-center">
            {timelineSteps.map((s, idx) => {
              const isCompleted = appData.status === 'completed' || (idx === 0 && appData.status !== 'pending');
              const isCurrent = appData.status === s.key;

              return (
                <div key={s.key} className="flex flex-col items-center space-y-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Prompt when Status is document_required (Requirement 54) */}
        {appData.status === 'document_required' && (
          <div className="bg-purple-50 p-6 sm:p-8 rounded-2xl border border-purple-200 space-y-4">
            <div className="flex items-center gap-3 text-purple-900 font-bold text-lg">
              <AlertCircle className="w-6 h-6 text-purple-600" />
              <span>Additional Documents Requested</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-800">
              Our operator has reviewed your application and requested additional supporting documents before proceeding.
            </p>

            {uploadSuccess && <Alert type="success" title="Success">{uploadSuccess}</Alert>}
            {uploadError && <Alert type="error" title="Upload Failed">{uploadError}</Alert>}

            <FileUpload
              label="Attach Requested Proofs"
              onFilesChange={(files) => setNewFiles(files)}
            />

            {newFiles.length > 0 && (
              <button
                onClick={handleUploadAdditional}
                disabled={uploading}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Submit Additional Documents'}</span>
              </button>
            )}
          </div>
        )}

        {/* Applicant Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Applicant Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><strong>Full Name:</strong> {appData.fullName}</div>
            <div><strong>Mobile:</strong> {appData.mobile}</div>
            <div><strong>Email:</strong> {appData.email || 'None'}</div>
            <div><strong>Date of Birth:</strong> {appData.dateOfBirth || 'Not specified'}</div>
            <div className="sm:col-span-2"><strong>Address:</strong> {appData.address} {appData.city} {appData.state} {appData.pincode}</div>
          </div>
        </div>

        {/* Attached Documents with Short-Lived Signed Download URLs (Requirement 33) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Attached Documents ({appData.documents.length})
          </h3>

          {appData.documents.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No documents attached.</p>
          ) : (
            <div className="space-y-3">
              {appData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{doc.fileName}</p>
                      <p className="text-xs text-slate-400 font-mono">{(doc.fileSize / 1024).toFixed(1)} KB • {doc.documentType}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadDocument(doc.id)}
                    disabled={downloadingDocId === doc.id}
                    className="btn-tertiary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingDocId === doc.id ? 'Generating Link...' : 'Secure Download'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Audit History Trail (Requirement 19) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Status History Audit Trail</h3>
          </div>

          {appData.statusHistory.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Application is in initial pending state.</p>
          ) : (
            <div className="space-y-3">
              {appData.statusHistory.map((h) => (
                <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>Transition: {h.oldStatus || 'initial'} → <strong className="text-indigo-600">{h.newStatus}</strong></span>
                    <span className="text-slate-400 font-mono">
                      {new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {h.note && <p className="text-slate-600 font-medium pt-0.5">Note: "{h.note}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ApplicationDetails;
