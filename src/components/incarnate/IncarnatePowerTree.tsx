/**
 * IncarnatePowerTree component - displays the power tree for a specific incarnate tree
 * Shows powers organized by tier in a 5-column tree structure:
 *
 * Row 4 (Very Rare):  [Core]  [ ]  [ ]  [ ]  [Radial]   (columns 1, 5)
 * Row 3 (Rare):       [TC] [PC]  [ ]  [PR] [TR]         (columns 1-2, 4-5)
 * Row 2 (Uncommon):   [ ]  [Core]  [ ]  [Radial]  [ ]   (columns 2, 4)
 * Row 1 (Common):     [ ]  [ ]  [Base]  [ ]  [ ]        (column 3)
 */

import { useState, useMemo, useCallback } from 'react';
import type { IncarnateSlotId, IncarnatePower, IncarnateTier, IncarnateBranch } from '@/types';
import {
  getPowerIconPath,
  getTierColor,
  getTierDisplayName,
  abbreviatePowerName,
  resolveTreeRow,
  sortRarePowers,
  STANDARD_TREE_LAYOUT,
} from '@/data';
import { useBuildStore, useUIStore } from '@/stores';
import { getIncarnateEffectData } from './IncarnateEffectsTooltip';

// ============================================
// T4 RIGHT-CLICK CYCLING: T3 PAIR DEFINITIONS
// ============================================

/** Reference to a T3 node by branch and sort index */
interface T3NodeRef {
  branch: IncarnateBranch;
  index: number;
  label: string;
}

const ALL_T3_NODES: T3NodeRef[] = [
  { branch: 'core', index: 0, label: 'Total Core' },
  { branch: 'core', index: 1, label: 'Partial Core' },
  { branch: 'radial', index: 0, label: 'Total Radial' },
  { branch: 'radial', index: 1, label: 'Partial Radial' },
];

/** All C(4,2) = 6 possible T3 pairs for T4 crafting */
const T3_PAIRS: [T3NodeRef, T3NodeRef][] = [];
for (let i = 0; i < ALL_T3_NODES.length; i++) {
  for (let j = i + 1; j < ALL_T3_NODES.length; j++) {
    T3_PAIRS.push([ALL_T3_NODES[i], ALL_T3_NODES[j]]);
  }
}

// ============================================
// PATH COMPUTATION
// ============================================

type PowersByTierAndBranch = Record<string, Record<string, IncarnatePower[]>>;

/**
 * Compute the set of power IDs that are prerequisites of the selected power.
 * These get the subtle "on path" highlight.
 */
function computePathPowerIds(
  selectedPower: IncarnatePower | null,
  grouped: PowersByTierAndBranch,
  t4T3Pair: [IncarnatePower, IncarnatePower] | null
): Set<string> {
  const pathIds = new Set<string>();
  if (!selectedPower) return pathIds;

  const addPower = (tier: string, branch: string, index?: number) => {
    const powers = grouped[tier]?.[branch] || [];
    if (index !== undefined) {
      const sorted = sortRarePowers(powers);
      if (sorted[index]) pathIds.add(sorted[index].id);
    } else if (powers[0]) {
      pathIds.add(powers[0].id);
    }
  };

  const { tier, branch } = selectedPower;

  if (tier === 'uncommon') {
    addPower('common', 'base');
  } else if (tier === 'rare') {
    addPower('common', 'base');
    addPower('uncommon', branch);
  } else if (tier === 'veryrare') {
    addPower('common', 'base');
    if (t4T3Pair) {
      for (const t3Power of t4T3Pair) {
        pathIds.add(t3Power.id);
        addPower('uncommon', t3Power.branch);
      }
    } else {
      // Default: both T3s on the same branch as the T4
      addPower('uncommon', branch);
      addPower('rare', branch, 0);
      addPower('rare', branch, 1);
    }
  }

  return pathIds;
}

// ============================================
// INFO PANEL
// ============================================

interface InfoPanelProps {
  power: IncarnatePower | null;
  slotId: IncarnateSlotId;
}

