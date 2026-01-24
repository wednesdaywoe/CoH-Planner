/**
 * AvailablePowers component - shows powers available to select
 * Renders as a section within the Available Powers column (not a full column itself)
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getPowerset, getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import type { Power } from '@/types';

interface AvailablePowersProps {
  powersetId: string | null;
  category: 'primary' | 'secondary';
  selectedPowerNames: string[];
  onSelectPower: (power: Power) => void;
}

export function AvailablePowers({
  powersetId,
  category,
  selectedPowerNames,
  onSelectPower,
}: AvailablePowersProps) {
  const build = useBuildStore((s) => s.build);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);

  const archetypeId = build.archetype.id;
  const categoryLabel = category === 'primary' ? 'Primary' : 'Secondary';

  // Both powersets must be selected before powers can be chosen
  const bothPowersetsSelected = build.primary.id && build.secondary.id;

  const powerset = powersetId ? getPowerset(powersetId) : null;
  // Show ALL user-selectable powers, not just ones available at current level
  // Powers not yet available will be shown as disabled
  // Powers with available === -1 are auto-granted and should not be shown in selection
  const allPowers = powerset ? powerset.powers.filter(p => p.available >= 0) : [];
  const selectedSet = new Set(selectedPowerNames);

  // At level 1, special rules apply:
  // - Only the first 2 powers (available=0) can be selected
  // - Player must select exactly 1 power from primary and 1 from secondary
  // - If first pick was from one category, second pick MUST be from the other
  const isLevel1 = build.level === 1;
  const currentCategoryPowerCount = selectedPowerNames.length;
  const hasPickedPowerThisCategory = currentCategoryPowerCount > 0;

  // Check if the OTHER category has a power selected (for level 1 blocking)
  const otherCategoryHasPower = category === 'primary'
    ? build.secondary.powers.length > 0
    : build.primary.powers.length > 0;

  // At level 1, if we already picked from THIS category but not the other,
  // block further picks from this category until the other is selected
  const isLevel1BlockedForSecondPick = isLevel1 && hasPickedPowerThisCategory && !otherCategoryHasPower;

  const handlePowerHover = (power: Power) => {
    // Always update hover content - tooltip uses this even when panel is locked
    if (powersetId) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: powersetId,
      });
    }
  };

  const handlePowerLeave = () => {
    // Clear info panel content when leaving a power
    clearInfoPanel();
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: Power) => {
    e.preventDefault();
    if (!powersetId) return;

    // If already locked to this power, unlock; otherwise lock to this power
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.name) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: powersetId,
      });
    }
  };

  // Helper to check if a power is the currently locked one
  const isPowerLocked = (powerName: string) => {
    return infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === powerName;
  };

  // No archetype selected
  if (!archetypeId) {
    return (
      <div className="mb-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {categoryLabel}
        </div>
        <div className="text-xs text-slate-500 italic py-2">
          Select an archetype first
        </div>
      </div>
    );
  }

  // Archetype selected but no powerset
  if (!powersetId) {
    return (
      <div className="mb-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {categoryLabel}
        </div>
        <div className="text-xs text-slate-500 italic py-2">
          Select a {category} powerset
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      {/* Section header with powerset name */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
          {powerset?.name || categoryLabel}
        </div>
      </div>

      {/* Show message if both powersets not selected */}
      {!bothPowersetsSelected && (
        <div className="text-xs text-amber-500/70 italic py-1 mb-1">
          Select both Primary and Secondary to choose powers
        </div>
      )}

      {/* Level 1 instruction */}
      {bothPowersetsSelected && isLevel1 && !hasPickedPowerThisCategory && !otherCategoryHasPower && (
        <div className="text-xs text-emerald-500/70 italic py-1 mb-1">
          Pick 1 power from the first two
        </div>
      )}
      {bothPowersetsSelected && isLevel1 && !hasPickedPowerThisCategory && otherCategoryHasPower && (
        <div className="text-xs text-amber-400/80 italic py-1 mb-1">
          Now pick your {categoryLabel.toLowerCase()} power
        </div>
      )}
      {bothPowersetsSelected && isLevel1 && hasPickedPowerThisCategory && (
        <div className="text-xs text-slate-500 italic py-1 mb-1">
          ✓ {categoryLabel} power selected
        </div>
      )}

      {/* Power list */}
      {allPowers.length === 0 ? (
        <div className="text-xs text-slate-500 italic py-1">
          No powers in this powerset
        </div>
      ) : (
        <div className="space-y-0.5">
          {allPowers.map((power, index) => {
            const isSelected = selectedSet.has(power.name);
            // available is 0-indexed: available=0 means level 1, available=1 means level 2
            const isAvailable = power.available < build.level;

            // Level 1 special restrictions:
            // - Only first 2 powers can be selected (index 0 or 1)
            // - Can only pick 1 power total from this category
            // - If first pick was from this category, block until other category picks
            const isLevel1Restricted = isLevel1 && (index > 1 || hasPickedPowerThisCategory || isLevel1BlockedForSecondPick);

            // Block selection until both powersets are chosen
            const isDisabled = isSelected || !isAvailable || !bothPowersetsSelected || isLevel1Restricted;
            const isLocked = isPowerLocked(power.name);

            return (
              <div
                key={power.name}
                onMouseEnter={() => handlePowerHover(power)}
                onMouseLeave={handlePowerLeave}
                onContextMenu={(e) => handlePowerRightClick(e, power)}
                title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                className={`
                  w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm
                  transition-colors text-left text-xs
                  ${
                    isLocked
                      ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
                      : isSelected
                        ? 'bg-blue-900/30 border border-blue-600/50 opacity-60'
                        : !isAvailable
                          ? 'bg-slate-800/50 border border-slate-700/50 opacity-40 cursor-not-allowed'
                          : 'bg-slate-800 border border-slate-700 hover:border-blue-500 cursor-pointer'
                  }
                `}
                onClick={() => !isDisabled && onSelectPower(power)}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectPower(power);
                  }
                }}
              >
                <img
                  src={powerset ? getPowerIconPath(powerset.name, power.icon) : resolvePath('/img/Unknown.png')}
                  alt=""
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                  }}
                />
                <span className="truncate flex-1 text-slate-200">
                  {power.name}
                </span>
                <span
                  className={`text-[10px] flex-shrink-0 ${
                    isAvailable ? 'text-slate-500' : 'text-amber-500/70'
                  }`}
                  title={isAvailable ? `Available at level ${power.available + 1}` : `Requires level ${power.available + 1}`}
                >
                  L{power.available + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
