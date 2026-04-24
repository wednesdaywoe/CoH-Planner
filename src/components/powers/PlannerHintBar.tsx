/**
 * PlannerHintBar
 *
 * Thin contextual-help strip sandwiched between the dashboard/quickbar and
 * the power column grid. Text comes from the `hoverHint` field of uiStore —
 * components emit a hint string on mouseenter and clear it on mouseleave.
 * When no hint is active the bar shows an idle placeholder so layout stays
 * stable.
 */

import { useUIStore } from '@/stores';

export function PlannerHintBar() {
  const hint = useUIStore((s) => s.hoverHint);

  return (
    <div className="hidden md:flex border-b border-slate-700 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-300 min-h-[1.75rem] items-center flex-shrink-0">
      {hint ? (
        <span className="truncate">{hint}</span>
      ) : (
        <span className="text-slate-400 italic">Press D to toggle the dashboard. Press T to toggle the responsive info panel. while info panel is open, hold shift to make it persist.</span>
      )}
    </div>
  );
}
