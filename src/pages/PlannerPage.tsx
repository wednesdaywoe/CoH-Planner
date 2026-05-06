/**
 * PlannerPage - Main build planner interface
 *
 * Two view modes:
 * 1. Category View (default):
 *    Column 1: Available Powers (Primary + Secondary + Pool/Epic selection)
 *    Column 2: Selected Primary Powers
 *    Column 3: Selected Secondary Powers
 *    Column 4: Pool/Epic/Inherent Powers (selected, with slots)
 *    Column 5: Info Panel (unless undocked)
 *
 * 2. Chronological View (Mids-style) - Powers displayed by level taken:
 *    Column 1: Available Powers (Primary + Secondary + Pool/Epic selection)
 *    Columns 2-4: Chronological Power Grid (3 columns x 8+ rows)
 *    Column 5: Info Panel (unless undocked)
 */

import { useBuildStore, useUIStore, usePowerViewMode } from '@/stores';
import { useUrlBuildSync } from '@/utils/url-build-sync';
import { AvailablePowers } from '@/components/powers/AvailablePowers';
import { AvailablePoolPowers } from '@/components/powers/AvailablePoolPowers';
import { SelectedPowers } from '@/components/powers/SelectedPowers';
import { PoolPowers } from '@/components/powers/PoolPowers';
import { PlannerHintBar } from '@/components/powers/PlannerHintBar';
import { ChronologicalPowerView } from '@/components/powers/ChronologicalPowerView';
import { InfoPanel } from '@/components/info/InfoPanel';
import { PopOutInfoPanel } from '@/components/info/PopOutInfoPanel';
import { Toggle, CollapsibleSection } from '@/components/ui';
import { ViewModeToggle } from '@/components/ui/ViewModeToggle';
import { MAX_POWER_PICKS, getArchetype } from '@/data';
import type { Power } from '@/types';

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

export function PlannerPage() {
  useUrlBuildSync();
  const build = useBuildStore((s) => s.build);
  const addPower = useBuildStore((s) => s.addPower);
  const tooltipEnabled = useUIStore((s) => s.infoPanel.tooltipEnabled);
  const toggleInfoPanelTooltip = useUIStore((s) => s.toggleInfoPanelTooltip);
  const undocked = useUIStore((s) => s.infoPanel.undocked);
  const undockInfoPanel = useUIStore((s) => s.undockInfoPanel);
  const powerViewMode = usePowerViewMode();

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

  /** Info Panel column header with tooltip toggle and undock button */
  const infoPanelHeader = (
    <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Power Info
      </h2>
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
    </div>
  );

  // Chronological view layout
  if (powerViewMode === 'chronological') {
    return (
      <>
        <PlannerHintBar />
        <div
          className={`
            grid gap-px bg-slate-700 flex-1 overflow-auto pb-16 lg:pb-0
            grid-cols-1
            md:grid-cols-2
            ${undocked ? 'lg:grid-cols-[1fr_2fr]' : 'lg:grid-cols-[1fr_2fr_1fr]'}
            lg:grid-rows-[minmax(0,1fr)]
          `}
        >
          {/* Column 1: Available Powers (Primary + Secondary + Pool/Epic) */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Available Powers
                {powerLimitReached && (
                  <span className="ml-2 text-amber-400 normal-case tracking-normal font-normal">
                    — All {MAX_POWER_PICKS} selected
                  </span>
                )}
              </h2>
              <ViewModeToggle />
            </div>
            <div className={`flex-1 overflow-y-auto p-1.5 space-y-0 relative ${powerLimitReached ? 'opacity-60' : ''}`}>
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
            </div>
          </div>

          {/* Column 2: Chronological Power View (3-column grid) */}
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
            <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Powers by Level
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChronologicalPowerView />
            </div>
          </div>

          {/* Column 3: Info Panel (hidden when undocked) */}
          {!undocked && (
            <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[250px] lg:min-h-0 hidden md:flex" data-onboarding="info-panel">
              {infoPanelHeader}
              {/* pb-24 keeps the scrolled bottom of long power info clear of the
                  fixed floating help/coffee cluster (lg+) and MobileBottomNav (md). */}
              <div className="flex-1 overflow-y-auto p-2 pb-24">
                <InfoPanel />
              </div>
            </div>
          )}
        </div>

        {/* Floating overlay when undocked */}
        {undocked && <PopOutInfoPanel />}
      </>
    );
  }

  // Category view layout (default)
  return (
    <>
      <PlannerHintBar />
      <div
        className={`
          grid gap-px bg-slate-700 flex-1 overflow-auto pb-16 lg:pb-0
          grid-cols-1
          md:grid-cols-2
          ${undocked ? 'lg:grid-cols-[1fr_1fr_1fr_1fr]' : 'lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]'}
          lg:grid-rows-[minmax(0,1fr)]
        `}
      >
        {/* Column 1: Available Powers — combined (xs and lg+, hidden at md) */}
        <div className="bg-slate-900 flex md:hidden lg:flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Available Powers
              {powerLimitReached && (
                <span className="ml-2 text-amber-400 normal-case tracking-normal font-normal">
                  — All {MAX_POWER_PICKS} selected
                </span>
              )}
            </h2>
            <ViewModeToggle />
          </div>
          <div className={`flex-1 overflow-y-auto p-1.5 space-y-0 relative ${powerLimitReached ? 'opacity-60' : ''}`}>
            {/* Primary & Secondary side-by-side */}
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

            {/* Pool & Epic grid */}
            <CollapsibleSection title="Power Pools & Epic" defaultOpen>
              <AvailablePoolPowers compact />
            </CollapsibleSection>
          </div>
        </div>

        {/* md-only: Available Primary (col 1 of row 1) */}
        <div className="bg-slate-900 hidden md:flex lg:hidden flex-col overflow-hidden min-h-[300px]">
          <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Available Primary
            </h2>
            <ViewModeToggle />
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
        <div className="bg-slate-900 hidden md:flex lg:hidden flex-col overflow-hidden min-h-[300px]">
          <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
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

        {/* Column 2: Selected Primary Powers */}
        <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Primary Powers
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <SelectedPowers category="primary" />
          </div>
        </div>

        {/* Column 3: Selected Secondary Powers */}
        <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Secondary Powers
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <SelectedPowers category="secondary" />
          </div>
        </div>

        {/* Column 4: Pool/Epic/Inherent Powers (selected, with slots) */}
        <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="bg-slate-800 border-b border-slate-700 px-3 min-h-[2.5rem] flex items-center">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pool Powers
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <PoolPowers />
          </div>
        </div>

        {/* Column 5: Info Panel - hidden on mobile, hidden when undocked */}
        {!undocked && (
          <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[250px] lg:min-h-0 hidden md:flex" data-onboarding="info-panel">
            {infoPanelHeader}
            {/* pb-24 keeps the scrolled bottom of long power info clear of the
                fixed floating help/coffee cluster (lg+) and MobileBottomNav (md). */}
            <div className="flex-1 overflow-y-auto p-2 pb-24">
              <InfoPanel />
            </div>
          </div>
        )}
      </div>

      {/* Floating overlay when undocked */}
      {undocked && <PopOutInfoPanel />}
    </>
  );
}
