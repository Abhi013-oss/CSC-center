import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getEmailTemplates } from '../services/api';
import { Mail, FileText, Code } from 'lucide-react';

const EmailTemplates = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Notification Email Templates';
    fetchTemplates();
  }, []);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getEmailTemplates();
      if (res && res.success) {
        setTemplates(res.data || []);
      } else {
        setError(res.message || 'Failed to load templates.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading email templates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Notification Email Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Preview email notification body templates with placeholders (<code className="text-indigo-600 font-mono">{"{{customer_name}}"}</code>, <code className="text-indigo-600 font-mono">{"{{application_id}}"}</code>).
          </p>
        </div>
      </div>

      {error && <Alert type="error" title="Error">{error}</Alert>}

      {loading ? (
        <Loading message="Loading notification email templates..." />
      ) : templates.length === 0 ? (
        <EmptyState icon={Mail} title="No Templates Found" description="No email notification templates configured." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono font-bold text-xs text-indigo-600 uppercase">{t.templateKey}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Active Template</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase">Subject Line:</span>
                <p className="text-xs font-bold text-slate-900">{t.subject}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-line">
                {t.bodyHtml}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default EmailTemplates;
