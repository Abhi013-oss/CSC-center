import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import { getNotices } from '../services/api';
import { Bell, Info, AlertTriangle, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

const typeBadges = {
  info: { label: 'Information', icon: Info, style: 'bg-blue-50 text-blue-700 border-blue-200' },
  warning: { label: 'Notice Alert', icon: AlertTriangle, style: 'bg-amber-50 text-amber-700 border-amber-200' },
  urgent: { label: 'Urgent Announcement', icon: AlertCircle, style: 'bg-red-50 text-red-700 border-red-200' },
  success: { label: 'Service Update', icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicNotices = async () => {
      try {
        const res = await getNotices();
        if (res && res.success) {
          setNotices(res.data || []);
        }
      } catch (err) {
        setError('Unable to load notice board updates.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNotices();
  }, []);

  const breadcrumbs = [
    { label: 'Public Notices', path: '/notices' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <SEO
        title="Public Notice Board | CSC Digital Service Center"
        description="Stay updated with the latest service announcements, document guidelines, and center operational notices."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="border-b border-slate-200 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 uppercase tracking-wider">
              Citizen Updates
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Public Notice Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official operational updates, holiday schedules, and document requirement advisories.
          </p>
        </div>

        {error && <Alert type="error" title="Error">{error}</Alert>}

        {loading ? (
          <Loading message="Loading public notices..." />
        ) : notices.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No active notice announcements.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((n) => {
              const badgeInfo = typeBadges[n.type] || typeBadges.info;
              const IconComp = badgeInfo.icon;

              return (
                <div key={n.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badgeInfo.style}`}>
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{badgeInfo.label}</span>
                    </span>

                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{n.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{n.content}</p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notices;
