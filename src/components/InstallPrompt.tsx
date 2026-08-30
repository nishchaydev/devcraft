import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, HelpCircle, CheckCircle2, Share } from 'lucide-react';

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
      {/* Fixed bottom floating banner */}
      <aside
        aria-label="PWA Installation Prompt"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-card-enter bg-white border border-[#d3cec6] rounded-xl shadow-xl p-3.5 flex items-center justify-between gap-3 text-[#111111]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#ff5600] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#111111] flex items-center gap-1.5 truncate">
              <span>Install via-P.A.A.R.</span>
              <span className="text-[10px] bg-[#ff5600]/10 text-[#ff5600] px-1.5 py-0.2 rounded font-mono font-medium">PWA</span>
            </h4>
            <p className="text-[11px] text-[#626260] truncate">
              Offline access &amp; instant loading
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-[#626260] hover:text-[#111111] hover:bg-[#faf8f5] rounded-md transition-colors cursor-pointer"
            aria-label="Dismiss installation banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Manual Installation Guide Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#ffffff] border border-[#d3cec6] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#d3cec6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ff5600]/10 text-[#ff5600] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 id="install-modal-title" className="text-sm font-semibold text-[#111111]">
                  How to Install via-P.A.A.R.
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#626260] hover:text-[#111111] p-1 rounded-md cursor-pointer"
                aria-label="Close installation guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#111111]">
              {/* Android */}
              <div className="bg-[#faf8f5] border border-[#d3cec6] rounded-xl p-3 space-y-1.5">
                <h4 className="font-semibold text-[#111111] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#ff5600]" /> Android (Chrome / Edge)
                </h4>
                <ol className="list-decimal list-inside text-[#626260] space-y-1 pl-1">
                  <li>Tap the <strong>three dots menu (⋮)</strong> in your browser.</li>
                  <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
                  <li>Confirm by clicking <strong>&quot;Install&quot;</strong>.</li>
                </ol>
              </div>

              {/* iOS */}
              <div className="bg-[#faf8f5] border border-[#d3cec6] rounded-xl p-3 space-y-1.5">
                <h4 className="font-semibold text-[#111111] flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5 text-[#ff5600]" /> iOS (Apple Safari)
                </h4>
                <ol className="list-decimal list-inside text-[#626260] space-y-1 pl-1">
                  <li>Tap the <strong>Share icon (↑)</strong> at the bottom of Safari.</li>
                  <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</li>
                  <li>Tap <strong>&quot;Add&quot;</strong> in the top-right corner.</li>
                </ol>
              </div>

              {/* Benefits */}
              <div className="space-y-1 pt-1">
                <p className="font-medium text-[#111111] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27ae60]" /> PWA Features Enabled:
                </p>
                <ul className="text-[#626260] text-[11px] list-disc list-inside space-y-0.5 pl-1">
                  <li>Zero-latency local database with Dexie.js</li>
                  <li>Offline order intake &amp; multi-device sync</li>
                  <li>Full-screen standalone native experience</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
