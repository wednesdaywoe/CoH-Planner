/**
 * useDashboardCollapseHotkey - Toggle the collapsed stats dashboard with the D key
 *
 * Skips when focus is in text inputs (lets browser handle normal typing).
 */

import { useEffect } from 'react';
import { useUIStore } from '@/stores';

export function useDashboardCollapseHotkey() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        useUIStore.getState().toggleDashboardCollapsed();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
