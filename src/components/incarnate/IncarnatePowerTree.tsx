/**
 * IncarnatePowerTree component - displays the power tree for a specific incarnate tree
 * Shows powers organized by tier in a 5-column tree structure:
 *
 * Row 4 (Very Rare):  [Core]  [ ]  [ ]  [ ]  [Radial]   (columns 1, 5)
 * Row 3 (Rare):       [TC] [PC]  [ ]  [PR] [TR]         (columns 1-2, 4-5)
 * Row 2 (Uncommon):   [ ]  [Core]  [ ]  [Radial]  [ ]   (columns 2, 4)
 * Row 1 (Common):     [ ]  [ ]  [Base]  [ ]  [ ]        (column 3)
 */

import type { IncarnateSlotId, IncarnatePower, IncarnateTier } from '@/types';
import { INCARNATE_TIER_COLORS, INCARNATE_TIER_NAMES } from '@/types';
import { getIncarnateIconPath } from '@/data';
import { Tooltip } from '@/components/ui';

interface IncarnatePowerTreeProps {
  slotId: IncarnateSlotId;
  treeId: string;
  treeName: string;
  powers: IncarnatePower[];
  selectedPowerId: string | null;
  onSelectPower: (power: IncarnatePower | null) => void;
}

export function IncarnatePowerTree({
  slotId,
  treeId: _treeId,
  treeName,
  powers,
  selectedPowerId,
  onSelectPower,
}: IncarnatePowerTreeProps) {
  void _treeId;

  // Group powers by tier and branch
  const powersByTierAndBranch = powers.reduce(
    (acc, power) => {
      if (!acc[power.tier]) {
        acc[power.tier] = { core: [], radial: [], base: [] };
      }
      acc[power.tier][power.branch].push(power);
      return acc;
    },
    {} as Record<IncarnateTier, { core: IncarnatePower[]; radial: IncarnatePower[]; base: IncarnatePower[] }>
  );

  const handlePowerClick = (power: IncarnatePower) => {
    if (selectedPowerId === power.id || selectedPowerId === power.fullName) {
      onSelectPower(null);
    } else {
      onSelectPower(power);
    }
  };

  // Get powers for each tier
  const veryRare = powersByTierAndBranch['veryrare'] || { core: [], radial: [], base: [] };
  const rare = powersByTierAndBranch['rare'] || { core: [], radial: [], base: [] };
  const uncommon = powersByTierAndBranch['uncommon'] || { core: [], radial: [], base: [] };
  const common = powersByTierAndBranch['common'] || { core: [], radial: [], base: [] };

  // For rare tier, separate Total and Partial
  const rareCorePowers = rare.core;
  const rareRadialPowers = rare.radial;

  // Sort rare powers: Total first, then Partial
  const sortRarePowers = (powers: IncarnatePower[]) => {
    return [...powers].sort((a, b) => {
      const aIsTotal = a.displayName.toLowerCase().includes('total');
      const bIsTotal = b.displayName.toLowerCase().includes('total');
      if (aIsTotal && !bIsTotal) return -1;
      if (!aIsTotal && bIsTotal) return 1;
      return 0;
    });
  };

  const sortedRareCore = sortRarePowers(rareCorePowers);
  const sortedRareRadial = sortRarePowers(rareRadialPowers);

  return (
    <div className="flex flex-col gap-2">
      {/* Tree header */}
      <div className="text-center pb-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">{treeName}</h3>
      </div>

      {/* 5-column tree grid */}
      <div className="flex flex-col items-center gap-2 py-4">
        {/* Row 4: Very Rare - columns 1 and 5 */}
        {(veryRare.core.length > 0 || veryRare.radial.length > 0) && (
          <TreeRow
            tier="veryrare"
            slots={[
              veryRare.core[0] || null,
              null,
              null,
              null,
              veryRare.radial[0] || null,
            ]}
            slotId={slotId}
            selectedPowerId={selectedPowerId}
            onPowerClick={handlePowerClick}
          />
        )}

        {/* Row 3: Rare - columns 1-2 (core) and 4-5 (radial) */}
        {(sortedRareCore.length > 0 || sortedRareRadial.length > 0) && (
          <TreeRow
            tier="rare"
            slots={[
              sortedRareCore[0] || null,
              sortedRareCore[1] || null,
              null,
              sortedRareRadial[1] || null,
              sortedRareRadial[0] || null,
            ]}
            slotId={slotId}
            selectedPowerId={selectedPowerId}
            onPowerClick={handlePowerClick}
          />
        )}

        {/* Row 2: Uncommon - columns 2 and 4 */}
        {(uncommon.core.length > 0 || uncommon.radial.length > 0) && (
          <TreeRow
            tier="uncommon"
            slots={[
              null,
              uncommon.core[0] || null,
              null,
              uncommon.radial[0] || null,
              null,
            ]}
            slotId={slotId}
            selectedPowerId={selectedPowerId}
            onPowerClick={handlePowerClick}
          />
        )}

        {/* Row 1: Common - column 3 (center) */}
        {(common.base.length > 0 || common.core.length > 0 || common.radial.length > 0) && (
          <TreeRow
            tier="common"
            slots={[
              null,
              null,
              common.base[0] || common.core[0] || common.radial[0] || null,
              null,
              null,
            ]}
            slotId={slotId}
            selectedPowerId={selectedPowerId}
            onPowerClick={handlePowerClick}
          />
        )}
      </div>
    </div>
  );
}

