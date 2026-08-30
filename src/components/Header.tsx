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
    <header style={{ backgroundColor: '#f5f1ec', borderBottom: '1px solid #d3cec6', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111111', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.3px' }}>
              <span style={{ backgroundColor: '#111111', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>ic</span>
              <span>{t('appTitle')}</span>
              <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255, 86, 0, 0.1)', color: '#ff5600', border: '1px solid rgba(255, 86, 0, 0.3)', padding: '1px 6px', borderRadius: '9999px', fontWeight: 600 }}>Fin AI 2.0</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#626260' }}>{t('subtitle')}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Install PWA Button */}
            <button
              onClick={handleInstallPWA}
              style={{
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                minHeight: '28px',
                fontSize: '0.725rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
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
                backgroundColor: isOnline ? 'rgba(255, 86, 0, 0.08)' : 'rgba(242, 153, 74, 0.15)',
                color: isOnline ? '#ff5600' : '#f2994a',
                border: `1px solid ${isOnline ? 'rgba(255, 86, 0, 0.25)' : 'rgba(242, 153, 74, 0.4)'}`,
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 500
              }}
            >
              <Cpu size={12} />
              <span>{isOnline ? t('geminiEngine') : t('localEngine')}</span>
            </div>

            {/* Online/Offline Status Indicator */}
            <div 
              style={{ 
                padding: '2px 8px', 
                fontSize: '0.7rem', 
                borderRadius: '9999px',
                backgroundColor: isOnline ? 'rgba(39, 174, 96, 0.1)' : 'rgba(235, 87, 87, 0.1)',
                color: isOnline ? '#27ae60' : '#eb5757',
                border: `1px solid ${isOnline ? 'rgba(39, 174, 96, 0.3)' : 'rgba(235, 87, 87, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500
              }}
            >
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isOnline ? t('online') : t('airplaneMode')}</span>
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              style={{
                backgroundColor: '#ffffff',
                color: '#111111',
                border: '1px solid #d3cec6',
                padding: '2px 8px',
                minHeight: '28px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <Globe size={12} />
              <span>{lang === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {/* Conflict Badge Button */}
            {conflictCount > 0 && (
              <button
                onClick={() => onTabChange('conflicts')}
                style={{ 
                  cursor: 'pointer', 
                  border: 'none', 
                  padding: '2px 8px',
                  backgroundColor: 'rgba(255, 86, 0, 0.15)',
                  color: '#ff5600',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <AlertTriangle size={12} />
                <span>{conflictCount}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Network Access Banner */}
        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e5e0d8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', color: '#626260' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#27ae60', fontWeight: 500 }}>
            <Share2 size={12} /> Venue Wi-Fi Access: <code style={{ backgroundColor: '#ffffff', padding: '1px 6px', borderRadius: '4px', border: '1px solid #d3cec6', color: '#111111' }}>{activeHost}</code>
          </span>
          <span style={{ color: '#7b7b78' }}>PWA Status: <b>Standalone Ready</b></span>
        </div>
      </div>
    </header>
  );
};
