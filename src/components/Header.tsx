import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, Cpu, Globe, Share2, Download } from 'lucide-react';
import { db } from '../db/schema';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC<{ activeTab?: string; onTabChange: (tab: string) => void }> = ({ onTabChange }) => {
  const { lang, setLang, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [conflictCount, setConflictCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [activeHost, setActiveHost] = useState('10.212.9.249:5173');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const port = window.location.port || '5173';
      const protocol = window.location.protocol;
      setActiveHost(`${protocol}//10.212.9.249:${port}`);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const interval = setInterval(async () => {
      const c = await db.conflicts.filter(c => c.surfaced_to_operator).count();
      setConflictCount(c);
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('To install on Mobile:\n• Android (Chrome): Tap menu (⋮) -> "Install App"\n• iOS (Safari): Tap Share (↑) -> "Add to Home Screen"');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <header style={{ backgroundColor: '#020617', borderBottom: '1px solid #334155', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6366f1' }}>{t('appTitle')}</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t('subtitle')}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Install PWA Button */}
            <button
              onClick={handleInstallPWA}
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '2px 8px',
                minHeight: '28px',
                fontSize: '0.725rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={12} />
              <span>Install App</span>
            </button>

            {/* AI Engine Status Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: isOnline ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isOnline ? '#818cf8' : '#fbbf24',
                border: `1px solid ${isOnline ? '#4f46e5' : '#b45309'}`,
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 600
              }}
            >
              <Cpu size={12} />
              <span>{isOnline ? t('geminiEngine') : t('localEngine')}</span>
            </div>

            {/* Online/Offline Status Indicator */}
            <div className={`badge ${isOnline ? 'badge-synced' : 'badge-draft'}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isOnline ? t('online') : t('airplaneMode')}</span>
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              style={{
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569',
                padding: '2px 8px',
                minHeight: '28px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700
              }}
            >
              <Globe size={12} />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {/* Conflict Badge Button */}
            {conflictCount > 0 && (
              <button
                onClick={() => onTabChange('conflicts')}
                className="badge badge-conflicted"
                style={{ cursor: 'pointer', border: 'none', padding: '2px 8px' }}
              >
                <AlertTriangle size={12} />
                <span>{conflictCount}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Network Access Banner */}
        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontWeight: 600 }}>
            <Share2 size={12} /> Venue Wi-Fi Access: <code style={{ backgroundColor: '#0f172a', padding: '1px 6px', borderRadius: '4px', color: '#60a5fa' }}>{activeHost}</code>
          </span>
          <span style={{ color: '#64748b' }}>PWA Status: <b>Standalone Ready</b></span>
        </div>
      </div>
    </header>
  );
};
