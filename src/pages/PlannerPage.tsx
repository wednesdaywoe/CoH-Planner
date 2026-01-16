/**
 * PlannerPage - Main build planner interface
 *
 * This is the primary page where users create and edit their builds.
 * It displays power columns for available/selected powers and the info panel.
 */

import { useBuildStore } from '@/stores';
import { AvailablePowers } from '@/components/powers/AvailablePowers';
import { SelectedPowers } from '@/components/powers/SelectedPowers';
import { PoolPowers } from '@/components/powers/PoolPowers';
import { InfoPanel } from '@/components/info/InfoPanel';
import type { Power } from '@/types';

export function PlannerPage() {
  const build = useBuildStore((s) => s.build);
  const addPower = useBuildStore((s) => s.addPower);

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
    <div className="flex h-full gap-2 p-2">
      {/* Column 1: Available Primary Powers */}
      <div className="w-1/5 min-w-[200px]">
        <AvailablePowers
          category="primary"
          powersetId={primaryPowersetId}
          selectedPowerNames={primarySelectedNames}
          onSelectPower={handleSelectPrimaryPower}
        />
      </div>

      {/* Column 2: Selected Primary Powers */}
      <div className="w-1/5 min-w-[200px]">
        <SelectedPowers category="primary" />
      </div>

      {/* Column 3: Selected Secondary Powers */}
      <div className="w-1/5 min-w-[200px]">
        <AvailablePowers
          category="secondary"
          powersetId={secondaryPowersetId}
          selectedPowerNames={secondarySelectedNames}
          onSelectPower={handleSelectSecondaryPower}
        />
      </div>

      {/* Column 4: Pool Powers */}
      <div className="w-1/5 min-w-[200px]">
        <PoolPowers />
      </div>

      {/* Column 5: Info Panel */}
      <div className="w-1/5 min-w-[250px]">
        <InfoPanel />
      </div>
    </div>
  );
}
