import { useRegisterSW } from 'virtual:pwa-register/react';
import { useUIStore } from '@/stores';

/**
 * "Update available" banner, driven by the service worker lifecycle.
 *
 * vite-plugin-pwa (registerType: 'prompt') installs a new SW in the
 * background on each deploy and parks it in the "waiting" state — at that
 * point `needRefresh` flips true. We surface this banner and only activate
 * the new build when the user clicks Refresh (`updateServiceWorker(true)`
 * calls skipWaiting and reloads). Dismiss just hides it for now; it returns
 * on the next load while an update is still pending.
 *
 * (Replaces the old version.json polling in useUpdateChecker.)
 */
export function UpdateBanner() {
  const openWelcomeModal = useUIStore((s) => s.openWelcomeModal);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="bg-amber-600/90 text-on-warning text-sm flex items-center justify-center gap-3 px-4 py-1.5 flex-wrap">
      <span>Sidekick has received an update! Please</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-white font-medium transition-colors"
      >
        Refresh
      </button>
      <span>
        to load it. Click{' '}
        <button
          onClick={openWelcomeModal}
          className="underline text-white hover:text-white/80 font-medium transition-colors"
        >
          here
        </button>
        {' '}to learn more.
      </span>
      <button
        onClick={() => setNeedRefresh(false)}
        className="ml-1 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
