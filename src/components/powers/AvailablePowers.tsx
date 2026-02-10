/**
 * AvailablePowers component - shows powers available to select
 * Renders as a section within the Available Powers column (not a full column itself)
 */

import { useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';

import { getPowerset, getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import type { Power } from '@/types';

// ============================================
// REQUIRES EXPRESSION EVALUATOR
// ============================================

interface RequiresContext {
  /** Display names of all selected powers (primary + secondary) */
  selectedPowerDisplayNames: Set<string>;
  /** Internal names of all selected powers (e.g., "Dark_Regeneration") */
  selectedPowerInternalNames: Set<string>;
  /** Powerset slugs of all selected powersets (e.g., "shield-defense", "dark-armor") */
  selectedPowersetSlugs: Set<string>;
}

/**
 * Evaluate a single atom (non-compound) requires expression.
 * Returns true if the condition is met.
 */
function evaluateAtom(atom: string, ctx: RequiresContext): boolean {
  const trimmed = atom.trim();

  // Access level checks → always true for planner
  if (trimmed.includes('char>accesslevel')) return true;

  // No dots → simple display name prerequisite (e.g., "Dark Nova")
  if (!trimmed.includes('.')) {
    return ctx.selectedPowerDisplayNames.has(trimmed);
  }

  const parts = trimmed.split('.');

  // 3 segments: AT_Category.Powerset_Name.Power_Internal_Name
  // e.g., "Tanker_Defense.Dark_Armor.Obscure_Sustenance"
  if (parts.length === 3) {
    return ctx.selectedPowerInternalNames.has(parts[2]);
  }

  // 2 segments: AT_Category.Powerset_Name
  // e.g., "Tanker_Defense.Shield_Defense" or "Brute_Melee.Claws"
  if (parts.length === 2) {
    const slug = parts[1].toLowerCase().replace(/_/g, '-');
    return ctx.selectedPowersetSlugs.has(slug);
  }

  return false;
}

/**
 * Evaluate a power requires expression against the current build.
 *
 * Patterns found in data:
 * - "Power Name" → requires power by display name
 * - "AT.Set.Power" → requires power by internal name (3 segments)
 * - "AT.Set" → requires powerset to be selected (2 segments)
 * - "!expr" → negation (must NOT have)
 * - "!(a || b || c)" → none of the listed items can be present
 * - "a && b" → both conditions must be true
 * - "char>accesslevel >= 0" → always true
 */
function evaluateRequires(requires: string, ctx: RequiresContext): boolean {
  const expr = requires.trim();

  // Handle AND: "expr1 && expr2 && ..."
  if (expr.includes('&&')) {
    return expr.split('&&').every(part => evaluateRequires(part.trim(), ctx));
  }

  // Handle negated group: !(a || b || c)
  if (expr.startsWith('!(') && expr.endsWith(')')) {
    const inner = expr.slice(2, -1);
    return inner.split('||').every(part => !evaluateAtom(part.trim(), ctx));
  }

  // Handle parenthesized group: (a || b || c) or (expr)
  if (expr.startsWith('(') && expr.endsWith(')')) {
    const inner = expr.slice(1, -1);
    if (inner.includes('||')) {
      return inner.split('||').some(part => evaluateAtom(part.trim(), ctx));
    }
    return evaluateRequires(inner, ctx);
  }

  // Handle simple negation: !atom
  if (expr.startsWith('!')) {
    return !evaluateAtom(expr.slice(1), ctx);
  }

  // Simple atom
  return evaluateAtom(expr, ctx);
}

interface AvailablePowersProps {
  powersetId: string | null;
  category: 'primary' | 'secondary';
  selectedPowerNames: string[];
  onSelectPower: (power: Power) => void;
}

interface PowerItemProps {
  power: Power;
  powersetId: string;
  powersetName: string;
  isSelected: boolean;
  isAvailable: boolean;
  isDisabled: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  onLockToggle: () => void;
  onShowInfo: (e?: React.MouseEvent) => void;
}

function PowerItem({
  power,
  powersetId: _powersetId,
  powersetName,
  isSelected,
  isAvailable,
  isDisabled,
  isLocked,
  onSelect,
  onHover,
  onLeave,
  onLockToggle,
  onShowInfo,
}: PowerItemProps) {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLockToggle();
  };

  const handleClick = (_e: React.MouseEvent) => {
    if (!isDisabled) {
      onSelect();
    }
  };

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onContextMenu={handleRightClick}
      onClick={handleClick}
      title={isLocked ? 'Right-click to unlock' : 'Right-click for info'}
      className={`
        w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm
        transition-colors text-left text-xs select-none
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
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
      }}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <img
        src={getPowerIconPath(powersetName, power.icon)}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0 pointer-events-none"
        draggable={false}
        onError={(e) => {
          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
        }}
      />
      <span className="truncate flex-1 text-slate-200 pointer-events-none">
        {power.name}
      </span>
      <span
        className={`text-[10px] flex-shrink-0 pointer-events-none ${
          isAvailable ? 'text-slate-500' : 'text-amber-500/70'
        }`}
        title={isAvailable ? `Available at level ${power.available + 1}` : `Requires level ${power.available + 1}`}
      >
        L{power.available + 1}
      </span>
      {/* Mobile info button - only visible on small screens */}
      <button
        onClick={onShowInfo}
        className="lg:hidden flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-blue-600/20 transition-colors"
        title="View power info"
        aria-label="View power info"
      >
        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}

export function AvailablePowers({
  powersetId,
  category,
  selectedPowerNames,
  onSelectPower,
}: AvailablePowersProps) {
  const [collapsed, setCollapsed] = useState(false);
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

  // Build context for requires expression evaluation
  const allSelectedPowerNames = new Set([
    ...build.primary.powers.map(p => p.name),
    ...build.secondary.powers.map(p => p.name),
  ]);

  const requiresContext: RequiresContext = (() => {
    const selectedPowerInternalNames = new Set<string>();
    const selectedPowersetSlugs = new Set<string>();

    // Collect internal names from selected powers
    for (const p of build.primary.powers) {
      if (p.internalName) selectedPowerInternalNames.add(p.internalName);
    }
    for (const p of build.secondary.powers) {
      if (p.internalName) selectedPowerInternalNames.add(p.internalName);
    }

    // Collect powerset slugs (e.g., "shield-defense" from "tanker/shield-defense")
    if (build.primary.id) {
      const slug = build.primary.id.split('/')[1];
      if (slug) selectedPowersetSlugs.add(slug);
    }
    if (build.secondary.id) {
      const slug = build.secondary.id.split('/')[1];
      if (slug) selectedPowersetSlugs.add(slug);
    }
    for (const pool of build.pools) {
      if (pool.id) {
        const slug = pool.id.split('/')[1];
        if (slug) selectedPowersetSlugs.add(slug);
      }
    }
    if (build.epicPool?.id) {
      const slug = build.epicPool.id.split('/')[1];
      if (slug) selectedPowersetSlugs.add(slug);
    }

    return {
      selectedPowerDisplayNames: allSelectedPowerNames,
      selectedPowerInternalNames,
      selectedPowersetSlugs,
    };
  })();

  // Show ALL user-selectable powers, not just ones available at current level
  // Powers not yet available will be shown as disabled
  // Powers with available === -1 are auto-granted and should not be shown in selection
  // Powers with requires field are hidden when their constraint isn't satisfied
  const allPowers = powerset
    ? powerset.powers.filter(p => {
        // Filter out auto-granted powers
        if (p.available < 0) return false;
        // Evaluate requires expression (handles negation, internal names, powersets)
        if (p.requires && !evaluateRequires(p.requires, requiresContext)) return false;
        return true;
      })
    : [];
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

  const handleShowInfo = (power: Power, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent power selection when clicking info button
    }
    if (!powersetId) return;

    lockInfoPanel({
      type: 'power',
      powerName: power.name,
      powerSet: powersetId,
    });
  };

  const handleLockToggle = (power: Power) => {
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
      {/* Section header with powerset name - clickable to collapse */}
      <div
        className="flex items-center justify-between mb-1 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1">
          <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
            ▶
          </span>
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            {powerset?.name || categoryLabel}
          </div>
          <span className="text-[9px] text-slate-600">({selectedPowerNames.length})</span>
        </div>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <>
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
              {categoryLabel} power selected
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
                  <PowerItem
                    key={power.name}
                    power={power}
                    powersetId={powersetId}
                    powersetName={powerset?.name || ''}
                    isSelected={isSelected}
                    isAvailable={isAvailable}
                    isDisabled={isDisabled}
                    isLocked={isLocked}
                    onSelect={() => onSelectPower(power)}
                    onHover={() => handlePowerHover(power)}
                    onLeave={handlePowerLeave}
                    onLockToggle={() => handleLockToggle(power)}
                    onShowInfo={(e) => handleShowInfo(power, e)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
