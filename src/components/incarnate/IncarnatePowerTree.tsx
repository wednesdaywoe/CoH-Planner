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
import {
  getIncarnateIconPath,
  getTierColor,
  getTierDisplayName,
  abbreviatePowerName,
  resolveTreeRow,
  STANDARD_TREE_LAYOUT,
} from '@/data';
import { Tooltip } from '@/components/ui';
import { IncarnateEffectsTooltip } from './IncarnateEffectsTooltip';

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
        acc[power.tier] = {};
      }
      if (!acc[power.tier][power.branch]) {
        acc[power.tier][power.branch] = [];
      }
      acc[power.tier][power.branch].push(power);
      return acc;
    },
    {} as Record<string, Record<string, IncarnatePower[]>>
  );

  const handlePowerClick = (power: IncarnatePower) => {
    if (selectedPowerId === power.id || selectedPowerId === power.fullName) {
      onSelectPower(null);
    } else {
      onSelectPower(power);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Tree header */}
      <div className="text-center pb-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">{treeName}</h3>
      </div>

      {/* 5-column tree grid - driven by STANDARD_TREE_LAYOUT */}
      <div className="flex flex-col items-center gap-2 py-4">
        {STANDARD_TREE_LAYOUT.rows.map(({ tier, layout }) => {
          const resolvedPowers = resolveTreeRow(layout, powersByTierAndBranch);
          const hasAnyPower = resolvedPowers.some((p) => p !== null);
          if (!hasAnyPower) return null;

          return (
            <TreeRow
              key={tier}
              tier={tier}
              slots={resolvedPowers}
              slotId={slotId}
              treeName={treeName}
              selectedPowerId={selectedPowerId}
              onPowerClick={handlePowerClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TreeRowProps {
  tier: IncarnateTier;
  slots: (IncarnatePower | null)[];
  slotId: IncarnateSlotId;
  treeName: string;
  selectedPowerId: string | null;
  onPowerClick: (power: IncarnatePower) => void;
}

function TreeRow({ tier, slots, slotId, treeName, selectedPowerId, onPowerClick }: TreeRowProps) {
  const tierColor = getTierColor(tier);
  const tierName = getTierDisplayName(tier);

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
                treeName={treeName}
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
  treeName: string;
  isSelected: boolean;
  onClick: () => void;
}

function PowerButton({ slotId, power, treeName, isSelected, onClick }: PowerButtonProps) {
  const tierColor = getTierColor(power.tier);
  const iconPath = getIncarnateIconPath(slotId, power.icon);
  const shortName = abbreviatePowerName(power.displayName, treeName);
  const branchLabel = power.branch === 'base' ? 'Base' : power.branch === 'core' ? 'Core' : 'Radial';

  const tooltipContent = (
    <div className="max-w-[300px]">
      <div className="font-semibold text-white">{power.displayName}</div>
      <div className="text-xs mt-1" style={{ color: tierColor }}>
        {getTierDisplayName(power.tier)} - {branchLabel}
      </div>
      {power.shortHelp && (
        <div className="text-xs text-gray-400 mt-1">{power.shortHelp}</div>
      )}
      <IncarnateEffectsTooltip slotId={slotId} powerId={power.id} />
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

