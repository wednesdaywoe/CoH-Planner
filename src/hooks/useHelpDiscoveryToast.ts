/**
 * useHelpDiscoveryToast — pointer toast for the searchable help system.
 *
 * Fires a few seconds after each app load. Users who don't want it can
 * permanently disable it via Settings → "Help hint on launch".
 */

import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

const SHOW_DELAY_MS = 4000;

export function useHelpDiscoveryToast() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!useUIStore.getState().helpToastEnabled) return;

    const timer = window.setTimeout(() => {
      // Re-check at fire time in case the user disabled it during the delay.
      const ui = useUIStore.getState();
      if (!ui.helpToastEnabled) return;
      ui.showToast({
        message:
          'Did you know there is a searchable help system? Click the❔button below (or Menu tab on mobile).',
        tone: 'info',
        durationMs: 14000,
        action: {
          label: 'Open Help',
          onClick: () => {
            useUIStore.getState().openHelpModal();
          },
        },
      });
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);
}
