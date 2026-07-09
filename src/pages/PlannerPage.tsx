/**
 * PlannerPage - Main build planner interface
 *
 * Two view modes:
 * 1. Category View (default):
 *    Available Powers · Selected Primary · Selected Secondary · Pool/Epic · Info
 * 2. Chronological View (Mids-style):
 *    Available Powers · Powers by Level (wide) · Info
 *
 * Desktop (lg+) columns are **rearrangeable**: order + visibility come from
 * `uiStore.plannerLayout[view]` (persisted). Users drag a column's header grip to
 * reorder, and the Columns menu (in the hint bar) shows/hides/reset columns.
 * Below lg the layout falls back to the fixed responsive stack/split — reordering
 * on a phone isn't a real use case and the md split is bespoke.
 */

import { useRef, useState } from 'react';
import { useBuildStore, useUIStore, usePowerViewMode } from '@/stores';
import { useUrlBuildSync } from '@/utils/url-build-sync';
import { AvailablePowers } from '@/components/powers/AvailablePowers';
import { AvailablePoolPowers } from '@/components/powers/AvailablePoolPowers';
import { SelectedPowers } from '@/components/powers/SelectedPowers';
import { PoolPowers, EpicPowers, InherentPowers } from '@/components/powers/PoolPowers';
import { PlannerHintBar } from '@/components/powers/PlannerHintBar';
import { ChronologicalPowerView } from '@/components/powers/ChronologicalPowerView';
import { InfoPanel } from '@/components/info/InfoPanel';
import { PopOutInfoPanel } from '@/components/info/PopOutInfoPanel';
import { SetBonusPopup } from '@/components/info/SetBonusPopup';
import { Toggle, CollapsibleSection } from '@/components/ui';
import { ViewModeToggle } from '@/components/ui/ViewModeToggle';
import { MAX_POWER_PICKS, getArchetype } from '@/data';
import type { Power, PlannerSectionId } from '@/types';
import { toColumns, applyDrop, type DropZone } from '@/utils/planner-layout';

/** Undock button icon (box with arrow pointing out) */
function UndockButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
      title="Pop out info panel into separate window"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </button>
  );
}

/** Minimum rendered width for any planner column. The min-size audit (see
 *  streams/REARRANGEABLE_LAYOUT_PLAN.md) put the widest clean-render floor at
 *  Available's ~260px, but its internal Primary|Secondary split is now
 *  container-query responsive (stacks to one column below ~280px), dropping
 *  Available to ~200px. The remaining binding floors are Selected (6-slot row +
 *  ghost + toggle, ~240px) and Info (stat tables h-scroll below ~240px), so 240
 *  is the safe global clamp — and it fits all six columns in 1440px. The grid
 *  uses `minmax(MIN, …fr)` so columns hold this floor (grid overflow-scrolls
 *  rather than deforming) and the resize drag clamps neighbors to it. */
const MIN_COL_PX = 240;

/** Minimum rendered height for a stacked cell (LAY11). The min-size audit found
 *  the vertical axis render-safe — every body is `flex-1 overflow-y-auto`, so
 *  shrinking height just scrolls — so this is a UX floor (keep a stacked cell
 *  usable), not a clip constraint. The vertical resize drag clamps both
 *  neighbors to it. */
const MIN_CELL_PX = 120;

/** Colored edge bar marking where a dragged section will land (LAY11 drop zones). */
function dropEdgeStyle(zone: DropZone): React.CSSProperties {
  const t = 3;
  switch (zone) {
    case 'above': return { top: 0, left: 0, right: 0, height: t };
    case 'below': return { bottom: 0, left: 0, right: 0, height: t };
    case 'colBefore': return { top: 0, bottom: 0, left: 0, width: t };
    case 'colAfter': return { top: 0, bottom: 0, right: 0, width: t };
  }
}

