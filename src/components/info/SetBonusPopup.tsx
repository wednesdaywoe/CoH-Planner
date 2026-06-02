/**
 * SetBonusPopup — the build's active set-bonus totals, grouped the CoH way
 * (General / Health & Endurance / Defense / Resistance / Mez-Debuff Res /
 * Movement) and flowed into responsive columns. Each row reveals every
 * contributing set + the power it's slotted in; Rule-of-5-capped (wasted)
 * contributions are dimmed.
 *
 * Two presentations share one data path (`useBonusTracking()` — the same
 * Rule-of-5 tracking the dashboard uses, so totals match exactly):
 *   • Desktop: a floating draggable/resizable window (mirrors PopOutInfoPanel);
 *     rows reveal their breakdown on hover.
 *   • Touch: the standard Modal sheet (no drag/resize needed); rows tap to
 *     expand their breakdown inline, since touch can't hover.
 *
 * Grouping lives in `@/data/set-bonus-groups`, keyed by the *normalized* stat
 * names (e.g. "defEnergy") the engine emits.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore } from '@/stores';
import { useBonusTracking, useIsTouchDevice } from '@/hooks';
import { Tooltip } from '@/components/ui';
import { Modal } from '@/components/modals/Modal';
import { formatBonusValue } from '@/utils/set-bonus-format';
import { STAT_GROUP_INFO, SET_BONUS_GROUP_ORDER } from '@/data/set-bonus-groups';
import type { ValueTracking } from '@/utils/calculations/set-bonuses';

const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 480;
const MIN_WIDTH = 220;
const MIN_HEIGHT = 200;

/** Humanize an unmapped stat key for the Misc fallback. */
function statLabel(stat: string): string {
  return stat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

interface StatRow {
  stat: string;
  group: string;
  label: string;
  /** Effective total (Rule-of-5 respected — capped instances excluded). */
  total: number;
  buckets: ValueTracking[];
  wastedCount: number;
}

interface BonusGroup {
  group: string;
  order: number;
  rows: StatRow[];
  wastedCount: number;
}

export function SetBonusPopup() {
  const isTouch = useIsTouchDevice();
  const closeSetBonusPopup = useUIStore((s) => s.closeSetBonusPopup);
  const tracking = useBonusTracking();

  const groups = useMemo<BonusGroup[]>(() => {
    // group → label → row (dedupe paired stats, keeping the larger total)
    const byGroup = new Map<string, Map<string, StatRow>>();

    for (const [stat, byValue] of Object.entries(tracking)) {
      const buckets = Object.values(byValue).sort((a, b) => b.value - a.value);
      if (buckets.length === 0) continue;
      let total = 0;
      let wastedCount = 0;
      for (const b of buckets) {
        total += b.value * b.sources.length; // accepted (counted) instances only
        wastedCount += b.rejectedSources.length;
      }
      if (total === 0 && wastedCount === 0) continue;

      const info = STAT_GROUP_INFO[stat] ?? { group: 'Misc', label: statLabel(stat) };
      const row: StatRow = { stat, group: info.group, label: info.label, total, buckets, wastedCount };

      let labels = byGroup.get(info.group);
      if (!labels) byGroup.set(info.group, (labels = new Map()));
      const existing = labels.get(info.label);
      if (!existing || row.total > existing.total) labels.set(info.label, row);
    }

    return Array.from(byGroup.entries())
      .map(([group, labels]) => {
        const rows = Array.from(labels.values()).sort((a, b) => a.label.localeCompare(b.label));
        const idx = SET_BONUS_GROUP_ORDER.indexOf(group);
        return {
          group,
          order: idx === -1 ? 999 : idx,
          rows,
          wastedCount: rows.reduce((sum, r) => sum + r.wastedCount, 0),
        };
      })
      .sort((a, b) => a.order - b.order || a.group.localeCompare(b.group));
  }, [tracking]);

  // Tap-to-expand state (touch only).
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpanded = useCallback((stat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(stat)) next.delete(stat);
      else next.add(stat);
      return next;
    });
  }, []);

  // ---- Floating window position/size + drag/resize (desktop only) ----
  const [pos, setPos] = useState(() => ({
    x: Math.max(16, window.innerWidth - DEFAULT_WIDTH - 16),
    y: 96,
  }));
  const [size, setSize] = useState({ w: DEFAULT_WIDTH, h: DEFAULT_HEIGHT });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos.x, pos.y]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
  }, [size.w, size.h]);

  useEffect(() => {
    if (isTouch) return; // no drag/resize listeners on touch
    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - dragOffset.current.y));
        setPos({ x: newX, y: newY });
      }
      if (resizing.current) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          w: Math.max(MIN_WIDTH, resizeStart.current.w + dx),
          h: Math.max(MIN_HEIGHT, resizeStart.current.h + dy),
        });
      }
    };
    const onMouseUp = () => {
      dragging.current = false;
      resizing.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isTouch]);

  // ---- Shared bits ----
  const wastedDot = (n: number) =>
    n > 0 ? (
      <span className="text-amber-500/80 ml-0.5 shrink-0" title={`${n} contribution(s) exceed the Rule of 5`}>⚠</span>
    ) : null;

  const valueSpan = (v: number) => (
    <span className="tabular-nums font-medium text-emerald-300 shrink-0">+{formatBonusValue(v)}%</span>
  );

  const renderBuckets = (row: StatRow) => (
    <div className="space-y-0.5">
      {row.buckets.map((b) => (
        <div key={b.value}>
          {b.sources.map((s, i) => (
            <div key={`a${i}`} className="flex justify-between gap-3 text-slate-300">
              <span className="truncate">{s.name}</span>
              <span className="tabular-nums text-emerald-300 shrink-0">+{formatBonusValue(b.value)}%</span>
            </div>
          ))}
          {b.rejectedSources.map((s, i) => (
            <div key={`r${i}`} className="flex justify-between gap-3 text-slate-500">
              <span className="truncate line-through">{s.name}</span>
              <span className="tabular-nums shrink-0 text-amber-500/80">over R5</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderBreakdown = (title: string, row: StatRow) => (
    <div className="text-xs space-y-1 max-w-[320px]">
      <div className="font-semibold text-slate-100">
        {title}: <span className="text-emerald-300">+{formatBonusValue(row.total)}%</span>
      </div>
      {renderBuckets(row)}
    </div>
  );

  /** The grouped list, rendered for hover (desktop) or tap-expand (touch). */
  const renderGroups = () => {
    if (groups.length === 0) {
      return (
        <div className="px-1 py-3 text-xs text-slate-500 italic">
          No set bonuses active. Slot 2+ pieces of an IO set to see its bonuses here.
        </div>
      );
    }
    return (
      // Desktop: balanced multi-column. Touch: single column so tap-expand
      // doesn't reflow columns.
      <div className={isTouch ? '' : 'columns-[150px] gap-2'}>
        {groups.map((g) => (
          <div key={g.group} className="break-inside-avoid mb-2 rounded border border-slate-700/70 bg-slate-800/30">
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-700/70 flex items-center gap-1">
              <span className="truncate">{g.group}</span>
              {wastedDot(g.wastedCount)}
            </div>
            {g.rows.map((r) =>
              isTouch ? (
                <div key={r.stat}>
                  <button
                    onClick={() => toggleExpanded(r.stat)}
                    className="w-full flex items-baseline justify-between gap-2 px-2 py-1.5 text-xs text-left hover:bg-slate-800/70 active:bg-slate-700/70"
                  >
                    <span className="text-slate-300 truncate flex items-baseline">
                      <span className={`mr-1 text-[9px] transition-transform ${expanded.has(r.stat) ? 'rotate-90' : ''}`}>▶</span>
                      {r.label}
                      {wastedDot(r.wastedCount)}
                    </span>
                    {valueSpan(r.total)}
                  </button>
                  {expanded.has(r.stat) && (
                    <div className="px-2 pb-1.5 pt-1 text-xs border-t border-slate-700/40 bg-slate-900/40">
                      {renderBuckets(r)}
                    </div>
                  )}
                </div>
              ) : (
                <Tooltip key={r.stat} content={renderBreakdown(`${g.group} · ${r.label}`, r)} position="left">
                  <div className="flex items-baseline justify-between gap-2 px-2 py-0.5 text-xs hover:bg-slate-800/70 cursor-default">
                    <span className="text-slate-300 truncate">
                      {r.label}
                      {wastedDot(r.wastedCount)}
                    </span>
                    {valueSpan(r.total)}
                  </div>
                </Tooltip>
              )
            )}
          </div>
        ))}
      </div>
    );
  };

  // ---- Touch: standard Modal sheet ----
  if (isTouch) {
    return (
      <Modal isOpen onClose={closeSetBonusPopup} title="Set Bonus Totals" size="md">
        <div className="p-2">{renderGroups()}</div>
      </Modal>
    );
  }

  // ---- Desktop: floating draggable/resizable window ----
  return createPortal(
    <div
      className="fixed z-50 flex flex-col bg-slate-900 border border-slate-600 rounded-lg shadow-2xl overflow-hidden"
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 shrink-0 cursor-move select-none"
        onMouseDown={onDragStart}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Set Bonus Totals</h2>
        <button
          onClick={closeSetBonusPopup}
          className="flex items-center justify-center w-6 h-6 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          title="Close"
          aria-label="Close set bonus totals"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">{renderGroups()}</div>

      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={onResizeStart}>
        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 16 16" fill="currentColor">
          <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z" />
        </svg>
      </div>
    </div>,
    document.body
  );
}

export default SetBonusPopup;
