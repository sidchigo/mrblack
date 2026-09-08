'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallPwaProps {
  className?: string;
  isDrawer?: boolean;
}

export function InstallPwaButton({ className = '', isDrawer = false }: InstallPwaProps) {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isIos, setIsIos] = React.useState(false);
  const [showIosGuide, setShowIosGuide] = React.useState(false);

  React.useEffect(() => {
    // Check if already in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Check iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      alert('To install Mr. Black on this device: open your browser menu (⋮ or Share) and tap "Install App" or "Add to Home Screen".');
    }
  };

  // If already installed, hide quietly
  if (isInstalled) {
    return null;
  }

  if (isDrawer) {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-discord-green" />
            <span>Install App (Offline Ready)</span>
          </div>
          <span className="text-[10px] text-discord-green font-bold uppercase tracking-wider">
            Free PWA
          </span>
        </button>

        {/* iOS Safari Instruction Modal */}
        {showIosGuide && (
          <div
            onClick={() => setShowIosGuide(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-discord-surface-indigo border border-white/15 rounded-xl p-5 space-y-4 text-white text-xs shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-discord-green" />
                <h3 className="text-sm font-bold font-discord-headline uppercase">
                  Install Mr. Black on iOS
                </h3>
              </div>
              <div className="space-y-2 text-discord-muted leading-relaxed">
                <p>
                  1. Tap the <strong className="text-white">Share</strong> button in Safari toolbar at bottom.
                </p>
                <p>
                  2. Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong>.
                </p>
                <p>
                  3. Tap <strong className="text-white">&quot;Add&quot;</strong> in top right to launch offline anytime.
                </p>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-2.5 rounded-xl bg-discord-primary hover:bg-discord-primary-hover text-white font-bold uppercase text-xs"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install Mr. Black as App"
        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white/90 hover:text-white border border-white/10 transition-all active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-discord-green" />
        <span>Install App</span>
      </button>

      {/* iOS Safari Instruction Modal */}
      {showIosGuide && (
        <div
          onClick={() => setShowIosGuide(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-discord-surface-indigo border border-white/15 rounded-xl p-5 space-y-4 text-white text-xs shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-discord-green" />
              <h3 className="text-sm font-bold font-discord-headline uppercase">
                Install Mr. Black on iOS
              </h3>
            </div>
            <div className="space-y-2 text-discord-muted leading-relaxed">
              <p>
                1. Tap the <strong className="text-white">Share</strong> button in Safari toolbar at bottom.
              </p>
              <p>
                2. Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong>.
              </p>
              <p>
                3. Tap <strong className="text-white">&quot;Add&quot;</strong> in top right. You&apos;re ready to play offline anytime!
              </p>
            </div>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-discord-primary hover:bg-discord-primary-hover text-white font-bold uppercase text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