/** Drag-handle grip shown in each desktop column header. Resting contrast lifted
 *  (slate-500, was slate-600) so the reorder affordance reads without hover — the
 *  header twin of the always-on divider seam (LAY12 discoverability). */
function GripHandle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
      title="Drag to reorder this column"
      aria-label="Reorder column"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
      </svg>
    </div>
  );
}

/** Shared resize divider straddling the gap between two columns (`axis='x'`,
 *  vertical seam) or two stacked cells (`axis='y'`, horizontal seam). Both LAY7's
 *  horizontal resize and LAY11's vertical resize route through this one element so
 *  the discoverability treatment stays in a single place (LAY12).
 *
 *  Treatment: the *persistent* resting cue is the thin frame each cell carries
 *  (`ring-slate-600`, one step brighter than the `bg-slate-700` gap it sits on) —
 *  it reads the whole panel as an adjustable tile, not a lone hairline. So this
 *  divider only needs to mark the *grab edge* on hover: it brightens that edge to
 *  the primary color and thickens to 2px. The hit area (w-2 / h-2) stays wider
 *  than the visible edge for an easy grab. */
function ResizeDivider({
  axis,
  onPointerDown,
}: {
  axis: 'x' | 'y';
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const isX = axis === 'x';
  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute z-20 group/resize ${
        isX
          ? 'top-0 bottom-0 right-0 w-2 translate-x-1/2 cursor-col-resize'
          : 'left-0 right-0 bottom-0 h-2 translate-y-1/2 cursor-row-resize'
      }`}
      title={isX ? 'Drag to resize columns' : 'Drag to resize stacked sections'}
      aria-label={isX ? 'Resize column' : 'Resize stacked section'}
    >
      <div
        className={`absolute bg-transparent group-hover/resize:bg-[var(--color-primary)] transition-colors ${
          isX
            ? 'inset-y-0 left-1/2 -translate-x-1/2 w-px group-hover/resize:w-0.5'
            : 'inset-x-0 top-1/2 -translate-y-1/2 h-px group-hover/resize:h-0.5'
        }`}
      />
    </div>
  );
}

/** What a section renders. Bodies are single-sourced so the desktop grid and the
 *  mobile/md fallback share identical content. */
interface SectionDescriptor {
  title: React.ReactNode;
  headerRight?: React.ReactNode;
  body: React.ReactNode;
  bodyClassName: string;
  onboarding?: string;
}

export function PlannerPage() {
  useUrlBuildSync();
  const build = useBuildStore((s) => s.build);
  const addPower = useBuildStore((s) => s.addPower);
  const tooltipEnabled = useUIStore((s) => s.infoPanel.tooltipEnabled);
  const toggleInfoPanelTooltip = useUIStore((s) => s.toggleInfoPanelTooltip);
  const undocked = useUIStore((s) => s.infoPanel.undocked);
  const setBonusPopupOpen = useUIStore((s) => s.setBonusPopupOpen);
  const undockInfoPanel = useUIStore((s) => s.undockInfoPanel);
  const powerViewMode = usePowerViewMode();
  const view = powerViewMode === 'chronological' ? 'chronological' : 'category';
  const sections = useUIStore((s) => s.plannerLayout[view]);
  const reorderPlannerSections = useUIStore((s) => s.reorderPlannerSections);
  const setPlannerSectionWeights = useUIStore((s) => s.setPlannerSectionWeights);
  const setPlannerSectionRowWeights = useUIStore((s) => s.setPlannerSectionRowWeights);

  // Desktop drag-reorder state (native HTML5 DnD; a 6-item reorder doesn't
  // warrant a DnD library dependency). LAY11: a drop now carries a zone
  // (stack above/below vs. new column left/right of the target cell).
  const [dragId, setDragId] = useState<PlannerSectionId | null>(null);
  const [overId, setOverId] = useState<PlannerSectionId | null>(null);
  const [overZone, setOverZone] = useState<DropZone | null>(null);
  // Per-cell collapse (ephemeral, like the old inherent-group collapse it
  // replaces): a collapsed cell hides its body and shrinks to its header bar.
  // Lives at the cell level because the atomic inherent-group cells are
  // `headerless` — the cell header is their only collapse affordance.
  const [collapsedCells, setCollapsedCells] = useState<Set<PlannerSectionId>>(() => new Set());
  const toggleCollapsed = (id: PlannerSectionId) =>
    setCollapsedCells((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  // Grid element ref — needed to measure usable px width when converting a
  // resize-drag delta into fr weights.
  const gridRef = useRef<HTMLDivElement>(null);

  // Check if 24-power limit reached (exclude auto-granted form sub-powers)
  const countNonGranted = (powers: { isAutoGranted?: boolean }[]) =>
    powers.filter(p => !p.isAutoGranted).length;
  const totalPowers =
    countNonGranted(build.primary.powers) +
    countNonGranted(build.secondary.powers) +
    build.pools.reduce((sum, pool) => sum + countNonGranted(pool.powers), 0) +
    (build.epicPool ? countNonGranted(build.epicPool.powers) : 0);
  const powerLimitReached = totalPowers >= MAX_POWER_PICKS;

  // Get powerset IDs and selected power names
  const primaryPowersetId = build.primary.id;
  const secondaryPowersetId = build.secondary.id;
  const primarySelectedNames = build.primary.powers.map((p) => p.name);
  const secondarySelectedNames = build.secondary.powers.map((p) => p.name);

  const handleSelectPrimaryPower = (power: Power) => {
    addPower('primary', {
      ...power,
      powerSet: primaryPowersetId || '',
      level: build.level,
      slots: [null],
    });
  };

  const handleSelectSecondaryPower = (power: Power) => {
    addPower('secondary', {
      ...power,
      powerSet: secondaryPowersetId || '',
      level: build.level,
      slots: [null],
    });
  };

  // Derive branch powerset IDs for VEAT combined display
  const selectedBranch = useUIStore((s) => s.selectedBranch);
  const archetype = build.archetype.id ? getArchetype(build.archetype.id) : null;
  const branchDef = selectedBranch && archetype?.branches?.[selectedBranch] || null;
  const branchPrimaryId = branchDef?.primarySet || null;
  const branchSecondaryId = branchDef?.secondarySet || null;

  const handleSelectBranchPrimaryPower = (power: Power) => {
    addPower('primary', {
      ...power,
      powerSet: branchPrimaryId || '',
      level: build.level,
      slots: [null],
    });
  };

  const handleSelectBranchSecondaryPower = (power: Power) => {
    addPower('secondary', {
      ...power,
      powerSet: branchSecondaryId || '',
      level: build.level,
      slots: [null],
    });
  };

  // ── Shared section bodies (single-sourced across desktop grid + fallback) ──

  const availableTitle = (
    <>
      Available Powers
      {powerLimitReached && (
        <span className="ml-2 text-amber-400 normal-case tracking-normal font-normal">
          — All {MAX_POWER_PICKS} selected
        </span>
      )}
    </>
  );

  /** Combined Primary+Secondary (side-by-side) + Pools/Epic — compact form used
   *  by the desktop Available column and the mobile (xs) stacked layout. */
  const availableCombinedBody = (
    <>
      <CollapsibleSection title="Primary & Secondary" defaultOpen>
        {/* Container-query wrapper: the Primary|Secondary split stacks to one
            column when THIS column is narrow (independently resizable, so we key
            off the column's own width, not the viewport). Below ~280px each
            sub-list would truncate names, so stack instead — this is what lets
            the Available column's clean floor drop from ~260px to ~200px. */}
      <div className="@container">
        <div className="grid grid-cols-1 @min-[280px]:grid-cols-2 gap-px bg-slate-700">
          <div className="bg-slate-900">
            <AvailablePowers
              category="primary"
              powersetId={primaryPowersetId}
              selectedPowerNames={primarySelectedNames}
              onSelectPower={handleSelectPrimaryPower}
              compact
            />
            {branchPrimaryId && (
              <AvailablePowers
                category="primary"
                powersetId={branchPrimaryId}
                selectedPowerNames={primarySelectedNames}
                onSelectPower={handleSelectBranchPrimaryPower}
                compact
              />
            )}
          </div>
          <div className="bg-slate-900">
            <AvailablePowers
              category="secondary"
              powersetId={secondaryPowersetId}
              selectedPowerNames={secondarySelectedNames}
              onSelectPower={handleSelectSecondaryPower}
              compact
            />
            {branchSecondaryId && (
              <AvailablePowers
                category="secondary"
                powersetId={branchSecondaryId}
                selectedPowerNames={secondarySelectedNames}
                onSelectPower={handleSelectBranchSecondaryPower}
                compact
              />
            )}
          </div>
        </div>
      </div>
      </CollapsibleSection>

      <CollapsibleSection title="Power Pools & Epic" defaultOpen>
        <AvailablePoolPowers compact />
      </CollapsibleSection>
    </>
  );

  const infoHeaderRight = (
    <div className="flex items-center gap-1">
      <Toggle
        checked={tooltipEnabled}
        onChange={toggleInfoPanelTooltip}
        title="Enable power info tooltip on hover"
        label="Tooltips"
        className="scale-75 origin-right"
      />
      <UndockButton onClick={undockInfoPanel} />
    </div>
  );

  /** Resolve a section id to its render descriptor for the current view. */
  const getSection = (id: PlannerSectionId): SectionDescriptor => {
    switch (id) {
      case 'available':
        return {
          title: availableTitle,
          headerRight: <ViewModeToggle className="shrink-0 sm:ml-2" />,
          body: availableCombinedBody,
          bodyClassName: `flex-1 overflow-y-auto p-1.5 space-y-0 relative ${powerLimitReached ? 'opacity-60' : ''}`,
        };
      case 'primary':
        return {
          title: 'Primary Powers',
          body: <SelectedPowers category="primary" />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'secondary':
        return {
          title: 'Secondary Powers',
          body: <SelectedPowers category="secondary" />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'pool':
        return {
          title: 'Pool Powers',
          body: <PoolPowers />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'epic':
        return {
          title: 'Epic & Patron Powers',
          body: <EpicPowers />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'inherent-fitness':
        return {
          title: 'Fitness',
          body: <InherentPowers group="fitness" />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'inherent-basic':
        return {
          title: 'Basic',
          body: <InherentPowers group="basic" />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'inherent-prestige':
        return {
          title: 'Prestige Sprints',
          body: <InherentPowers group="prestige" />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'inherent-archetype':
        return {
          title: `${build.archetype.name || 'Archetype'} Inherent`,
          body: <InherentPowers group="archetype" />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'bylevel':
        return {
          title: 'Powers by Level',
          body: <ChronologicalPowerView />,
          bodyClassName: 'flex-1 overflow-y-auto',
        };
      case 'info':
        return {
          title: 'Power Info',
          headerRight: infoHeaderRight,
          // pb-24 keeps the scrolled bottom of long power info clear of the
          // fixed floating help/coffee cluster (lg+).
          body: <InfoPanel />,
          bodyClassName: 'flex-1 overflow-y-auto p-2 pb-24',
          onboarding: 'info-panel',
        };
    }
  };

  // The info column floats when undocked, so it leaves the grid regardless of
  // its stored visibility. Everything else follows its `visible` flag.
  const gridSections = sections.filter(
    (s) => s.visible && !(s.id === 'info' && undocked),
  );
  // Derive the 2D layout (LAY11): sections sharing a `column` stack vertically.
  // Each column's horizontal weight is the topmost section's `weight`.
  const columns = toColumns(gridSections).map((rows) => ({
    weight: rows[0]?.weight ?? 1,
    rows,
  }));
  // `minmax(MIN, …fr)` clamps every column to the clean-render floor: extra width
  // distributes by fr weight, but a column never shrinks below MIN_COL_PX — the
  // grid (overflow-auto) scrolls instead of deforming its contents.
  const gridTemplateColumns = columns
    .map((c) => `minmax(${MIN_COL_PX}px, ${c.weight}fr)`)
    .join(' ');

  // Compute the drop zone from the pointer's position within the hovered cell:
  // top/bottom bands stack above/below, the middle splits left/right into a new
  // column before/after the target.
  const handleDragOver = (e: React.DragEvent, id: PlannerSectionId) => {
    if (!dragId || dragId === id) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relY = (e.clientY - rect.top) / rect.height;
    const relX = (e.clientX - rect.left) / rect.width;
    const zone: DropZone =
      relY < 0.25 ? 'above' : relY > 0.75 ? 'below' : relX < 0.5 ? 'colBefore' : 'colAfter';
    setOverId(id);
    setOverZone(zone);
  };

  const handleDrop = (targetId: PlannerSectionId) => {
    if (dragId && dragId !== targetId && overZone) {
      reorderPlannerSections(view, applyDrop(sections, dragId, targetId, overZone));
    }
    setDragId(null);
    setOverId(null);
    setOverZone(null);
  };

  // Drag the divider between column `leftIdx` and its right neighbor: shift fr
  // weight from one to the other, keeping the pair's combined weight constant so
  // other columns are untouched. Both neighbors are clamped to MIN_COL_PX. The
  // weight is written to each column's topmost section (its canonical holder).
  const startColumnResize = (e: React.PointerEvent, leftIdx: number) => {
    const grid = gridRef.current;
    const left = columns[leftIdx];
    const right = columns[leftIdx + 1];
    if (!grid || !left || !right) return;
    const gapTotal = Math.max(0, columns.length - 1); // gap-px = 1px each
    const usable = grid.clientWidth - gapTotal;
    const sumWeight = columns.reduce((sum, c) => sum + c.weight, 0);
    const pxPerWeight = usable / sumWeight;
    const pairPx = (left.weight + right.weight) * pxPerWeight;
    // Not enough room to give both neighbors their floor — resizing this pair
    // can't produce a valid split, so ignore the drag.
    if (pairPx < MIN_COL_PX * 2 || pxPerWeight <= 0) return;
    const pxL0 = left.weight * pxPerWeight;
    const leftId = left.rows[0].id;
    const rightId = right.rows[0].id;
    const startX = e.clientX;
    const handleEl = e.currentTarget as HTMLElement;
    handleEl.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const newL = Math.max(
        MIN_COL_PX,
        Math.min(pairPx - MIN_COL_PX, pxL0 + (ev.clientX - startX)),
      );
      setPlannerSectionWeights(view, {
        [leftId]: newL / pxPerWeight,
        [rightId]: (pairPx - newL) / pxPerWeight,
      });
    };
    const onUp = () => {
      handleEl.releasePointerCapture?.(e.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Drag the divider between stacked cells `topIdx` and `topIdx + 1`: the vertical
  // twin of startColumnResize. Reads the *actual* current cell heights from the DOM
  // (px), so it starts seamlessly whether the column is content-driven (default) or
  // already weight-driven — and seeds every cell's `rowWeight` from its measured
  // height, converting the whole column to weight-driven in one consistent step
  // (px used as fr; only ratios matter). Both neighbors clamp to MIN_CELL_PX.
  const startRowResize = (e: React.PointerEvent, topIdx: number) => {
    const container = (e.currentTarget as HTMLElement).closest('[data-column]') as HTMLElement | null;
    if (!container) return;
    const cellEls = [...container.querySelectorAll<HTMLElement>(':scope > [data-cell]')];
    const topEl = cellEls[topIdx];
    const bottomEl = cellEls[topIdx + 1];
    if (!topEl || !bottomEl) return;
    const heights = cellEls.map((el) => el.getBoundingClientRect().height);
    const ids = cellEls.map((el) => el.getAttribute('data-cell') as PlannerSectionId);
    const pairPx = heights[topIdx] + heights[topIdx + 1];
    if (pairPx < MIN_CELL_PX * 2) return;
    const topH0 = heights[topIdx];
    const startY = e.clientY;
    const handleEl = e.currentTarget as HTMLElement;
    handleEl.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const newTop = Math.max(
        MIN_CELL_PX,
        Math.min(pairPx - MIN_CELL_PX, topH0 + (ev.clientY - startY)),
      );
      const weights: Partial<Record<PlannerSectionId, number>> = {};
      ids.forEach((id, i) => { weights[id] = heights[i]; });
      weights[ids[topIdx]] = newTop;
      weights[ids[topIdx + 1]] = pairPx - newTop;
      setPlannerSectionRowWeights(view, weights);
    };
    const onUp = () => {
      handleEl.releasePointerCapture?.(e.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <>
      {/* Desktop: fill `main` (which is `relative`) so the grid has a *definite*
          height to distribute — required for the LAY11 vertical stack split + row
          resize, and it lets each column scroll internally instead of growing the
          page. `main` is a block box, so its `flex-1` grid never actually bounded
          before; this wrapper supplies the bound. Plain block below lg, so the
          mobile fallback keeps its original page-grow flow. */}
      <div className="lg:absolute lg:inset-0 lg:flex lg:flex-col">
        <PlannerHintBar />

        {/* ── Desktop (lg+): rearrangeable 2D dock grid (LAY11) ── */}
        <div
          ref={gridRef}
          className="hidden lg:grid gap-px bg-slate-700 flex-1 min-h-0 overflow-auto"
          style={{ gridTemplateColumns, gridTemplateRows: 'minmax(0,1fr)' }}
        >
        {columns.map((col, colIdx) => {
          const isLastCol = colIdx === columns.length - 1;
          // A column is weight-driven once the user drags a divider in it (any
          // cell carries a `rowWeight`); until then each cell sizes to its own
          // content (`flex-basis: auto` + `flex-grow: 0`), shrinking
          // proportionally only when the column can't fit everything. Not growing
          // to fill is deliberate: a lone short cell (e.g. Inherent) stays as tall
          // as its contents and leaves the column canvas empty below it, so it
          // reads as a discrete *tile* rather than a bottomless column. A tall
          // cell (a full power list) still overflows → `flex-shrink` clamps it to
          // the column height and its body scrolls, so it fills — because it
          // needs the space.
          const weightDriven = col.rows.some((r) => r.rowWeight !== undefined);
          return (
            <div
              key={`col-${colIdx}`}
              data-column
              // bg-slate-900 (not -700) so the empty canvas below content-sized
              // tiles is seamless with the tiles themselves; the per-cell `ring`
              // frame (LAY12) carries the stacked-cell separation, and the column
              // seams are the grid-level gap, unaffected.
              className="relative flex flex-col gap-px bg-slate-900 min-h-0"
            >
              {col.rows.map((cfg, rowIdx) => {
                const section = getSection(cfg.id);
                const isLastRow = rowIdx === col.rows.length - 1;
                const isDropTarget = overId === cfg.id && dragId !== null && dragId !== cfg.id && overZone !== null;
                const isCollapsed = collapsedCells.has(cfg.id);
                return (
                  <div
                    key={cfg.id}
                    data-cell={cfg.id}
                    data-onboarding={section.onboarding}
                    onDragOver={(e) => handleDragOver(e, cfg.id)}
                    onDrop={() => handleDrop(cfg.id)}
                    style={
                      isCollapsed
                        ? { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minHeight: 0 }
                        : weightDriven
                          ? { flexGrow: cfg.rowWeight ?? 1, flexShrink: 1, flexBasis: 0, minHeight: MIN_CELL_PX }
                          : { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', minHeight: MIN_CELL_PX }
                    }
                    className={`relative bg-slate-900 flex flex-col overflow-hidden min-h-0 transition-opacity ring-1 ring-inset ring-slate-600/60 ${
                      dragId === cfg.id ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="bg-slate-800 border-b border-slate-700 px-2 min-h-[2.5rem] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <GripHandle
                          draggable
                          onDragStart={() => setDragId(cfg.id)}
                          onDragEnd={() => { setDragId(null); setOverId(null); setOverZone(null); }}
                        />
                        <button
                          onClick={() => toggleCollapsed(cfg.id)}
                          className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                          title={isCollapsed ? 'Expand section' : 'Collapse section'}
                          aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                        >
                          <span className={`inline-block text-[10px] transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>▶</span>
                        </button>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                          {section.title}
                        </h2>
                      </div>
                      {!isCollapsed && section.headerRight}
                    </div>
                    {!isCollapsed && <div className={section.bodyClassName}>{section.body}</div>}

                    {/* Drop-zone edge marker (above/below stack · left/right new column). */}
                    {isDropTarget && (
                      <div
                        className="absolute z-30 pointer-events-none bg-[var(--color-primary)]"
                        style={dropEdgeStyle(overZone)}
                      />
                    )}

                    {/* Vertical resize divider to the stacked row below. Hidden
                        during a reorder drag so the gestures never fight. */}
                    {!isLastRow && !dragId && !isCollapsed && (
                      <ResizeDivider
                        axis="y"
                        onPointerDown={(e) => { e.preventDefault(); startRowResize(e, rowIdx); }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Drop catcher for the empty canvas below content-sized tiles.
                  Goal 1 (flex-grow:0) leaves real slack under a short column's
                  last tile; that slack is the column div, which has no drop
                  handler — so a "below" drop released there would paint the blue
                  line but silently fail. This spacer fills the slack (grows only
                  in content-driven mode; 0 height when the column is weight-driven
                  or full) and routes a drop there to "below the last cell". */}
              {col.rows.length > 0 && (
                <div
                  style={{ flexGrow: weightDriven ? 0 : 1, flexBasis: 0, minHeight: 0 }}
                  onDragOver={(e) => {
                    const lastId = col.rows[col.rows.length - 1].id;
                    if (!dragId || dragId === lastId) return;
                    e.preventDefault();
                    setOverId(lastId);
                    setOverZone('below');
                  }}
                  onDrop={() => handleDrop(col.rows[col.rows.length - 1].id)}
                />
              )}

              {/* Horizontal resize divider straddling the gap to the right
                  neighbor column. Hidden during a reorder drag. */}
              {!isLastCol && !dragId && (
                <ResizeDivider
                  axis="x"
                  onPointerDown={(e) => { e.preventDefault(); startColumnResize(e, colIdx); }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Mobile + md fallback: fixed responsive layout (not rearrangeable) ── */}
      {view === 'chronological' ? (
        <div className="grid lg:hidden gap-px bg-slate-700 flex-1 overflow-auto pb-16 grid-cols-1 md:grid-cols-2">
          {/* Available Powers */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex flex-col items-start gap-1.5 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                {availableTitle}
              </h2>
              <ViewModeToggle className="w-full sm:w-auto shrink-0 sm:ml-2" />
            </div>
            <div className={`flex-1 overflow-y-auto p-1.5 space-y-0 relative ${powerLimitReached ? 'opacity-60' : ''}`}>
              {availableCombinedBody}
            </div>
          </div>

          {/* Powers by Level */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Powers by Level
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChronologicalPowerView />
            </div>
          </div>

          {/* Info Panel (hidden on mobile, hidden when undocked) */}
          {!undocked && (
            <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[250px] hidden md:flex" data-onboarding="info-panel">
              <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Power Info</h2>
                {infoHeaderRight}
              </div>
              <div className="flex-1 overflow-y-auto p-2 pb-24">
                <InfoPanel />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid lg:hidden gap-px bg-slate-700 flex-1 overflow-auto pb-16 grid-cols-1 md:grid-cols-2">
          {/* Available Powers — combined (xs only; md uses the split below) */}
          <div className="bg-slate-900 flex md:hidden flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex flex-col items-start gap-1.5 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                {availableTitle}
              </h2>
              <ViewModeToggle className="w-full sm:w-auto shrink-0 sm:ml-2" />
            </div>
            <div className={`flex-1 overflow-y-auto p-1.5 space-y-0 relative ${powerLimitReached ? 'opacity-60' : ''}`}>
              {availableCombinedBody}
            </div>
          </div>

          {/* md-only: Available Primary (col 1 of row 1) */}
          <div className="bg-slate-900 hidden md:flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Available Primary
              </h2>
              <ViewModeToggle className="w-full sm:w-auto shrink-0 sm:ml-2" />
            </div>
            <div className={`flex-1 overflow-y-auto p-2 space-y-3 relative ${powerLimitReached ? 'opacity-60' : ''}`}>
              {powerLimitReached && (
                <div className="sticky top-0 z-10 text-center text-xs text-amber-400 bg-slate-900/90 py-1.5 rounded border border-amber-500/30 mb-2 pointer-events-auto">
                  All {MAX_POWER_PICKS} powers selected
                </div>
              )}
              <AvailablePowers
                category="primary"
                powersetId={primaryPowersetId}
                selectedPowerNames={primarySelectedNames}
                onSelectPower={handleSelectPrimaryPower}
              />
              {branchPrimaryId && (
                <AvailablePowers
                  category="primary"
                  powersetId={branchPrimaryId}
                  selectedPowerNames={primarySelectedNames}
                  onSelectPower={handleSelectBranchPrimaryPower}
                />
              )}
              <AvailablePoolPowers />
            </div>
          </div>

          {/* md-only: Available Secondary (col 2 of row 1) */}
          <div className="bg-slate-900 hidden md:flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Available Secondary
              </h2>
            </div>
            <div className={`flex-1 overflow-y-auto p-2 space-y-3 relative ${powerLimitReached ? 'opacity-60' : ''}`}>
              {powerLimitReached && (
                <div className="sticky top-0 z-10 text-center text-xs text-amber-400 bg-slate-900/90 py-1.5 rounded border border-amber-500/30 mb-2 pointer-events-auto">
                  All {MAX_POWER_PICKS} powers selected
                </div>
              )}
              <AvailablePowers
                category="secondary"
                powersetId={secondaryPowersetId}
                selectedPowerNames={secondarySelectedNames}
                onSelectPower={handleSelectSecondaryPower}
              />
              {branchSecondaryId && (
                <AvailablePowers
                  category="secondary"
                  powersetId={branchSecondaryId}
                  selectedPowerNames={secondarySelectedNames}
                  onSelectPower={handleSelectBranchSecondaryPower}
                />
              )}
            </div>
          </div>

          {/* Selected Primary Powers */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Primary Powers
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <SelectedPowers category="primary" />
            </div>
          </div>

          {/* Selected Secondary Powers */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Secondary Powers
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <SelectedPowers category="secondary" />
            </div>
          </div>

          {/* Pool & Epic Powers */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Pool &amp; Epic Powers
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              <PoolPowers />
              <EpicPowers />
            </div>
          </div>

          {/* Inherent Powers */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px]">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                Inherent Powers
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <InherentPowers />
            </div>
          </div>

          {/* Info Panel (hidden on mobile, hidden when undocked) */}
          {!undocked && (
            <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[250px] hidden md:flex" data-onboarding="info-panel">
              <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Power Info</h2>
                {infoHeaderRight}
              </div>
              <div className="flex-1 overflow-y-auto p-2 pb-24">
                <InfoPanel />
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* Floating overlay when undocked */}
      {undocked && <PopOutInfoPanel />}
      {setBonusPopupOpen && <SetBonusPopup />}
    </>
  );
}
