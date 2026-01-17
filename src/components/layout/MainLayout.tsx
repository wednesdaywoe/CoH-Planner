/**
 * MainLayout component - overall app layout wrapper
 */

import type { ReactNode } from 'react';
import { Header } from './Header';
import { StatsDashboard } from './StatsDashboard';
import { EnhancementPicker } from '@/components/enhancements/EnhancementPicker';
import { PowerInfoTooltip } from '@/components/info';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />
      <StatsDashboard />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Global modals */}
      <EnhancementPicker />

      {/* Power info tooltip (follows mouse when enabled) */}
      <PowerInfoTooltip />
    </div>
  );
}
