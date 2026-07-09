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
import { PoolPowers, InherentPowers } from '@/components/powers/PoolPowers';
import { PlannerHintBar } from '@/components/powers/PlannerHintBar';
import { ChronologicalPowerView } from '@/components/powers/ChronologicalPowerView';
import { InfoPanel } from '@/components/info/InfoPanel';
import { PopOutInfoPanel } from '@/components/info/PopOutInfoPanel';
import { SetBonusPopup } from '@/components/info/SetBonusPopup';
import { Toggle, CollapsibleSection } from '@/components/ui';
import { ViewModeToggle } from '@/components/ui/ViewModeToggle';
import { MAX_POWER_PICKS, getArchetype } from '@/data';
import type { Power, PlannerSectionId, PlannerSectionConfig } from '@/types';

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
 *  streams/REARRANGEABLE_LAYOUT_PLAN.md) found the widest clean-render floor is
 *  Available's ~260px; below it sections deform (truncated names, wrapped ghost
 *  slot, h-scrolling info tables). The grid uses `minmax(MIN, …fr)` so columns
 *  hold this floor and the grid overflow-scrolls rather than deforming, and the
 *  resize drag clamps neighbors so neither is pushed under it. */
const MIN_COL_PX = 260;

/** Drag-handle grip shown in each desktop column header. */
function GripHandle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0"
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

/** Move `fromId` so it lands at `toId`'s position within the full section list. */
function moveSection(
  list: PlannerSectionConfig[],
  fromId: PlannerSectionId,
  toId: PlannerSectionId,
): PlannerSectionConfig[] {
  if (fromId === toId) return list;
  const fromIdx = list.findIndex((s) => s.id === fromId);
  const toIdx = list.findIndex((s) => s.id === toId);
  if (fromIdx === -1 || toIdx === -1) return list;
  const next = [...list];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
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

  // Desktop drag-reorder state (native HTML5 DnD; a 5-item reorder doesn't
  // warrant a DnD library dependency).
  const [dragId, setDragId] = useState<PlannerSectionId | null>(null);
  const [overId, setOverId] = useState<PlannerSectionId | null>(null);
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
        <div className="grid grid-cols-2 gap-px bg-slate-700">
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
          title: 'Pool & Epic Powers',
          body: <PoolPowers />,
          bodyClassName: 'flex-1 overflow-y-auto p-2',
        };
      case 'inherent':
        return {
          title: 'Inherent Powers',
          body: <InherentPowers />,
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
  // `minmax(MIN, …fr)` clamps every column to the clean-render floor: extra width
  // distributes by fr weight, but a column never shrinks below MIN_COL_PX — the
  // grid (overflow-auto) scrolls instead of deforming its contents.
  const gridTemplateColumns = gridSections
    .map((s) => `minmax(${MIN_COL_PX}px, ${s.weight ?? 1}fr)`)
    .join(' ');

  const handleDrop = (targetId: PlannerSectionId) => {
    if (dragId && dragId !== targetId) {
      reorderPlannerSections(view, moveSection(sections, dragId, targetId));
    }
    setDragId(null);
    setOverId(null);
  };

  // Drag the divider between column `leftIdx` and its right neighbor: shift fr
  // weight from one to the other, keeping the pair's combined weight constant so
  // other columns are untouched. Both neighbors are clamped to MIN_COL_PX.
  const startColumnResize = (e: React.PointerEvent, leftIdx: number) => {
    const grid = gridRef.current;
    const left = gridSections[leftIdx];
    const right = gridSections[leftIdx + 1];
    if (!grid || !left || !right) return;
    const gapTotal = Math.max(0, gridSections.length - 1); // gap-px = 1px each
    const usable = grid.clientWidth - gapTotal;
    const sumWeight = gridSections.reduce((sum, c) => sum + (c.weight ?? 1), 0);
    const pxPerWeight = usable / sumWeight;
    const pairPx = ((left.weight ?? 1) + (right.weight ?? 1)) * pxPerWeight;
    // Not enough room to give both neighbors their floor — resizing this pair
    // can't produce a valid split, so ignore the drag.
    if (pairPx < MIN_COL_PX * 2 || pxPerWeight <= 0) return;
    const pxL0 = (left.weight ?? 1) * pxPerWeight;
    const startX = e.clientX;
    const handleEl = e.currentTarget as HTMLElement;
    handleEl.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const newL = Math.max(
        MIN_COL_PX,
        Math.min(pairPx - MIN_COL_PX, pxL0 + (ev.clientX - startX)),
      );
      setPlannerSectionWeights(view, {
        [left.id]: newL / pxPerWeight,
        [right.id]: (pairPx - newL) / pxPerWeight,
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

  return (
    <>
      <PlannerHintBar />

      {/* ── Desktop (lg+): rearrangeable column grid ── */}
      <div
        ref={gridRef}
        className="hidden lg:grid gap-px bg-slate-700 flex-1 overflow-auto"
        style={{ gridTemplateColumns, gridTemplateRows: 'minmax(0,1fr)' }}
      >
        {gridSections.map((cfg, idx) => {
          const section = getSection(cfg.id);
          const isLast = idx === gridSections.length - 1;
          return (
            <div
              key={cfg.id}
              data-onboarding={section.onboarding}
              onDragOver={(e) => { if (dragId) { e.preventDefault(); setOverId(cfg.id); } }}
              onDrop={() => handleDrop(cfg.id)}
              className={`relative bg-slate-900 flex flex-col overflow-hidden min-h-0 transition-opacity ${
                dragId === cfg.id ? 'opacity-40' : ''
              } ${overId === cfg.id && dragId !== cfg.id ? 'ring-2 ring-inset ring-[var(--color-primary)]' : ''}`}
            >
              <div className="bg-slate-800 border-b border-slate-700 px-2 min-h-[2.5rem] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <GripHandle
                    draggable
                    onDragStart={() => setDragId(cfg.id)}
                    onDragEnd={() => { setDragId(null); setOverId(null); }}
                  />
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate min-w-0">
                    {section.title}
                  </h2>
                </div>
                {section.headerRight}
              </div>
              <div className={section.bodyClassName}>{section.body}</div>

              {/* Resize divider straddling the gap to the right neighbor.
                  Hidden while a reorder drag is in flight so the two gestures
                  never fight. */}
              {!isLast && !dragId && (
                <div
                  onPointerDown={(e) => { e.preventDefault(); startColumnResize(e, idx); }}
                  className="absolute top-0 bottom-0 right-0 w-2 translate-x-1/2 z-20 cursor-col-resize group/resize"
                  title="Drag to resize columns"
                  aria-label="Resize column"
                >
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-transparent group-hover/resize:bg-[var(--color-primary)] transition-colors" />
                </div>
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
            <div className="flex-1 overflow-y-auto p-2">
              <PoolPowers />
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

      {/* Floating overlay when undocked */}
      {undocked && <PopOutInfoPanel />}
      {setBonusPopupOpen && <SetBonusPopup />}
    </>
  );
}
