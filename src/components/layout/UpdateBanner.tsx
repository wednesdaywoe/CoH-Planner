import { useState } from 'react';
import { useUIStore } from '@/stores';

interface UpdateBannerProps {
  visible: boolean;
}

export function UpdateBanner({ visible }: UpdateBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const openWelcomeModal = useUIStore((s) => s.openWelcomeModal);

  if (!visible || dismissed) return null;

  return (
    <div className="bg-amber-600/90 text-white text-sm flex items-center justify-center gap-3 px-4 py-1.5 flex-wrap">
      <span>Sidekick has received an update! Please</span>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-white font-medium transition-colors"
      >
        Refresh
      </button>
      <span>
        your browser. Click{' '}
        <button
          onClick={openWelcomeModal}
          className="underline text-white hover:text-white/80 font-medium transition-colors"
        >
          here
        </button>
        {' '}to learn more.
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
