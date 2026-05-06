/**
 * AvailablePowers component - shows powers available to select
 * Renders as a section within the Available Powers column (not a full column itself)
 */

import { useMemo, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { useIsTouchDevice } from '@/hooks';

import { getPowerset, getPowerIconPath, MAX_POWER_PICKS, GRANTED_POWER_GROUPS, getArchetypeInherentPowers, getPowerPicksAtLevel } from '@/data';
import { KHELDIAN_FORM_VARIANT_NAMES } from '@/data/datasets/rebirth/kheldian-redirects';
import { resolvePath } from '@/utils/paths';
import type { Power } from '@/types';

/**
 * Set of form sub-power INTERNAL NAMES (auto-granted on HC; redirect-only
 * on Rebirth). Either way, never user-pickable — filter them from the
 * picker.
 *
 * Computed lazily inside the component because GRANTED_POWER_GROUPS is a
 * dataset-backed Proxy: reading it at module-load time runs before the
 * active dataset has been resolved and throws. Re-evaluated when
 * `build.serverId` changes so a dataset switch picks up the new dataset's
 * granted-power groups.
 *
 * Includes both:
 *   - HC's slottable granted-power members (still works for HC where forms
 *     auto-grant their variants as separate slottable picks).
 *   - The full Rebirth `KHELDIAN_FORM_VARIANT_NAMES` set (Rebirth uses
 *     PowerRedirector, so these are never picks regardless of whether
 *     a form toggle is in the build).
 */
function buildFormSubPowerNames(): Set<string> {
  const names = new Set<string>(
    Object.values(GRANTED_POWER_GROUPS)
      .filter(g => g.slottable)
      .flatMap(g => g.grantedPowers),
  );
  for (const n of KHELDIAN_FORM_VARIANT_NAMES) names.add(n);
  return names;
}

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
 * Evaluate a Reverse Polish Notation requires expression. Raw .def files use
 * RPN (operators come after operands), and the converter doesn't translate
 * to infix, so we evaluate RPN directly.
 *
 * Examples:
 *   "X !"                   → !X
 *   "A B && C !"            → A && B && !C
 *   "A B || C || D || !"    → !(A || B || C || D)
 */
function evaluateRpnRequires(expr: string, ctx: RequiresContext): boolean | null {
  // Tokenize on whitespace; trailing comma is a terminator some powers carry.
  const tokens = expr.replace(/,$/, '').trim().split(/\s+/);
  const stack: boolean[] = [];
  for (const tok of tokens) {
    if (tok === '!') {
      if (stack.length < 1) return null;
      stack.push(!stack.pop()!);
    } else if (tok === '&&') {
      if (stack.length < 2) return null;
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(a && b);
    } else if (tok === '||') {
      if (stack.length < 2) return null;
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(a || b);
    } else {
      stack.push(evaluateAtom(tok, ctx));
    }
  }
  if (stack.length !== 1) return null; // not a clean RPN expression
  return stack[0];
}

/**
 * Detect RPN form. The last whitespace-separated token is one of the operator
 * symbols `!`, `&&`, `||` (the operator follows its operands in RPN).
 */
function looksLikeRpn(expr: string): boolean {
  const trimmed = expr.replace(/,$/, '').trim();
  const lastSpace = trimmed.lastIndexOf(' ');
  if (lastSpace < 0) return false;
  const lastTok = trimmed.slice(lastSpace + 1);
  return lastTok === '!' || lastTok === '&&' || lastTok === '||';
}

/**
 * Evaluate a power requires expression against the current build.
 *
 * Two forms appear in data:
 * - **RPN** (from raw .def files):
 *     "X !"                  → !X
 *     "A B && C !"           → A && B && !C
 *     "A B || C || D || !"   → !(A || B || C || D)
 * - **Infix** (translated by an earlier converter pass):
 *     "Power Name"           → requires power by display name
 *     "AT.Set.Power"         → requires power by internal name
 *     "AT.Set"               → requires powerset to be selected
 *     "!expr"                → prefix negation
 *     "!(a || b || c)"       → none of the listed items can be present
 *     "a && b"               → both conditions must be true
 *     "char>accesslevel >= 0" → always true
 *
 * Detection: if the trailing token is an operator (`!`, `&&`, `||`), parse as
 * RPN; otherwise fall through to the infix logic.
 */
function evaluateRequires(requires: string, ctx: RequiresContext): boolean {
  const expr = requires.trim();

  // RPN form (raw .def expressions)
  if (looksLikeRpn(expr)) {
    const result = evaluateRpnRequires(expr, ctx);
    if (result !== null) return result;
    // Fall through to infix on RPN parse failure (defensive)
  }

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

  // Handle count expression: "A + B + C > N" (need more than N of the listed powers)
  if (expr.includes('>') && expr.includes('+')) {
    const [sumPart, thresholdPart] = expr.split('>').map(s => s.trim());
    const threshold = parseInt(thresholdPart, 10);
    if (!isNaN(threshold)) {
      const atoms = sumPart.split('+').map(s => s.trim());
      const count = atoms.filter(a => evaluateAtom(a, ctx)).length;
      return count > threshold;
    }
  }

  // Simple atom
  return evaluateAtom(expr, ctx);
}

interface AvailablePowersProps {
  powersetId: string | null;
  category: 'primary' | 'secondary';
  selectedPowerNames: string[];
  onSelectPower: (power: Power) => void;
  /** Compact mode: no section header/collapse, tighter rows, used in side-by-side layout */
  compact?: boolean;
}

export interface PowerItemProps {
  power: Power;
  powersetId: string;
  powersetName: string;
  /** Pre-resolved icon path (overrides default getPowerIconPath) */
  iconSrc?: string;
  /** Accent color for hover border */
  accentColor?: 'blue' | 'purple';
  isSelected: boolean;
  isAvailable: boolean;
  isDisabled: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onRemove?: () => void;
  onHover: () => void;
  onLeave: () => void;
  onLockToggle: () => void;
  onShowInfo: (e?: React.MouseEvent) => void;
}

export function PowerItem({
  power,
  powersetId: _powersetId,
  powersetName: _powersetName,
  iconSrc,
  accentColor = 'blue',
  isSelected,
  isAvailable,
  isDisabled,
  isLocked,
  onSelect,
  onRemove,
  onHover,
  onLeave,
  onLockToggle,
  onShowInfo,
}: PowerItemProps) {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLockToggle();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isSelected && onRemove) {
      onRemove();
    } else if (!isDisabled) {
      onSelect();
    }
    // Drop focus after activation. Chrome/Edge auto-focus role=button divs
    // on click; without this blur, a subsequent Space press on the still-
    // focused row re-fires onSelect and duplicates the power.
    (e.currentTarget as HTMLDivElement).blur();
  };

  const hoverBorderClass = accentColor === 'purple'
    ? 'hover:border-purple-500'
    : 'hover:border-blue-500';
  const infoBtnBgClass = accentColor === 'purple'
    ? 'hover:bg-purple-600/20'
    : 'hover:bg-blue-600/20';
  const infoBtnTextClass = accentColor === 'purple'
    ? 'text-purple-400'
    : 'text-blue-400';

  const isTouch = useIsTouchDevice();

  return (
    <div
      onMouseEnter={isTouch ? undefined : onHover}
      onMouseLeave={isTouch ? undefined : onLeave}
      onContextMenu={handleRightClick}
      onClick={handleClick}
      data-info-hover="power"
      title={
        isTouch
          ? (isLocked ? 'Tap ⓘ to unlock' : 'Tap ⓘ for info')
          : (isLocked ? 'Right-click to unlock' : 'Right-click for info')
      }
      className={`
        w-full flex items-center gap-1.5 px-1.5 py-1 rounded-sm
        transition-colors text-left text-xs select-none
        ${
          isLocked
            ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
            : isSelected
              ? 'bg-blue-900/30 border border-blue-600/50 hover:border-red-500/70 cursor-pointer'
              : isDisabled
                ? 'bg-slate-800/50 border border-slate-700/50 opacity-40 cursor-not-allowed'
                : `bg-slate-800 border border-slate-700 ${hoverBorderClass} cursor-pointer`
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
        if (isDisabled) return;
        if (e.key !== 'Enter' && e.key !== ' ') return;
        // Ignore auto-repeat (held key generates a flood of events) — without
        // this, holding Space adds the same power dozens of times per second.
        if (e.repeat) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        onSelect();
        // Drop focus after activation so a subsequent unrelated Space press
        // (e.g. user scrolling with keys) doesn't re-add the same power.
        (e.currentTarget as HTMLDivElement).blur();
      }}
    >
      {/* Level badge */}
      <span
        className={`text-[10px] font-semibold flex-shrink-0 w-5 text-right pointer-events-none ${
          isAvailable ? 'text-slate-500' : 'text-amber-500/70'
        }`}
        title={isAvailable ? `Available at level ${power.available + 1}` : `Requires level ${power.available + 1}`}
      >
        {power.available + 1}
      </span>
      {/* Power icon */}
      <img
        src={iconSrc || getPowerIconPath(power.icon)}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0 pointer-events-none"
        draggable={false}
        onError={(e) => {
          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
        }}
      />
      {/* Power name */}
      <span className="truncate flex-1 text-slate-200 pointer-events-none">
        {power.name}
      </span>
      {/* Mobile info button - only visible on small screens */}
      <button
        onClick={onShowInfo}
        className={`lg:hidden flex-shrink-0 w-5 h-5 flex items-center justify-center rounded ${infoBtnBgClass} transition-colors`}
        title="View power info"
        aria-label="View power info"
      >
        <svg className={`w-3.5 h-3.5 ${infoBtnTextClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  compact = false,
}: AvailablePowersProps) {
  const [collapsed, setCollapsed] = useState(false);
  const build = useBuildStore((s) => s.build);
  const removePower = useBuildStore((s) => s.removePower);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const levelUpMode = useUIStore((s) => s.levelUpMode);

  const archetypeId = build.archetype.id;
  const categoryLabel = category === 'primary' ? 'Primary' : 'Secondary';

  // Lazy because GRANTED_POWER_GROUPS is dataset-backed; recomputed when
  // the active server changes (via build.serverId in the dependency).
  const formSubPowerNames = useMemo(buildFormSubPowerNames, [build.serverId]);

  // Both powersets must be selected before powers can be chosen
  const bothPowersetsSelected = build.primary.id && build.secondary.id;

  // Check if 24-power limit has been reached (exclude auto-granted form sub-powers)
  const countNonGranted = (powers: { isAutoGranted?: boolean }[]) =>
    powers.filter(p => !p.isAutoGranted).length;
  const totalPicksUsed =
    countNonGranted(build.primary.powers) +
    countNonGranted(build.secondary.powers) +
    build.pools.reduce((sum: number, pool: { powers: { isAutoGranted?: boolean }[] }) => sum + countNonGranted(pool.powers), 0) +
    (build.epicPool ? countNonGranted(build.epicPool.powers) : 0);
  const powerLimitReached = totalPicksUsed >= MAX_POWER_PICKS;

  // Level Up mode: also gate by per-level pick quota. The user cannot pick more
  // powers than their current level grants cumulatively — they must advance first.
  const levelUpPickQuotaReached = levelUpMode && totalPicksUsed >= getPowerPicksAtLevel(build.level);

  const powerset = powersetId ? getPowerset(powersetId) : null;

  // Build context for requires expression evaluation. Include pool + epic
  // display names so prerequisites that reference them (e.g. "Hover" for
  // Afterburner) resolve regardless of whether the referencing power is
  // itself a pool pick.
  const allSelectedPowerNames = new Set<string>([
    ...build.primary.powers.map(p => p.name),
    ...build.secondary.powers.map(p => p.name),
    ...build.pools.flatMap(pool => pool.powers.map(p => p.name)),
    ...(build.epicPool ? build.epicPool.powers.map(p => p.name) : []),
  ]);

  const requiresContext: RequiresContext = (() => {
    const selectedPowerInternalNames = new Set<string>();
    const selectedPowersetSlugs = new Set<string>();

    // Collect internal names from selected powers. Include pool + epic
    // picks so intra-pool prerequisites (e.g. Tough requiring Kick or
    // Boxing from the Fighting pool) can resolve.
    for (const p of build.primary.powers) {
      if (p.internalName) selectedPowerInternalNames.add(p.internalName);
    }
    for (const p of build.secondary.powers) {
      if (p.internalName) selectedPowerInternalNames.add(p.internalName);
    }
    for (const pool of build.pools) {
      for (const p of pool.powers) {
        if (p.internalName) selectedPowerInternalNames.add(p.internalName);
      }
    }
    if (build.epicPool) {
      for (const p of build.epicPool.powers) {
        if (p.internalName) selectedPowerInternalNames.add(p.internalName);
      }
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

  // Build set of archetype-specific inherent power identifiers (e.g. Kheldian
  // travel powers) so we can hide them from the selectable powerset list.
  // Match on internalName because it's stable across servers — Rebirth renames
  // some Kheldian powers (e.g. Shadow_Recall → "Starless Recall"), so a
  // display-name match would miss them and the user would see the same power
  // as both an inherent and a selectable secondary pick.
  const archetypeInherentInternalNames = new Set(
    getArchetypeInherentPowers(archetypeId ?? undefined).map(p => p.internalName)
  );

  // Show ALL user-selectable powers, not just ones available at current level
  // Powers not yet available will be shown as disabled
  // Powers with available === -1 are auto-granted and should not be shown in selection
  // Powers with requires field are hidden when their constraint isn't satisfied
  // Form sub-powers (Kheldian Nova/Dwarf attacks) are auto-granted and hidden
  const allPowers = powerset
    ? powerset.powers.filter(p => {
        // Filter out auto-granted powers
        if (p.available < 0) return false;
        // Filter out set mechanics/inherents (hiddenPassive, hiddenAuto, etc.)
        if (p.mechanicType === 'hiddenPassive' || p.mechanicType === 'hiddenAuto') return false;
        // Filter out form sub-powers (auto-granted on HC; redirect-only on Rebirth).
        // Match on internalName since form-variant names use that format
        // (`Bright_Nova_Bolt`); display name (`Bright Nova Bolt`) wouldn't.
        if (p.internalName && formSubPowerNames.has(p.internalName)) return false;
        // Filter out powers already granted as archetype inherents
        if (p.internalName && archetypeInherentInternalNames.has(p.internalName)) return false;
        // Evaluate requires expression (handles negation, internal names, powersets)
        if (p.requires && !evaluateRequires(p.requires, requiresContext)) return false;
        return true;
      })
    : [];
  const selectedSet = new Set(selectedPowerNames);

  // Enforce level 1 picks: both primary and secondary must each have at least
  // one power before the user can pick any higher-level powers.
  const primaryHasPower = build.primary.powers.length > 0;
  const secondaryHasPower = build.secondary.powers.length > 0;
  const level1PicksDone = primaryHasPower && secondaryHasPower;

  // While level 1 picks aren't done, restrict to level 1 rules
  const isLevel1 = !level1PicksDone;
  const hasPickedPowerThisCategory = selectedPowerNames.length > 0;
  const otherCategoryHasPower = category === 'primary' ? secondaryHasPower : primaryHasPower;
  const isLevel1BlockedForSecondPick = isLevel1 && hasPickedPowerThisCategory && !otherCategoryHasPower;

  const handlePowerHover = (power: Power) => {
    // Always update hover content - tooltip uses this even when panel is locked
    if (powersetId) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.internalName,
        powerSet: powersetId,
      });
    }
  };

  const handlePowerLeave = () => {
    // Don't clear — keep showing the last-hovered power until a new one is hovered
  };

  const handleShowInfo = (power: Power, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent power selection when clicking info button
    }
    if (!powersetId) return;

    lockInfoPanel({
      type: 'power',
      powerName: power.internalName,
      powerSet: powersetId,
    });
  };

  const handleLockToggle = (power: Power) => {
    if (!powersetId) return;

    // If already locked to this power, unlock; otherwise lock to this power
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.internalName) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.internalName,
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
    <div className={compact ? '' : 'mb-3'} {...(category === 'primary' ? { 'data-onboarding': 'add-power' } : {})}>
      {/* Section header - compact mode uses a smaller inline header, normal mode has collapse toggle */}
      {compact ? (
        <div className="flex items-center justify-between px-2 h-8 bg-slate-800/80 border-b border-slate-700">
          <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide leading-tight">
            {powerset?.name || categoryLabel}
          </div>
          <span className="text-[9px] text-slate-500">({selectedPowerNames.length})</span>
        </div>
      ) : (
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
      )}

      {/* Collapsible content (compact mode never collapses - parent section handles that) */}
      {(compact || !collapsed) && (
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
                // Level 1 special restrictions:
                // - Only first 2 powers can be selected (index 0 or 1)
                // - Can only pick 1 power total from this category
                // - If first pick was from this category, block until other category picks
                const isLevel1Restricted = isLevel1 && (index > 1 || hasPickedPowerThisCategory || isLevel1BlockedForSecondPick);

                // Grey out powers that aren't available yet OR are blocked by level 1 enforcement
                const isAvailable = power.available < build.level && !isLevel1Restricted;

                // Check if this power is excluded by an already-selected mutually exclusive power
                const isExcluded = power.excludes?.some(ex => selectedSet.has(
                  allPowers.find(p => p.internalName === ex)?.name ?? ''
                )) ?? false;

                // Block selection until both powersets are chosen, or if 24 powers taken,
                // or (in Level Up mode) if the current-level pick quota is full
                // Selected powers are NOT disabled — clicking them will remove them
                const isDisabled = (!isSelected && (isExcluded || !isAvailable || !bothPowersetsSelected || powerLimitReached || levelUpPickQuotaReached));
                const isLocked = isPowerLocked(power.internalName);

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
                    onRemove={() => removePower(category, power.internalName)}
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