function InfoPanel({ power, slotId }: InfoPanelProps) {
  const build = useBuildStore((s) => s.build);
  const tierColor = power ? getTierColor(power.tier) : undefined;
  const effectData = power ? getIncarnateEffectData(slotId, power.id, build.archetype.id ?? undefined, build.level) : null;

  return (
    <div
      className="px-3 py-2 border-b border-gray-700/50 h-[120px] overflow-y-auto"
      style={{ backgroundColor: power && tierColor ? `${tierColor}08` : undefined }}
    >
      {!power ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-xs text-gray-500 italic">Tap or hover a power to see details</span>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 h-full text-[11px]">
          {/* Col 1: name, tier, description, effect header */}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-white">{power.displayName}</div>
            <div style={{ color: tierColor }}>{getTierDisplayName(power.tier)}</div>
            {power.shortHelp && (
              <div className="text-gray-400 leading-snug mt-0.5">{power.shortHelp}</div>
            )}
            {effectData && (
              <div className="text-cyan-400 font-semibold mt-1">{effectData.header}</div>
            )}
            {effectData?.footer && (
              <div className="text-gray-500 text-[10px] mt-0.5">{effectData.footer}</div>
            )}
            {effectData?.tags && (
              <div className="mt-0.5">
                {effectData.tags.map((t, i) => (
                  <span key={i} className="inline-block bg-gray-700 rounded px-1 mr-1 mb-0.5 text-[10px] text-gray-400">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Cols 2-3: effect rows flowing across two columns */}
          {effectData && effectData.entries.length > 0 && (
            <div className="col-span-2 columns-2 gap-x-4 space-y-0.5">
              {effectData.entries.map((entry, i) => (
                <div key={i} className="flex justify-between gap-2 break-inside-avoid">
                  <span className="text-gray-400">{entry.label}</span>
                  <span className="text-cyan-300">{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

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

  const t4ComboIndex = useUIStore((s) => (selectedPowerId ? s.incarnateT4ComboIndex[selectedPowerId] ?? 0 : 0));
  const setIncarnateT4ComboIndex = useUIStore((s) => s.setIncarnateT4ComboIndex);
  const [hoveredPower, setHoveredPower] = useState<IncarnatePower | null>(null);

  // Group powers by tier and branch (memoized)
  const powersByTierAndBranch = useMemo(
    () =>
      powers.reduce(
        (acc, power) => {
          if (!acc[power.tier]) acc[power.tier] = {};
          if (!acc[power.tier][power.branch]) acc[power.tier][power.branch] = [];
          acc[power.tier][power.branch].push(power);
          return acc;
        },
        {} as PowersByTierAndBranch
      ),
    [powers]
  );

  // Find the selected power object
  const selectedPower = useMemo(
    () =>
      selectedPowerId
        ? powers.find((p) => p.id === selectedPowerId || p.fullName === selectedPowerId) || null
        : null,
    [selectedPowerId, powers]
  );

  // Resolve T4's current T3 pair
  const t4T3Pair = useMemo((): [IncarnatePower, IncarnatePower] | null => {
    if (!selectedPower || selectedPower.tier !== 'veryrare') return null;
    const pair = T3_PAIRS[t4ComboIndex % T3_PAIRS.length];
    const resolve = (ref: T3NodeRef): IncarnatePower | null => {
      const rarePowers = powersByTierAndBranch['rare']?.[ref.branch] || [];
      const sorted = sortRarePowers(rarePowers);
      return sorted[ref.index] || null;
    };
    const p1 = resolve(pair[0]);
    const p2 = resolve(pair[1]);
    if (!p1 || !p2) return null;
    return [p1, p2];
  }, [selectedPower, t4ComboIndex, powersByTierAndBranch]);

  // Compute path power IDs for subtle highlighting
  const pathPowerIds = useMemo(
    () => computePathPowerIds(selectedPower, powersByTierAndBranch, t4T3Pair),
    [selectedPower, powersByTierAndBranch, t4T3Pair]
  );

  const handlePowerClick = (power: IncarnatePower) => {
    if (selectedPowerId === power.id || selectedPowerId === power.fullName) {
      onSelectPower(null);
    } else {
      onSelectPower(power);
    }
  };

  const handlePowerContextMenu = useCallback(
    (power: IncarnatePower, e: React.MouseEvent) => {
      if (power.tier === 'veryrare' && selectedPowerId) {
        e.preventDefault();
        setIncarnateT4ComboIndex(selectedPowerId, (t4ComboIndex + 1) % T3_PAIRS.length);
      }
    },
    [selectedPowerId, t4ComboIndex, setIncarnateT4ComboIndex]
  );

  const handleCyclePair = useCallback((direction: 1 | -1) => {
    if (selectedPowerId) {
      setIncarnateT4ComboIndex(selectedPowerId, (t4ComboIndex + direction + T3_PAIRS.length) % T3_PAIRS.length);
    }
  }, [selectedPowerId, t4ComboIndex, setIncarnateT4ComboIndex]);

  const handleHover = useCallback((power: IncarnatePower | null) => {
    setHoveredPower(power);
  }, []);

  // Build T4 pair label
  const t4PairLabel = t4T3Pair
    ? `${t4T3Pair[0].displayName} + ${t4T3Pair[1].displayName}`
    : null;

  // The power shown in the info panel: hovered takes priority, then selected
  const infoPower = hoveredPower || selectedPower;
  return (
    <div className="flex flex-col gap-0">
      {/* Info panel - shows details for hovered or selected power */}
      <InfoPanel power={infoPower} slotId={slotId} />

      {/* 5-column tree grid - driven by STANDARD_TREE_LAYOUT */}
      <div className="flex flex-col items-center gap-1.5 py-3">
        {STANDARD_TREE_LAYOUT.rows.map(({ tier, layout }) => {
          const resolvedPowers = resolveTreeRow(layout, powersByTierAndBranch);
          const hasAnyPower = resolvedPowers.some((p) => p !== null);
          if (!hasAnyPower) return null;

          return (
            <TreeRow
              key={tier}
              tier={tier}
              slots={resolvedPowers}
              treeName={treeName}
              selectedPowerId={selectedPowerId}
              pathPowerIds={pathPowerIds}
              onPowerClick={handlePowerClick}
              onPowerContextMenu={handlePowerContextMenu}
              onPowerHover={handleHover}
              t4PairLabel={tier === 'veryrare' ? t4PairLabel : null}
              t4ComboIndex={t4ComboIndex}
              onCyclePair={handleCyclePair}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// TREE ROW
// ============================================

interface TreeRowProps {
  tier: IncarnateTier;
  slots: (IncarnatePower | null)[];
  treeName: string;
  selectedPowerId: string | null;
  pathPowerIds: Set<string>;
  onPowerClick: (power: IncarnatePower) => void;
  onPowerContextMenu: (power: IncarnatePower, e: React.MouseEvent) => void;
  onPowerHover: (power: IncarnatePower | null) => void;
  t4PairLabel: string | null;
  t4ComboIndex: number;
  onCyclePair: (direction: 1 | -1) => void;
}

function TreeRow({
  tier,
  slots,
  treeName,
  selectedPowerId,
  pathPowerIds,
  onPowerClick,
  onPowerContextMenu,
  onPowerHover,
  t4PairLabel,
  t4ComboIndex,
  onCyclePair,
}: TreeRowProps) {
  const tierColor = getTierColor(tier);
  const tierName = getTierDisplayName(tier);
  const showCycler = tier === 'veryrare' && t4PairLabel !== null;

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
        {slots.map((power, index) => {
          // For veryrare row, use the 3 empty middle cells (indices 1-3) for the path cycler
          if (showCycler && !power && index >= 1 && index <= 3) {
            // Render the cycler at index 1, skip 2 and 3 (col-span-3 covers them)
            if (index !== 1) return null;
            return (
              <div key={index} className="col-span-3 flex items-center justify-center gap-1">
                <button
                  onClick={() => onCyclePair(-1)}
                  className="px-1.5 py-0.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  aria-label="Previous crafting path"
                >
                  &larr;
                </button>
                <span className="text-[10px] text-gray-500 tabular-nums">{t4ComboIndex + 1}/{T3_PAIRS.length}</span>
                <button
                  onClick={() => onCyclePair(1)}
                  className="px-1.5 py-0.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  aria-label="Next crafting path"
                >
                  &rarr;
                </button>
              </div>
            );
          }

          return (
            <div key={index} className="flex justify-center">
              {power ? (
                <PowerButton
                  power={power}
                  treeName={treeName}
                  isSelected={selectedPowerId === power.id || selectedPowerId === power.fullName}
                  isOnPath={pathPowerIds.has(power.id)}
                  onClick={() => onPowerClick(power)}
                  onContextMenu={(e) => onPowerContextMenu(power, e)}
                  onHover={onPowerHover}
                />
              ) : (
                <div className="w-[56px] h-[56px] sm:w-[76px] sm:h-[76px]" /> // Empty placeholder
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// POWER BUTTON
// ============================================

interface PowerButtonProps {
  power: IncarnatePower;
  treeName: string;
  isSelected: boolean;
  isOnPath: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onHover: (power: IncarnatePower | null) => void;
}

function PowerButton({
  power,
  treeName,
  isSelected,
  isOnPath,
  onClick,
  onContextMenu,
  onHover,
}: PowerButtonProps) {
  const tierColor = getTierColor(power.tier);
  const iconPath = getPowerIconPath(power.icon);
  const shortName = abbreviatePowerName(power.displayName, treeName);

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => onHover(power)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={() => onHover(power)}
      className={`
        relative flex flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-lg
        transition-all duration-200 w-[56px] sm:w-[76px]
        ${
          isSelected
            ? 'bg-gray-700/70 ring-2 ring-offset-1 ring-offset-gray-900'
            : isOnPath
              ? 'bg-gray-700/40 ring-1 ring-offset-1 ring-offset-gray-900'
              : 'bg-gray-800/50 hover:bg-gray-700/50'
        }
      `}
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isSelected ? tierColor : isOnPath ? `${tierColor}80` : '#374151',
        boxShadow: isSelected
          ? `0 0 12px ${tierColor}60`
          : isOnPath
            ? `0 0 6px ${tierColor}30`
            : 'none',
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
  );
}
