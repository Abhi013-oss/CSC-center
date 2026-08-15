import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { getNotices } from '../services/api';

const NoticeBar = () => {
  const [dismissed, setDismissed] = useState(false);
  const [notice, setNotice] = useState('Important: Online service assistance available. Contact our center for exact document requirements.');

  useEffect(() => {
    let isMounted = true;
    const fetchActiveNotice = async () => {
      try {
        const res = await getNotices();
        if (isMounted && res && res.success && res.data && res.data.length > 0) {
          setNotice(res.data[0].content);
        }
      } catch (err) {
        // Fallback default message on API delay/offline
      }
    };
    fetchActiveNotice();
    return () => { isMounted = false; };
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-slate-100 text-xs sm:text-sm py-2 px-4 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-indigo-600/90 text-white font-semibold text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Bell className="w-3 h-3" /> Notice
          </span>
          <span className="text-slate-300 font-medium truncate">
            {notice}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800 cursor-pointer shrink-0"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NoticeBar;
