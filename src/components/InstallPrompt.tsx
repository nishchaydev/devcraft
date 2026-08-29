import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Info } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandaloneMatch =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone;
      setIsStandalone(Boolean(isStandaloneMatch));

      if ((window as any).deferredPwaPrompt) {
        setDeferredPrompt((window as any).deferredPwaPrompt);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        (window as any).deferredPwaPrompt = null;
        setDismissed(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isStandalone || dismissed) return null;

  return (
    <>
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '64px',
          left: 0,
          right: 0,
          backgroundColor: '#020617',
          borderTop: '2px solid #059669',
          padding: '10px 16px',
          zIndex: 50,
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                backgroundColor: '#059669',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Smartphone size={20} color="#ffffff" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Install DevCraft OMS
              </h4>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                Full-screen offline mobile application
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: '#10b981',
                color: '#020617',
                border: 'none',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <Download size={14} /> 📲 Install App
            </button>

            <button
              onClick={() => setDismissed(true)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Info size={18} /> Mobile App Installation Guide
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                🤖 Android (Google Chrome / Edge):
              </h4>
              <ol style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '20px', margin: 0 }}>
                <li>Tap the <b>three dots menu (⋮)</b> in top right.</li>
                <li>Tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.</li>
                <li>Tap <b>Install</b> to launch standalone!</li>
              </ol>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                🍎 iOS (Apple Safari):
              </h4>
              <ol style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '20px', margin: 0 }}>
                <li>Tap the <b>Share icon (↑)</b> in the bottom bar.</li>
                <li>Scroll down and tap <b>"Add to Home Screen"</b>.</li>
                <li>Tap <b>Add</b> to launch full-screen!</li>
              </ol>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="btn-primary"
              style={{ width: '100%', backgroundColor: '#4f46e5', minHeight: '40px' }}
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
