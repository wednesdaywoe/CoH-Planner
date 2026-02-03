/**
 * PlannerPage - Main build planner interface
 *
 * Layout matches the legacy app:
 * Column 1: Available Powers (Primary + Secondary stacked)
 * Column 2: Selected Primary Powers
 * Column 3: Selected Secondary Powers
 * Column 4: Pool Powers
 * Column 5: Info Panel
 */

import { useBuildStore, useUIStore } from '@/stores';
import { AvailablePowers } from '@/components/powers/AvailablePowers';
import { SelectedPowers } from '@/components/powers/SelectedPowers';
import { PoolPowers } from '@/components/powers/PoolPowers';
import { InfoPanel } from '@/components/info/InfoPanel';
import { Toggle } from '@/components/ui';
import type { Power } from '@/types';

export function PlannerPage() {
  const build = useBuildStore((s) => s.build);
  const addPower = useBuildStore((s) => s.addPower);
  const tooltipEnabled = useUIStore((s) => s.infoPanel.tooltipEnabled);
  const toggleInfoPanelTooltip = useUIStore((s) => s.toggleInfoPanelTooltip);

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

  return (
    <div
      className="
        grid gap-px bg-slate-700 flex-1 overflow-auto
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-[0.8fr_1fr_1fr_1fr_1fr]
      "
    >
      {/* Column 1: Available Powers (Primary + Secondary stacked) */}
      <div className="bg-slate-900 flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
        <div className="bg-slate-800 border-b border-slate-700 px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Available Powers
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {/* Primary Available Powers */}
          <AvailablePowers
            category="primary"
            powersetId={primaryPowersetId}
            selectedPowerNames={primarySelectedNames}
            onSelectPower={handleSelectPrimaryPower}
          />

          {/* Secondary Available Powers */}
          <AvailablePowers
            category="secondary"
            powersetId={secondaryPowersetId}
            selectedPowerNames={secondarySelectedNames}
            onSelectPower={handleSelectSecondaryPower}
          />
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

      {/* Column 4: Pool Powers */}
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
