/**
 * MainLayout component - overall app layout wrapper
 */

import { useEffect, type ReactNode } from 'react';
import { Header } from './Header';
import { StatsDashboard } from './StatsDashboard';
import { UpdateBanner } from './UpdateBanner';
import { EnhancementPicker } from '@/components/enhancements/EnhancementPicker';
import { PowerInfoTooltip } from '@/components/info';
import { PowerInfoModal } from '@/components/modals';
import { useUIStore, useAuthStore } from '@/stores';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';
import { useUndoRedoKeyboard } from '@/hooks/useUndoRedoKeyboard';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const openFeedbackModal = useUIStore((s) => s.openFeedbackModal);
  const openKnownIssuesModal = useUIStore((s) => s.openKnownIssuesModal);
  const openHelpModal = useUIStore((s) => s.openHelpModal);
  const uiScale = useUIStore((s) => s.uiScale);
  const { updateAvailable } = useUpdateChecker();
  useUndoRedoKeyboard();
  const initializeAuth = useAuthStore((s) => s.initialize);

  // Initialize auth on mount (checks existing session, listens for changes)
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 flex flex-col"
      style={uiScale !== 1 ? { zoom: uiScale, overflowX: 'clip' as const } : undefined}
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

      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={openHelpModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-colors text-sm border border-blue-400"
          title="Help"
          aria-label="Open help"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help me
        </button>
        <button
          onClick={openKnownIssuesModal}
          className="flex items-center justify-center w-9 h-9 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors text-sm border border-slate-500"
          title="Known issues and roadmap"
          aria-label="Known issues and roadmap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </button>
        <button
          onClick={openFeedbackModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors text-sm"
          style={{ border: '1px solid #d632ce' }}
          title="Send feedback or report a bug"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Feedback/Bugs
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
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors text-sm border border-purple-500"
          title="Buy me a coffee!"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 18h10a2 2 0 002-2V8H5v8a2 2 0 002 2zM17 8h2a2 2 0 010 4h-2M8 2v3M12 2v3" />
          </svg>
          Buy me a coffee
        </button>
      </div>
    </div>
  );
}
