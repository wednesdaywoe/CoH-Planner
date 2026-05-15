/**
 * RuleOf5Banner — educational banner shown when the current build has any
 * set bonus that has been rejected by the Rule of 5 (the 6th+ identical
 * value is ignored by the game). Users were missing the orange-ring +
 * strikethrough indicators on the dashboard tiles, so this surfaces it
 * up-front the first time a build crosses the rule.
 *
 * Controlled by the `ruleOf5AlertEnabled` setting (Settings → Rule of 5
 * alert). The X button dismisses for the current session; turning the
 * setting off suppresses it permanently.
 */

import { useState, useMemo } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useCharacterCalculation } from '@/hooks/useCalculatedStats';

const SESSION_KEY = 'coh-rule-of-5-banner-dismissed';

export function RuleOf5Banner() {
  const enabled = useUIStore((s) => s.ruleOf5AlertEnabled);
  const openHelpModal = useUIStore((s) => s.openHelpModal);
  const { breakdown } = useCharacterCalculation();

  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  // Count capped sources directly from the breakdown map. This catches BOTH
  // capped set bonuses (e.g. six 7.5% Recharge sets) and capped procs (e.g.
  // six LotG +Recharge — tracked as procs with their own Rule of 5, not
  // through the set-bonus tracking object).
  const cappedCount = useMemo(() => {
    if (!enabled) return 0;
    let n = 0;
    for (const stat of breakdown.values()) {
      for (const source of stat.sources) {
        if (source.capped) n++;
      }
    }
    return n;
  }, [breakdown, enabled]);

  if (!enabled || dismissed || cappedCount === 0) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage unavailable — dismissal just won't persist.
    }
  };

  const label = cappedCount === 1 ? 'set bonus is' : 'set bonuses are';

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-600/90 text-white text-sm flex items-center justify-center gap-3 px-4 py-2 flex-wrap border-b border-amber-700"
    >
      <span className="font-medium">Rule of 5:</span>
      <span>
        {cappedCount} {label} over the cap and not counting. They show up
        with <span className="line-through">strikethrough orange</span> in
        the stat tooltips, and affected stats have an orange ring.
      </span>
      <button
        type="button"
        onClick={() => openHelpModal('ds-rule-of-5')}
        className="underline underline-offset-2 hover:text-white/90"
      >
        Learn more
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-1 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss for this session"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
