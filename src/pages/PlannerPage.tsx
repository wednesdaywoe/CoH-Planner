/**
 * PlannerPage - Main build planner interface
 *
 * Two view modes:
 * 1. Category View (default):
 *    Column 1: Available Powers (Primary + Secondary + Pool/Epic selection)
 *    Column 2: Selected Primary Powers
 *    Column 3: Selected Secondary Powers
 *    Column 4: Pool/Epic/Inherent Powers (selected, with slots)
 *    Column 5: Info Panel
 *
 * 2. Chronological View (Mids-style) - Powers displayed by level taken:
 *    Column 1: Available Powers (Primary + Secondary + Pool/Epic selection)
 *    Columns 2-4: Chronological Power Grid (3 columns x 8+ rows)
 *    Column 5: Info Panel
 */

import { useBuildStore, useUIStore, usePowerViewMode } from '@/stores';
import { AvailablePowers } from '@/components/powers/AvailablePowers';
import { AvailablePoolPowers } from '@/components/powers/AvailablePoolPowers';
import { SelectedPowers } from '@/components/powers/SelectedPowers';
import { PoolPowers } from '@/components/powers/PoolPowers';
import { ChronologicalPowerView } from '@/components/powers/ChronologicalPowerView';
import { InfoPanel } from '@/components/info/InfoPanel';
import { Toggle } from '@/components/ui';
import { ViewModeToggle } from '@/components/ui/ViewModeToggle';
import { MAX_POWER_PICKS } from '@/data';
import type { Power } from '@/types';

export function PlannerPage() {
  const build = useBuildStore((s) => s.build);
  const addPower = useBuildStore((s) => s.addPower);
  const tooltipEnabled = useUIStore((s) => s.infoPanel.tooltipEnabled);
  const toggleInfoPanelTooltip = useUIStore((s) => s.toggleInfoPanelTooltip);
  const powerViewMode = usePowerViewMode();

  // Check if 24-power limit reached
  const totalPowers =
    build.primary.powers.length +
    build.secondary.powers.length +
    build.pools.reduce((sum, pool) => sum + pool.powers.length, 0) +
    (build.epicPool?.powers.length ?? 0);
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

  // Chronological view layout
  if (powerViewMode === 'chronological') {
    return (
      <div
        className="
          grid gap-px bg-slate-700 flex-1 overflow-auto
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[0.8fr_2fr_1fr]
        "
      >
        {/* Column 1: Available Powers (Primary + Secondary + Pool/Epic) */}
        <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Available Powers
            </h2>
            <ViewModeToggle />
          </div>
          <div className={`flex-1 overflow-y-auto p-2 space-y-3 relative ${powerLimitReached ? 'opacity-40 pointer-events-none' : ''}`}>
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

            <AvailablePowers
              category="secondary"
              powersetId={secondaryPowersetId}
              selectedPowerNames={secondarySelectedNames}
              onSelectPower={handleSelectSecondaryPower}
            />

            <AvailablePoolPowers />
          </div>
        </div>

        {/* Column 2: Chronological Power View (3-column grid) */}
        <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="bg-slate-800 border-b border-slate-700 px-3 py-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Powers by Level
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChronologicalPowerView />
          </div>
        </div>

        {/* Column 3: Info Panel */}
        <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[250px] lg:min-h-0 hidden md:flex">
          <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Power Info
            </h2>
            <Toggle
              checked={tooltipEnabled}
              onChange={toggleInfoPanelTooltip}
              title="Enable power info tooltip on hover"
              className="scale-75 origin-right"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <InfoPanel />
          </div>
        </div>
      </div>
    );
  }

  // Category view layout (default)
  return (
    <div
      className="
        grid gap-px bg-slate-700 flex-1 overflow-auto
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-[0.8fr_1fr_1fr_1fr_1fr]
      "
    >
      {/* Column 1: Available Powers (Primary + Secondary + Pool/Epic selection) */}
      <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
        <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Available Powers
          </h2>
          <ViewModeToggle />
        </div>
        <div className={`flex-1 overflow-y-auto p-2 space-y-3 relative ${powerLimitReached ? 'opacity-40 pointer-events-none' : ''}`}>
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

          <AvailablePowers
            category="secondary"
            powersetId={secondaryPowersetId}
            selectedPowerNames={secondarySelectedNames}
            onSelectPower={handleSelectSecondaryPower}
          />

          <AvailablePoolPowers />
        </div>
      </div>

      {/* Column 2: Selected Primary Powers */}
      <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
        <div className="bg-slate-800 border-b border-slate-700 px-3 py-2">
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
        <div className="bg-slate-800 border-b border-slate-700 px-3 py-2">
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
        <div className="bg-slate-800 border-b border-slate-700 px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pool Powers
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <PoolPowers />
        </div>
      </div>

      {/* Column 5: Info Panel - hidden on mobile, shown on tablet+ */}
      <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[250px] lg:min-h-0 hidden md:flex">
        <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Power Info
          </h2>
          <Toggle
            checked={tooltipEnabled}
            onChange={toggleInfoPanelTooltip}
            title="Enable power info tooltip on hover"
            className="scale-75 origin-right"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <InfoPanel />
        </div>
      </div>
    </div>
  );
}
