import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { getMyApplications, getSignedDocumentUrl, replaceCustomerDocument } from '../services/api';
import { FolderArchive, Upload, Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const Documents = () => {
  useEffect(() => {
    document.title = 'Document Manager | Customer Portal';
    fetchDocuments();
  }, []);

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getMyApplications({ page: 1, limit: 20 });
      if (res && res.success) {
        const extracted = [];
        (res.data || []).forEach(a => {
          if (a.documents && a.documents.length > 0) {
            a.documents.forEach(d => {
              extracted.push({
                ...d,
                applicationId: a.applicationId,
                appUuid: a.id,
                serviceTitle: a.serviceTitle,
                appStatus: a.status
              });
            });
          }
        });
        setDocs(extracted);
      } else {
        setError(res.message || 'Failed to load documents.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading document manager.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (appUuid, docId) => {
    try {
      const res = await getSignedDocumentUrl(appUuid, docId);
      if (res && res.success && res.signedUrl) {
        window.open(res.signedUrl, '_blank');
      } else {
        alert('Failed to generate document download link.');
      }
    } catch (err) {
      alert('Error fetching signed document URL.');
    }
  };

  const handleReplacementUpload = async (docId, file) => {
    if (!file) return;

    setUploadingDocId(docId);
    setMsg('');
    setError('');

    try {
      const res = await replaceCustomerDocument(docId, file);
      if (res && res.success) {
        setMsg('Replacement document uploaded successfully. Status updated to Under Review.');
        await fetchDocuments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload replacement document.');
    } finally {
      setUploadingDocId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Document Manager | Customer Portal" description="View, download, and replace uploaded proof documents." noIndex={true} />

      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Document Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View uploaded identity proof documents, download signed copies, and upload replacement scans.
        </p>
      </div>

      {msg && <Alert type="success" title="Success">{msg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading uploaded document files..." />
      ) : docs.length === 0 ? (
        <EmptyState icon={FolderArchive} title="No Documents Uploaded" description="You have not uploaded any proof documents for your applications." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Application Ref</th>
                  <th className="p-3">File Name</th>
                  <th className="p-3">Document Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {docs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-indigo-600">{d.applicationId}</td>
                    <td className="p-3 font-bold text-slate-900">{d.fileName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px] uppercase">{d.documentType || 'Proof Document'}</span></td>
                    <td className="p-3">
                      {d.appStatus === 'document_required' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-500" /> Replacement Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Uploaded
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDownload(d.appUuid, d.id)}
                        className="btn-secondary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>

                      {d.appStatus === 'document_required' && (
                        <label className="btn-primary text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{uploadingDocId === d.id ? 'Uploading...' : 'Replace'}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleReplacementUpload(d.id, e.target.files[0])}
                          />
                        </label>
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

export default Documents;
