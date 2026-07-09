/**
 * PlannerLayoutMenu — compact "Columns" popover for the rearrangeable planner.
 *
 * Lets the user show/hide each planner column and reset the arrangement for the
 * current view mode. Reordering itself is done by dragging column headers in the
 * desktop grid; this menu is the discoverable home for visibility + reset (and
 * the only way to bring a hidden column back).
 *
 * Desktop-only feature (lg+), so the trigger is hidden below lg.
 */

import { useEffect, useRef, useState } from 'react';
import { useUIStore, usePowerViewMode } from '@/stores';
import type { PlannerSectionId } from '@/types';

/** Human labels for every section id, across both view modes. */
const SECTION_LABELS: Record<PlannerSectionId, string> = {
  available: 'Available Powers',
  primary: 'Primary Powers',
  secondary: 'Secondary Powers',
  pool: 'Pool Powers',
  info: 'Power Info',
  bylevel: 'Powers by Level',
};

export function PlannerLayoutMenu() {
  const powerViewMode = usePowerViewMode();
  const view = powerViewMode === 'chronological' ? 'chronological' : 'category';
  const sections = useUIStore((s) => s.plannerLayout[view]);
  const setVisible = useUIStore((s) => s.setPlannerSectionVisible);
  const resetLayout = useUIStore((s) => s.resetPlannerLayout);
  const undocked = useUIStore((s) => s.infoPanel.undocked);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const visibleCount = sections.filter((s) => s.visible).length;

  return (
    <div ref={rootRef} className="relative hidden lg:block ml-auto flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-slate-300 hover:text-slate-100 hover:bg-slate-700/70 transition-colors"
        title="Show, hide, and reset planner columns (drag a column header to reorder)"
        aria-expanded={open}
      >
        {/* columns glyph */}
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5v13.5H3.75zM9 5.25v13.5M15 5.25v13.5" />
        </svg>
        <span className="font-medium">Columns</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 w-56 rounded-md border border-slate-700 bg-slate-800 shadow-xl shadow-black/40 p-2">
          <div className="px-1 pb-1.5 mb-1 border-b border-slate-700 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Columns ({visibleCount}/{sections.length})
            </span>
            <button
              onClick={() => resetLayout(view)}
              className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-700"
              title="Restore the default column order and visibility"
            >
              Reset
            </button>
          </div>
          <ul className="space-y-0.5">
            {sections.map((s) => {
              const isInfoFloating = s.id === 'info' && undocked;
              return (
                <li key={s.id}>
                  <label
                    className={`flex items-center gap-2 px-1.5 py-1 rounded text-xs cursor-pointer hover:bg-slate-700/70 ${
                      isInfoFloating ? 'opacity-60' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={s.visible}
                      disabled={isInfoFloating}
                      onChange={(e) => setVisible(view, s.id, e.target.checked)}
                      className="accent-[var(--color-primary)]"
                    />
                    <span className="text-slate-200">{SECTION_LABELS[s.id]}</span>
                    {isInfoFloating && (
                      <span className="ml-auto text-[9px] text-slate-500 uppercase tracking-wide">floating</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
          <p className="mt-1.5 pt-1.5 border-t border-slate-700 px-1 text-[10px] text-slate-500 leading-snug">
            Drag a column&apos;s header to reorder.
          </p>
        </div>
      )}
    </div>
  );
}
