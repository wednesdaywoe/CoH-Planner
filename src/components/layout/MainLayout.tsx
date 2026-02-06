/**
 * MainLayout component - overall app layout wrapper
 */

import type { ReactNode } from 'react';
import { Header } from './Header';
import { StatsDashboard } from './StatsDashboard';
import { EnhancementPicker } from '@/components/enhancements/EnhancementPicker';
import { PowerInfoTooltip } from '@/components/info';
import { PowerInfoModal } from '@/components/modals';
import { useUIStore } from '@/stores';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const openFeedbackModal = useUIStore((s) => s.openFeedbackModal);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
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

      {/* Floating feedback button */}
      <button
        onClick={openFeedbackModal}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full shadow-lg transition-colors text-sm"
        style={{ border: '1px solid #d632ce' }}
        title="Send feedback or report a bug"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Feedback/Bugs
      </button>
    </div>
  );
}
