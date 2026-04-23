/**
 * MainLayout component - overall app layout wrapper
 */

import { useEffect, useState, type ReactNode } from 'react';
import { Header } from './Header';
import { StatsDashboard } from './StatsDashboard';
import { UpdateBanner } from './UpdateBanner';
import { EnhancementPicker } from '@/components/enhancements/EnhancementPicker';
import { PowerInfoTooltip } from '@/components/info';
import { PowerInfoModal } from '@/components/modals';
import { OnboardingBeacon } from '@/components/onboarding/OnboardingBeacon';
import { useUIStore, useAuthStore } from '@/stores';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';
import { useUndoRedoKeyboard } from '@/hooks/useUndoRedoKeyboard';
import { useTooltipHotkey } from '@/hooks/useTooltipHotkey';

// CSS `zoom` on the root div creates a coordinate-system mismatch with
// portals that render to document.body (notably the OnboardingBeacon). The
// UI-scale control is desktop-only now, but a value saved from a prior desktop
// session can still be read from localStorage on mobile — forcing zoom on a
// viewport that never exposes the control to change it. Gate the zoom by
// viewport width so mobile always renders unscaled regardless of stored value.
const MOBILE_MAX_WIDTH = 1024;

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const openFeedbackModal = useUIStore((s) => s.openFeedbackModal);
  const openChangelogModal = useUIStore((s) => s.openChangelogModal);
  const openHelpModal = useUIStore((s) => s.openHelpModal);
  const uiScale = useUIStore((s) => s.uiScale);
  const { updateAvailable } = useUpdateChecker();
  useUndoRedoKeyboard();
  useTooltipHotkey();
  const initializeAuth = useAuthStore((s) => s.initialize);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH
  );
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  // Initialize auth on mount (checks existing session, listens for changes)
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  const applyZoom = !isMobile && uiScale !== 1;

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 flex flex-col"
      style={applyZoom ? { zoom: uiScale, overflowX: 'clip' as const } : undefined}
    >
      <UpdateBanner visible={updateAvailable} />
      <Header />
      <StatsDashboard />
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Global modals */}
      <EnhancementPicker />
      <PowerInfoModal />

      {/* Power info tooltip (follows mouse when enabled) */}
      <PowerInfoTooltip />

      {/* Onboarding beacon - progressive feature discovery */}
      <OnboardingBeacon />

      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={openHelpModal}
          className="flex items-center justify-center w-9 h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-colors border border-blue-400"
          title="Help"
          aria-label="Open help"
          data-onboarding="help"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={openChangelogModal}
          className="flex items-center justify-center w-9 h-9 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors border border-slate-500"
          title="Changelog"
          aria-label="Changelog"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        <button
          onClick={openFeedbackModal}
          className="flex items-center justify-center w-9 h-9 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors"
          style={{ border: '1px solid #d632ce' }}
          title="Send feedback or report a bug"
          aria-label="Send feedback or report a bug"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
        <button
          onClick={() => {
            // Trigger the hidden BMC widget button to open its donation modal
            const bmcBtn = document.getElementById('bmc-wbtn');
            if (bmcBtn) {
              bmcBtn.style.display = 'block';
              bmcBtn.click();
              bmcBtn.style.display = 'none';
            } else {
              window.open('https://buymeacoffee.com/Wednesdaywoe', '_blank');
            }
          }}
          className="flex items-center gap-1.5 h-9 px-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors text-sm border border-purple-500"
          title="Buy me a coffee!"
          aria-label="Buy me a coffee"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 18h10a2 2 0 002-2V8H5v8a2 2 0 002 2zM17 8h2a2 2 0 010 4h-2M8 2v3M12 2v3" />
          </svg>
          Buy me a coffee
        </button>
      </div>
    </div>
  );
}
