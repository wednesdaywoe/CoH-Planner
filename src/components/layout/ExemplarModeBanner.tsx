/**
 * ExemplarModeBanner — subtle reminder that Exemplar Mode is currently
 * scaling enhancement values down. Exemplar silently affects every
 * recharge / damage / defense number, so it's easy to forget the toggle
 * is on after a session. The banner is deliberately muted (slate, no
 * border accent) so it doesn't compete with the status / update /
 * Rule-of-5 banners — it's a passive reminder, not an alert.
 *
 * Includes an inline "Turn off" action because the whole reason this
 * banner exists is to make the toggle discoverable from anywhere; the
 * mode is controlled from the dashboard otherwise.
 */

import { useUIStore } from '@/stores/uiStore';

export function ExemplarModeBanner() {
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const toggleExemplarMode = useUIStore((s) => s.toggleExemplarMode);

  if (!exemplarMode) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-slate-800/80 text-slate-300 text-xs flex items-center justify-center gap-3 px-4 py-1 border-b border-slate-700/60"
    >
      <span>
        Exemplar Mode is on — stats scaled to level{' '}
        <span className="text-slate-100 font-medium">{exemplarLevel}</span>.
      </span>
      <button
        type="button"
        onClick={toggleExemplarMode}
        className="text-slate-400 hover:text-slate-100 underline underline-offset-2 transition-colors"
      >
        Turn off
      </button>
    </div>
  );
}
