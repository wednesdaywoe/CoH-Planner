import { useState } from 'react';
import type { ActiveStatus } from '@/hooks';

// Dismissal persists per-session: reloading shows the banner again so the
// user is re-informed if they returned mid-incident from a fresh tab.
const SESSION_KEY = 'coh-status-banner-dismissed';

interface StatusBannerProps {
  active: ActiveStatus | null;
}

export function StatusBanner({ active }: StatusBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (!active || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage unavailable (private mode etc.) — banner just won't
      // persist its dismissal, which is fine.
    }
  };

  const bgClass = active.status === 'down' ? 'bg-red-700/90' : 'bg-amber-600/90';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${bgClass} text-white text-sm flex items-center justify-center gap-3 px-4 py-1.5 flex-wrap`}
    >
      <span>{active.message}</span>
      <button
        onClick={handleDismiss}
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
