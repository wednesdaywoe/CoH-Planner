import { useState } from 'react';

interface UpdateBannerProps {
  visible: boolean;
}

export function UpdateBanner({ visible }: UpdateBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  return (
    <div className="bg-amber-600/90 text-white text-sm flex items-center justify-center gap-3 px-4 py-1.5 flex-wrap">
      <span>A new version is available.</span>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-white font-medium transition-colors"
      >
        Refresh
      </button>
      <span className="text-white/70 text-xs">
        If your saved build powers appear at wrong levels, please remove and re-pick them to fix.
      </span>
      <button
        onClick={() => setDismissed(true)}
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