interface TreeRowProps {
  tier: IncarnateTier;
  slots: (IncarnatePower | null)[];
  slotId: IncarnateSlotId;
  selectedPowerId: string | null;
  onPowerClick: (power: IncarnatePower) => void;
}

function TreeRow({ tier, slots, slotId, selectedPowerId, onPowerClick }: TreeRowProps) {
  const tierColor = INCARNATE_TIER_COLORS[tier];
  const tierName = INCARNATE_TIER_NAMES[tier];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Tier label */}
      <div
        className="text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: tierColor }}
      >
        {tierName}
      </div>

      {/* 5-column grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 w-full max-w-[420px]">
        {slots.map((power, index) => (
          <div key={index} className="flex justify-center">
            {power ? (
              <PowerButton
                slotId={slotId}
                power={power}
                isSelected={selectedPowerId === power.id || selectedPowerId === power.fullName}
                onClick={() => onPowerClick(power)}
              />
            ) : (
              <div className="w-[56px] h-[56px] sm:w-[76px] sm:h-[76px]" /> // Empty placeholder
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PowerButtonProps {
  slotId: IncarnateSlotId;
  power: IncarnatePower;
  isSelected: boolean;
  onClick: () => void;
}

function PowerButton({ slotId, power, isSelected, onClick }: PowerButtonProps) {
  const tierColor = INCARNATE_TIER_COLORS[power.tier];
  const iconPath = getIncarnateIconPath(slotId, power.icon);

  // Create a shortened display name
  const shortName = power.displayName
    .replace(power.treeId.charAt(0).toUpperCase() + power.treeId.slice(1) + ' ', '')
    .replace('Core ', 'C.')
    .replace('Radial ', 'R.')
    .replace('Total ', 'T.')
    .replace('Partial ', 'P.');

  const branchLabel = power.branch === 'base' ? 'Base' : power.branch === 'core' ? 'Core' : 'Radial';

  const tooltipContent = (
    <div className="max-w-[280px]">
      <div className="font-semibold text-white">{power.displayName}</div>
      <div className="text-xs mt-1" style={{ color: tierColor }}>
        {INCARNATE_TIER_NAMES[power.tier]} - {branchLabel}
      </div>
      {power.shortHelp && (
        <div className="text-xs text-gray-400 mt-2">{power.shortHelp}</div>
      )}
      {isSelected && (
        <div className="text-xs text-yellow-400 mt-2 italic">Click again to deselect</div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      <button
        onClick={onClick}
        className={`
          relative flex flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-lg
          transition-all duration-200 w-[56px] sm:w-[76px]
          ${
            isSelected
              ? 'bg-gray-700/70 ring-2 ring-offset-1 ring-offset-gray-900'
              : 'bg-gray-800/50 hover:bg-gray-700/50'
          }
        `}
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: isSelected ? tierColor : '#374151',
          boxShadow: isSelected ? `0 0 12px ${tierColor}60` : 'none',
        }}
      >
        {/* Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden">
          <img
            src={iconPath}
            alt={power.displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/Unknown.png';
            }}
          />
        </div>

        {/* Power name */}
        <div className="text-center">
          <div className="text-[7px] sm:text-[8px] text-gray-300 leading-tight truncate max-w-[48px] sm:max-w-[68px]">
            {shortName}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    </Tooltip>
  );
}
