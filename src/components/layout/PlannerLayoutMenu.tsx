/**
 * PlannerLayoutMenu — header dropdown for rearranging the planner columns.
 *
 * A popover in the same mould as the Menu (ActionMenu) and Options
 * (SettingsPopover) triggers it sits beside. View-aware ordered list with
 * up/down reorder + show/hide checkboxes + Reset, editing the persisted
 * `plannerLayout` slice live. Desktop-only feature (the trigger is hidden below
 * lg by the parent); dragging a column header in the grid reorders too.
 */

import { useEffect, useRef, useState } from 'react';
import { useUIStore, usePowerViewMode } from '@/stores';
import { shiftColumn } from '@/utils/planner-layout';
import type { PlannerSectionId } from '@/types';

const SECTION_LABELS: Record<PlannerSectionId, string> = {
  available: 'Available Powers',
  primary: 'Primary Powers',
  secondary: 'Secondary Powers',
  pool: 'Pool & Epic Powers',
  inherent: 'Inherent Powers',
  info: 'Power Info',
  bylevel: 'Powers by Level',
};

export function PlannerLayoutMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const powerViewMode = usePowerViewMode();
  const view = powerViewMode === 'chronological' ? 'chronological' : 'category';
  const sections = useUIStore((s) => s.plannerLayout[view]);
  const reorder = useUIStore((s) => s.reorderPlannerSections);
  const setVisible = useUIStore((s) => s.setPlannerSectionVisible);
  const resetLayout = useUIStore((s) => s.resetPlannerLayout);
  const undocked = useUIStore((s) => s.infoPanel.undocked);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // Move a section one column left/right (popping it into its own column). The
  // menu handles the horizontal axis + show/hide; creating vertical stacks is a
  // drag-only gesture (drag a header onto another column's top/bottom edge).
  const move = (id: PlannerSectionId, dir: -1 | 1) => {
    reorder(view, shiftColumn(sections, id, dir));
  };

  const visibleCount = sections.filter((s) => s.visible).length;
  const columnCount = new Set(
    sections.filter((s) => s.visible).map((s) => s.column ?? -1),
  ).size;

  return (
    <div className="relative hidden lg:block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        data-onboarding="planner-layout"
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-[var(--color-link)] hover:text-white bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 border border-[var(--color-primary)]/40 rounded transition-colors"
        title="Planner Layout — rearrange, show, and hide the planner columns"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5.25h16v13.5H4zM9.333 5.25v13.5M14.667 5.25v13.5" />
        </svg>
        <span className="hidden sm:inline">Layout</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-[300px] z-[60]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Planner Layout
            </h3>
            <button
              onClick={() => resetLayout(view)}
              className="text-[11px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-gray-700 transition-colors"
              title="Restore the default column order and visibility"
            >
              Reset
            </button>
          </div>

          <p className="text-[11px] text-gray-500 mb-2 leading-snug">
            {view === 'chronological' ? 'By Level' : 'By Powerset'} view · {visibleCount}/{sections.length} shown in {columnCount} column{columnCount === 1 ? '' : 's'}.
            Drag a column&apos;s header onto another&apos;s top/bottom edge to stack.
          </p>

          <ul className="space-y-1">
            {sections.map((s, i) => {
              const isInfoFloating = s.id === 'info' && undocked;
              return (
                <li
                  key={s.id}
                  className="flex items-center gap-2 rounded border border-gray-700 bg-gray-900/50 px-2 py-1.5"
                >
                  {/* Column shift controls (left / right) */}
                  <div className="flex items-center -mx-1">
                    <button
                      onClick={() => move(s.id, -1)}
                      className="text-gray-500 hover:text-gray-200 leading-none transition-colors"
                      title="Move to the column on the left"
                      aria-label={`Move ${SECTION_LABELS[s.id]} left`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => move(s.id, 1)}
                      className="text-gray-500 hover:text-gray-200 leading-none transition-colors"
                      title="Move to the column on the right"
                      aria-label={`Move ${SECTION_LABELS[s.id]} right`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <span className="text-xs text-gray-500 tabular-nums w-4 text-center" title="Column">{(s.column ?? i) + 1}</span>
                  <span className="text-sm text-gray-200 flex-1">{SECTION_LABELS[s.id]}</span>

                  {isInfoFloating && (
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">floating</span>
                  )}

                  <label
                    className={`flex items-center gap-1.5 text-xs cursor-pointer ${isInfoFloating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isInfoFloating ? 'Info panel is popped out — re-dock it to place it in the grid' : 'Show this column'}
                  >
                    <input
                      type="checkbox"
                      checked={s.visible}
                      disabled={isInfoFloating}
                      onChange={(e) => setVisible(view, s.id, e.target.checked)}
                      className="accent-[var(--color-primary)]"
                    />
                    <span className="text-gray-400">Shown</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
