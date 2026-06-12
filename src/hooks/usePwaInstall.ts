import { useEffect, useState, useCallback } from 'react';

/**
 * Surfaces the browser's PWA install prompt as an in-app action.
 *
 * Chromium (Chrome/Edge/Android) fires `beforeinstallprompt` once the app
 * meets installability criteria (valid manifest + an activated service
 * worker) and isn't already installed. We intercept it, suppress the
 * browser's default mini-infobar, and stash the event so a menu item can
 * trigger the native install dialog on demand.
 *
 * `canInstall` is therefore true only on Chromium, only when installable,
 * and only while not yet installed — elsewhere (Safari, Firefox, or an
 * already-installed PWA) it stays false and the caller renders nothing.
 * iOS/Safari has no install event or programmatic prompt by design, so it's
 * intentionally not covered here.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isRunningStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari's non-standard flag — harmless to check on other platforms.
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function usePwaInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already launched as an installed app — never offer to install again.
    if (isRunningStandalone()) {
      setInstalled(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      // Stop the browser from showing its own install banner; we drive it from
      // the menu instead.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } finally {
      // The captured event is single-use; drop it whether accepted or dismissed
      // (a later `appinstalled` covers the accepted case).
      setDeferred(null);
    }
  }, [deferred]);

  return { canInstall: !installed && deferred !== null, promptInstall };
}
