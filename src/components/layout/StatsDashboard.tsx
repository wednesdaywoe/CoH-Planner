/**
 * StatsDashboard component - displays key stats in a horizontal bar
 * Stats shown are configurable via the StatsConfigModal
 * Tooltips show detailed breakdowns of stat sources with Rule of 5 tracking
 */

import { useEffect, useMemo } from 'react';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { useBuildStore, useUIStore } from '@/stores';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { formatBonusValue } from '@/utils/set-bonus-format';
import { getArchetype, getTotalSlotsAtLevel, getPowerPicksAtLevel } from '@/data';
import { countPlacedBudgetSlots } from '@/utils/slot-levels';
import { getDefenseSoftcap } from '@/data/purple-patch';
import { Tooltip } from '@/components/ui';
import { StatsConfigModal, AccoladesModal, AboutModal, ExportImportModal, FeedbackModal, ChangelogModal, EnhancementListModal, WelcomeModal, SetBonusLookupModal, ControlsModal, HelpModal, CompareSlottingModal, DetailedTotalsModal, PowersetCompareModal, ProcSettingsModal, EnhancementToolsModal, AttackChainModal } from '@/components/modals';
import { IncarnateSlotGrid, IncarnateModal, IncarnateCraftingModal } from '@/components/incarnate';
import { HINTS } from '@/components/powers';
import { PinnedPowersBar } from './PinnedPowersBar';
import { INCARNATE_REQUIRED_LEVEL, createEmptyIncarnateBuildState } from '@/types';
import { getEffectiveLevel, areIncarnatesSuppressed } from '@/utils/calculations';
import type { IncarnateSlotId, ToggleableIncarnateSlot } from '@/types';
import type { DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import { STAT_DEFINITIONS, resolveStatValue, STAT_CATEGORY } from '@/data/stat-definitions';
import type { StatDefinition, StatValue, CompoundStatValue, MezStatValue, StatCategory } from '@/data/stat-definitions';
import { applyMovementBuff, getEffectiveMovementCaps, TRAVEL_CAP_BUMPS } from '@/data/core/movement-constants';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';

// Re-export for any consumers that imported from here
export { STAT_DEFINITIONS };

// Dashboard display sections. Stat→section placement is single-sourced via
// STAT_CATEGORY (stat-definitions.ts); this only names the sections and maps
// the canonical categories into them — the dashboard folds Offense + Movement
// into one compact "General" tile.
const DASHBOARD_SECTIONS: { name: string; categories: StatCategory[] }[] = [
  { name: 'General', categories: ['offense', 'movement'] },
  { name: 'Health & Endurance', categories: ['health-endurance'] },
  { name: 'Stealth & Perception', categories: ['stealth-perception'] },
  { name: 'Defense', categories: ['defense'] },
  { name: 'Resistance', categories: ['resistance'] },
  { name: 'Status Protection', categories: ['status-protection'] },
  { name: 'Status Resistance', categories: ['status-resistance'] },
  { name: 'Debuff Resistance', categories: ['debuff-resistance'] },
];
export type { StatDefinition, StatValue, CompoundStatValue, MezStatValue };

interface StatsDashboardProps {
  /** Skip rendering the co-located modals. Use when the dashboard is mounted
   *  alongside another instance that already renders them (e.g. mobile sheet). */
  excludeModals?: boolean;
}

// ============================================
// Collapsed summary row
// ============================================
// Slim single-line view of the five stats that most builds care about.
// Triggered by the `D` hotkey; the full grid is hidden while this is shown.

interface CollapsedDashboardRowProps {
  baseHP: number;
  maxHPCap: number;
  stats: ReturnType<typeof useCalculatedStats>;
  globalBonuses: GlobalBonuses;
  onExpand: () => void;
  incarnates: ReturnType<typeof createEmptyIncarnateBuildState>;
  isLevel50: boolean;
  incarnateActive: ReturnType<typeof useUIStore.getState>['incarnateActive'];
  suppressed: boolean;
  openIncarnateModal: (slotId: IncarnateSlotId) => void;
  toggleIncarnateActive: (slotId: ToggleableIncarnateSlot) => void;
}

function formatPerSec(n: number): string {
  return n.toFixed(2);
}

function CollapsedDashboardRow({
  baseHP,
  maxHPCap,
  stats,
  globalBonuses,
  onExpand,
  incarnates,
  isLevel50,
  incarnateActive,
  suppressed,
  openIncarnateModal,
  toggleIncarnateActive,
}: CollapsedDashboardRowProps) {
  const buffedHP = baseHP * (1 + stats.hpBuff / 100);
  const actualHP = maxHPCap > 0 ? Math.min(buffedHP, maxHPCap) : buffedHP;
  const regenPerSec = (actualHP / 240) * (1 + stats.regenBuff / 100);
  const recoveryPerSec = (stats.maxEndurance / 60) * (1 + stats.recoveryBuff / 100);
  const netEndPerSec = globalBonuses.netEndPerSec ?? 0;
  const levelShift = globalBonuses.levelShift ?? 0;

  const stat = (label: string, value: string, color = 'text-white') => (
    <span className="flex items-baseline gap-1">
      <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${color}`}>{value}</span>
    </span>
  );

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={onExpand}
        className="flex items-center gap-1 text-gray-400 hover:text-gray-200 text-xs transition-colors"
        title="Expand dashboard (D)"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {stat('HP', Math.round(actualHP).toString(), actualHP >= maxHPCap && maxHPCap > 0 ? 'text-amber-400' : 'text-white')}
      {stat('Regen', `${formatPerSec(regenPerSec)}/s`, 'text-emerald-300')}
      {stat('Rec', `${formatPerSec(recoveryPerSec)}/s`, 'text-sky-300')}
      {stat('Net', `${netEndPerSec >= 0 ? '+' : ''}${formatPerSec(netEndPerSec)}/s`, netEndPerSec < 0 ? 'text-red-400' : 'text-emerald-300')}
      {stat('Shift', `${levelShift >= 0 ? '+' : ''}${levelShift}`, levelShift > 0 ? 'text-purple-300' : 'text-gray-400')}
      <div className="hidden md:block ml-auto">
        <IncarnateSlotGrid
          incarnates={incarnates}
          disabled={!isLevel50}
          onSlotClick={openIncarnateModal}
          incarnateActive={incarnateActive}
          onToggleActive={toggleIncarnateActive}
          suppressed={suppressed}
          horizontal
        />
      </div>
    </div>
  );
}

export function StatsDashboard({ excludeModals = false }: StatsDashboardProps = {}) {
  const stats = useCalculatedStats();
  const calcResult = useCharacterCalculation();
  const build = useBuildStore((s) => s.build);
  const statsConfig = useUIStore((s) => s.statsConfig);
  const statsConfigModalOpen = useUIStore((s) => s.statsConfigModalOpen);
  const openStatsConfigModal = useUIStore((s) => s.openStatsConfigModal);
  const closeStatsConfigModal = useUIStore((s) => s.closeStatsConfigModal);
  const accoladesModalOpen = useUIStore((s) => s.accoladesModalOpen);
  const openAccoladesModal = useUIStore((s) => s.openAccoladesModal);
  const closeAccoladesModal = useUIStore((s) => s.closeAccoladesModal);
  const aboutModalOpen = useUIStore((s) => s.aboutModalOpen);
  const closeAboutModal = useUIStore((s) => s.closeAboutModal);
  const setBonusLookupModalOpen = useUIStore((s) => s.setBonusLookupModalOpen);
  const openSetBonusLookupModal = useUIStore((s) => s.openSetBonusLookupModal);
  const openSetBonusPopup = useUIStore((s) => s.openSetBonusPopup);
  const closeSetBonusLookupModal = useUIStore((s) => s.closeSetBonusLookupModal);
  const incarnateModalOpen = useUIStore((s) => s.incarnateModalOpen);
  const openIncarnateModal = useUIStore((s) => s.openIncarnateModal);
  const closeIncarnateModal = useUIStore((s) => s.closeIncarnateModal);
  const incarnateCraftingModalOpen = useUIStore((s) => s.incarnateCraftingModalOpen);
  const openIncarnateCraftingModal = useUIStore((s) => s.openIncarnateCraftingModal);
  const closeIncarnateCraftingModal = useUIStore((s) => s.closeIncarnateCraftingModal);
  const incarnateActive = useUIStore((s) => s.incarnateActive);
  const toggleIncarnateActive = useUIStore((s) => s.toggleIncarnateActive);
  const exportImportModalOpen = useUIStore((s) => s.exportImportModalOpen);
  const closeExportImportModal = useUIStore((s) => s.closeExportImportModal);
  const feedbackModalOpen = useUIStore((s) => s.feedbackModalOpen);
  const closeFeedbackModal = useUIStore((s) => s.closeFeedbackModal);
  const changelogModalOpen = useUIStore((s) => s.changelogModalOpen);
  const closeChangelogModal = useUIStore((s) => s.closeChangelogModal);
  const enhancementListModalOpen = useUIStore((s) => s.enhancementListModalOpen);
  const openEnhancementListModal = useUIStore((s) => s.openEnhancementListModal);
  const closeEnhancementListModal = useUIStore((s) => s.closeEnhancementListModal);
  const controlsModalOpen = useUIStore((s) => s.controlsModalOpen);
  const openControlsModal = useUIStore((s) => s.openControlsModal);
  const closeControlsModal = useUIStore((s) => s.closeControlsModal);
  const helpModalOpen = useUIStore((s) => s.helpModalOpen);
  const closeHelpModal = useUIStore((s) => s.closeHelpModal);
  const helpModalInitialTopic = useUIStore((s) => s.helpModalInitialTopic);
  const detailedTotalsModalOpen = useUIStore((s) => s.detailedTotalsModalOpen);
  const openDetailedTotalsModal = useUIStore((s) => s.openDetailedTotalsModal);
  const closeDetailedTotalsModal = useUIStore((s) => s.closeDetailedTotalsModal);
  const openPowersetCompareModal = useUIStore((s) => s.openPowersetCompareModal);
  const openCompareSlotting = useUIStore((s) => s.openCompareSlotting);
  const procSettingsModalOpen = useUIStore((s) => s.procSettingsModalOpen);
  const closeProcSettingsModal = useUIStore((s) => s.closeProcSettingsModal);
  const enhancementToolsModalOpen = useUIStore((s) => s.enhancementToolsModalOpen);
  const closeEnhancementToolsModal = useUIStore((s) => s.closeEnhancementToolsModal);
  const attackChainModalOpen = useUIStore((s) => s.attackChainModalOpen);
  const openAttackChainModal = useUIStore((s) => s.openAttackChainModal);
  const closeAttackChainModal = useUIStore((s) => s.closeAttackChainModal);
  const trackedStats = useUIStore((s) => s.trackedStats);
  const toggleTrackedStat = useUIStore((s) => s.toggleTrackedStat);
  const ensureTrackedStats = useUIStore((s) => s.ensureTrackedStats);
  const dashboardCollapsed = useUIStore((s) => s.dashboardCollapsed);
  const toggleDashboardCollapsed = useUIStore((s) => s.toggleDashboardCollapsed);
  const setHoverHint = useUIStore((s) => s.setHoverHint);
  const combatMode = useUIStore((s) => s.combatMode);
  const rechargeMidsStyle = useUIStore((s) => s.rechargeMidsStyle);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  // Get incarnate state with fallback for old builds
  const incarnatesRaw = build.incarnates;
  const incarnates = incarnatesRaw || createEmptyIncarnateBuildState();
  const isLevel50 = build.level >= INCARNATE_REQUIRED_LEVEL;
  // Incarnates are suppressed below effective level 45 (Genesis swaps to its
  // exemplar power). Drives the grey/lime slot treatment, in sync with the calc.
  const incarnatesSuppressed = areIncarnatesSuppressed(getEffectiveLevel(build.level, exemplarMode, exemplarLevel));

  const health = getBaselineHealth(build.archetype?.id ?? undefined, build.level);
  const baseHP = health.baseHealth;
  const maxHPCap = health.maxHealth;
  const at = build.archetype?.id ? getArchetype(build.archetype.id) : null;
  // Defense cap follows the practical softcap. The level-diff table only
  // adds enemy ToHit at +6 and above (+0..+5 are all 45%), so increasing
  // `targetLevelOffset` doesn't bump the cap until you hit +6. Incarnate
  // mode adds an empirical +14% ToHit buff (iTrial encounters), pushing
  // even-level softcap from 45% → 59%.
  // Resistance cap is the AT's flat hard cap (75% for most ATs, 90% for
  // tanker/brute/warshade) — enemy level / content mode don't change that.
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const contentMode = useUIStore((s) => s.contentMode);
  const defenseCap = getDefenseSoftcap(targetLevelOffset, contentMode);
  const resistanceCap = (at?.stats.resistanceCap ?? 0.75) * 100;
  const breakdowns = calcResult.breakdown;
  const globalBonuses = calcResult.globalBonuses;

  // Calculate power and slot counts (exclude auto-granted form sub-powers)
  const countNonGranted = (powers: { isAutoGranted?: boolean }[]) =>
    powers.filter(p => !p.isAutoGranted).length;
  const currentPowerCount =
    countNonGranted(build.primary.powers) +
    countNonGranted(build.secondary.powers) +
    build.pools.reduce((sum, pool) => sum + countNonGranted(pool.powers), 0) +
    (build.epicPool ? countNonGranted(build.epicPool.powers) : 0);
  // Slots that consume the level-up budget (the "/67"). Excludes each power's
  // free base slot and any auto-granted freebie slots (Rebirth Health/Stamina).
  const currentSlotCount = countPlacedBudgetSlots(build);

  // Budgets are level-scoped: a level-32 character hasn't yet earned the full
  // 24 picks / 67 slots, so the denominators track what build.level has granted
  // so far (both reach their level-50 max). This makes it possible to allocate
  // the exact count a character of that level would actually have.
  const powerBudget = getPowerPicksAtLevel(build.level);
  const slotBudget = getTotalSlotsAtLevel(build.level);

  // Effective movement caps — travel toggles (Super Speed / Mighty Leap / Fly /
  // Afterburner / etc.) raise the cap of their corresponding stat while active,
  // unless the In-Combat toggle is on (the game suppresses the cap bump on
  // attack; we use combatMode as a conservative proxy since we can't detect
  // which active toggles actually land damage on a foe).
  const effectiveMovementCaps = useMemo(() => {
    if (combatMode) return getEffectiveMovementCaps([]);
    const activeNames: string[] = [];
    const collect = (powers: { fullName?: string; isActive?: boolean }[]) => {
      for (const p of powers) {
        if (p.isActive && p.fullName && TRAVEL_CAP_BUMPS[p.fullName]) activeNames.push(p.fullName);
      }
    };
    for (const pool of build.pools) collect(pool.powers);
    if (build.epicPool) collect(build.epicPool.powers);
    collect(build.inherents);
    return getEffectiveMovementCaps(activeNames);
  }, [build.pools, build.epicPool, build.inherents, combatMode]);

  // Get visible stats based on config
  const visibleStats = useMemo(() => {
    return statsConfig
      .filter((config) => config.visible && STAT_DEFINITIONS[config.stat])
      .sort((a, b) => a.order - b.order)
      .map((config) => {
        const def = STAT_DEFINITIONS[config.stat];
        const value = resolveStatValue(config.stat, def, stats, globalBonuses, baseHP, maxHPCap);
        const breakdown = def.breakdownKey ? breakdowns.get(def.breakdownKey) : undefined;
        // Attach cap for defense/resistance stats
        let cap: number | undefined;
        if (config.stat.startsWith('def') || config.stat.startsWith('defense_')) cap = defenseCap;
        else if (config.stat.startsWith('res_')) cap = resistanceCap;

        // Movement stats display in mph/ft on the face; surface the underlying
        // % buff (and capped state) on hover so the user can see the input.
        // Override format/tooltip so the active travel-toggle cap applies.
        let tooltip = def.tooltip;
        let format = def.format;
        // Recharge has two display modes (settings → General → "Mids-style
        // recharge"). The stat definition encodes the Mids style (100% +
        // bonuses) as the default; opting out swaps in the bonus-only
        // display ("+25%") and drops the totalBaseOffset.
        let totalBaseOffset = def.totalBaseOffset;
        if (config.stat === 'recharge' && !rechargeMidsStyle) {
          format = (v) => {
            const n = Number(v);
            return `${n >= 0 ? '+' : ''}${formatBonusValue(n)}%`;
          };
          tooltip = 'Global recharge from set bonuses';
          totalBaseOffset = undefined;
        }
        if (config.stat === 'runspeed' || config.stat === 'jumpspeed' || config.stat === 'jumpheight') {
          const movementStat = config.stat === 'runspeed' ? 'runSpeed'
            : config.stat === 'jumpspeed' ? 'jumpSpeed'
            : 'jumpHeight';
          const unit = config.stat === 'jumpheight' ? 'ft' : 'mph';
          const pct = Number(value);
          const sign = pct >= 0 ? '+' : '';
          const { value: abs, capped } = applyMovementBuff(movementStat, pct, effectiveMovementCaps);
          tooltip = `${sign}${pct.toFixed(2)}% buff → ${abs.toFixed(2)} ${unit}${capped ? ` (capped at ${effectiveMovementCaps[movementStat].toFixed(2)})` : ''}`;
          format = (v) => {
            const { value: a, capped: c } = applyMovementBuff(movementStat, Number(v), effectiveMovementCaps);
            return `${a.toFixed(2)} ${unit}${c ? ' *' : ''}`;
          };
        } else if (config.stat === 'flyspeed') {
          // Display fly speed in mph for parity with run/jump speeds (user
          // ask 2026-05-30). MOVEMENT_BASES.flySpeed is 0 by design — the
          // game requires an active fly power for the character to fly at
          // all — so the dashboard math assumes a standard Fly / Mystic
          // Flight base of 31.5 mph as the most likely active power. Other
          // fly powers (Group Fly @ 21 mph, etc.) won't match the displayed
          // value perfectly; the tooltip notes the assumption so the user
          // knows what they're looking at.
          const STANDARD_FLY_BASE_MPH = 31.5;
          const cap = effectiveMovementCaps.flySpeed;
          const pct = Number(value);
          const sign = pct >= 0 ? '+' : '';
          const computeMph = (p: number) => {
            const raw = STANDARD_FLY_BASE_MPH * (1 + p / 100);
            const capped = raw >= cap;
            return { value: capped ? cap : raw, capped };
          };
          const { value: mph, capped } = computeMph(pct);
          tooltip = `${sign}${pct.toFixed(2)}% buff → ${mph.toFixed(2)} mph${capped ? ` (capped at ${cap.toFixed(2)})` : ''}. Assumes standard Fly / Mystic Flight base (31.5 mph). Actual base depends on which fly power is active.`;
          format = (v) => {
            const { value: m, capped: c } = computeMph(Number(v));
            return `${m.toFixed(2)} mph${c ? ' *' : ''}`;
          };
        }

        return { ...def, value, breakdown, breakdownUnit: def.breakdownUnit, totalBaseOffset, hpCap: config.stat === 'health' ? maxHPCap : undefined, cap, tooltip, format };
      });
    // Every user-enabled stat is shown, including zeros. Stats are opt-in via
    // Settings → Stats, so toggling one on should reliably display it — this
    // matches how the bulk of stats (defense/resistance/mez, all flagged
    // showWhenZero) already behave. Previously a subset of "situational" stats
    // (Range, End Reduction, debuff resistances, stealth, …) lacked that flag
    // and silently stayed hidden at zero even after the user enabled them, so
    // they could never be displayed. (StatDefinition.showWhenZero is no longer
    // consulted here; it's retained as metadata for a possible future
    // "hide zero stats" toggle.)
  }, [statsConfig, stats, baseHP, maxHPCap, breakdowns, globalBonuses, effectiveMovementCaps, rechargeMidsStyle]);

  // Group visible stats into the dashboard's display sections. Section→stat
  // placement is single-sourced via STAT_CATEGORY (see stat-definitions.ts);
  // here we only declare the dashboard's section names + which canonical
  // categories each contains (the dashboard folds Offense + Movement into
  // "General"). Within-section order stays driven by each stat's `order` (so
  // the user's reordering is honored), which is why this groups visibleStats
  // directly rather than via the canonical-order helper.
  const groupedStats = DASHBOARD_SECTIONS.map((section) => ({
    name: section.name,
    stats: visibleStats.filter((s) => section.categories.includes(STAT_CATEGORY[s.id])),
  })).filter((section) => section.stats.length > 0);

  // Auto-track stats that have Rule of 5 violations so the user sees them immediately
  useEffect(() => {
    const cappedKeys = visibleStats
      .filter(s => s.breakdownKey && s.breakdown?.sources.some(src => src.capped))
      .map(s => s.breakdownKey!);
    if (cappedKeys.length > 0) {
      ensureTrackedStats(cappedKeys);
    }
  }, [visibleStats, ensureTrackedStats]);

  return (
    <>
      <div
        className="bg-gray-900/50 border-b border-gray-800 px-2 sm:px-4 py-2 overflow-hidden"
        onMouseEnter={() => setHoverHint(HINTS.dashboard)}
        onMouseLeave={() => setHoverHint(null)}
      >
        {dashboardCollapsed && (
          <CollapsedDashboardRow
            baseHP={baseHP}
            maxHPCap={maxHPCap}
            stats={stats}
            globalBonuses={globalBonuses}
            onExpand={toggleDashboardCollapsed}
            incarnates={incarnates}
            isLevel50={isLevel50}
            incarnateActive={incarnateActive}
            suppressed={incarnatesSuppressed}
            openIncarnateModal={openIncarnateModal}
            toggleIncarnateActive={toggleIncarnateActive}
          />
        )}
        {/* Grouped stats + Incarnate panel in a single flex row */}
        <div className={`flex items-stretch gap-2 ${dashboardCollapsed ? 'hidden' : ''}`}>
          {/* Stats grid - fills remaining space */}
          <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 items-stretch min-w-0">
            {groupedStats.map((group, groupIndex) => (
              <div
                key={group.name}
                className="@container bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 overflow-hidden min-w-0"
                {...(groupIndex === 0 ? { 'data-onboarding': 'stat-hover' } : {})}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate">{group.name}</span>
                  <button
                    onClick={() => openStatsConfigModal(group.stats[0]?.id)}
                    className="shrink-0 text-gray-600 hover:text-gray-300 transition-colors"
                    title="Configure which stats appear on the dashboard"
                    aria-label="Configure dashboard stats"
                    {...(groupIndex === 0 ? { 'data-onboarding': 'dashboard-config' } : {})}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 @[220px]:grid-cols-2 gap-x-4 gap-y-1">
                  {group.stats.map((stat) => (
                    <StatItem
                      key={stat.id}
                      label={stat.label}
                      value={stat.format(stat.value)}
                      color={stat.color}
                      tooltip={stat.tooltip}
                      breakdown={stat.breakdown}
                      breakdownUnit={stat.breakdownUnit}
                      totalBaseOffset={stat.totalBaseOffset}
                      rawValue={stat.value}
                      tracked={stat.breakdownKey ? trackedStats.includes(stat.breakdownKey) : false}
                      onTrack={stat.breakdownKey ? () => toggleTrackedStat(stat.breakdownKey!) : undefined}
                      hpCap={stat.hpCap}
                      cap={stat.cap}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Incarnate Powers panel - always in the same row, never wraps */}
          <div className="hidden md:flex flex-col shrink-0 bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700" data-onboarding="incarnate-slot">
            <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide flex items-center justify-between gap-4">
              <span>Incarnate</span>
              {isLevel50 ? (
                <button
                  onClick={openIncarnateCraftingModal}
                  className="text-[10px] text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 bg-blue-900/30 hover:bg-blue-900/50 transition-colors px-1.5 py-0.5 rounded font-normal normal-case"
                  title="Incarnate Crafting Checklist"
                >
                  Crafting
                </button>
              ) : (
                <span className="text-[9px] text-gray-500 font-normal normal-case">Lv50</span>
              )}
            </div>
            <IncarnateSlotGrid
              incarnates={incarnates}
              disabled={!isLevel50}
              onSlotClick={openIncarnateModal}
              incarnateActive={incarnateActive}
              onToggleActive={toggleIncarnateActive}
              suppressed={incarnatesSuppressed}
              horizontal
            />
          </div>
        </div>

        {/* Pinned perma-tracked powers (hidden when dashboard is collapsed) */}
        {!dashboardCollapsed && <PinnedPowersBar />}

        {/* Dashboard action bar.
         * Desktop (≥lg): single horizontal row, icon + inline label.
         * Mobile (<lg): counters on top, then a 3-col grid of icon + stacked
         * label tiles — uses the empty vertical space in the mobile sheet and
         * makes each button a proper touch target with a visible name.
         * Button class strings are split into shared/variant pieces so the
         * two layouts stay in sync.
         */}
        <div className="pt-1 mt-1 border-t border-gray-800">
          {/* Counters row (Lvl / Pwr / Slot) */}
          <div className="flex items-center gap-1 lg:gap-0.5 overflow-x-auto">
            <Tooltip content={`Character level ${build.level}`}>
              <span className="text-xs tabular-nums font-medium px-1 text-sky-400">
                Lvl {build.level}
              </span>
            </Tooltip>
            <Tooltip content={`${Math.max(0, powerBudget - currentPowerCount)} power picks remaining (${currentPowerCount} used of ${powerBudget} at level ${build.level})`}>
              <span className={`text-xs tabular-nums font-medium px-1 ${
                currentPowerCount > powerBudget ? 'text-red-400' : powerBudget - currentPowerCount <= 3 ? 'text-yellow-400' : 'text-emerald-400'
              }`}>
                Pwr {Math.max(0, powerBudget - currentPowerCount)}/{powerBudget}
              </span>
            </Tooltip>
            <Tooltip content={`${Math.max(0, slotBudget - currentSlotCount)} enhancement slots remaining (${currentSlotCount} used of ${slotBudget} at level ${build.level})`}>
              <span className={`text-xs tabular-nums font-medium px-1 ${
                currentSlotCount > slotBudget ? 'text-red-400' : slotBudget - currentSlotCount <= 5 ? 'text-yellow-400' : 'text-emerald-400'
              }`}>
                Slot {Math.max(0, slotBudget - currentSlotCount)}/{slotBudget}
              </span>
            </Tooltip>
            <div className="hidden lg:block w-px h-4 bg-gray-700 mx-0.5 shrink-0" />
            {/* Desktop-only: action buttons inline after the separator. */}
            <DashboardActionButtons
              openAccoladesModal={openAccoladesModal}
              openSetBonusLookupModal={openSetBonusLookupModal}
              openSetBonusPopup={openSetBonusPopup}
              openDetailedTotalsModal={openDetailedTotalsModal}
              openPowersetCompareModal={openPowersetCompareModal}
              openCompareSlotting={openCompareSlotting}
              openEnhancementListModal={openEnhancementListModal}
              openStatsConfigModal={openStatsConfigModal}
              openControlsModal={openControlsModal}
              openAttackChainModal={openAttackChainModal}
              variant="desktop"
            />
          </div>
          {/* Mobile grid of action tiles */}
          <div className="lg:hidden grid grid-cols-3 gap-1 mt-2">
            <DashboardActionButtons
              openAccoladesModal={openAccoladesModal}
              openSetBonusLookupModal={openSetBonusLookupModal}
              openSetBonusPopup={openSetBonusPopup}
              openDetailedTotalsModal={openDetailedTotalsModal}
              openPowersetCompareModal={openPowersetCompareModal}
              openCompareSlotting={openCompareSlotting}
              openEnhancementListModal={openEnhancementListModal}
              openStatsConfigModal={openStatsConfigModal}
              openControlsModal={openControlsModal}
              openAttackChainModal={openAttackChainModal}
              variant="mobile"
            />
          </div>
        </div>

        {/* Mobile Incarnate grid - visible below md when the full panel is hidden */}
        <div className="flex md:hidden items-center gap-2 pt-1 mt-1 border-t border-gray-800">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide shrink-0">Incarnate</div>
          <IncarnateSlotGrid
            incarnates={incarnates}
            disabled={!isLevel50}
            onSlotClick={openIncarnateModal}
            incarnateActive={incarnateActive}
            onToggleActive={toggleIncarnateActive}
            suppressed={incarnatesSuppressed}
            horizontal
          />
          {isLevel50 && (
            <button
              onClick={openIncarnateCraftingModal}
              className="text-[10px] text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 bg-blue-900/30 hover:bg-blue-900/50 transition-colors px-1.5 py-0.5 rounded shrink-0"
              title="Incarnate Crafting Checklist"
            >
              Crafting
            </button>
          )}
        </div>
      </div>

      {!excludeModals && <>
      {/* Stats Config Modal */}
      <StatsConfigModal
        isOpen={statsConfigModalOpen}
        onClose={closeStatsConfigModal}
      />

      {/* Accolades Modal */}
      <AccoladesModal
        isOpen={accoladesModalOpen}
        onClose={closeAccoladesModal}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={closeAboutModal}
      />

      {/* Set Bonus Lookup Modal */}
      <SetBonusLookupModal
        isOpen={setBonusLookupModalOpen}
        onClose={closeSetBonusLookupModal}
      />

      {/* Incarnate Modal */}
      <IncarnateModal
        isOpen={incarnateModalOpen}
        onClose={closeIncarnateModal}
      />

      {/* Incarnate Crafting Modal */}
      <IncarnateCraftingModal
        isOpen={incarnateCraftingModalOpen}
        onClose={closeIncarnateCraftingModal}
      />

      {/* Export/Import Modal */}
      <ExportImportModal
        isOpen={exportImportModalOpen}
        onClose={closeExportImportModal}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={closeFeedbackModal}
      />

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={changelogModalOpen}
        onClose={closeChangelogModal}
      />

      {/* Enhancement List (Shopping List) Modal */}
      <EnhancementListModal
        isOpen={enhancementListModalOpen}
        onClose={closeEnhancementListModal}
      />

      {/* Controls Modal */}
      <ControlsModal
        isOpen={controlsModalOpen}
        onClose={closeControlsModal}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={closeHelpModal}
        initialTopicId={helpModalInitialTopic}
      />

      {/* Detailed Totals Modal */}
      <DetailedTotalsModal
        isOpen={detailedTotalsModalOpen}
        onClose={closeDetailedTotalsModal}
      />

      {/* Welcome Modal — opened from the update banner's "learn more" link */}
      <WelcomeModal />

      {/* Compare Slotting Modal */}
      <CompareSlottingModal />

      {/* Powerset Compare Modal */}
      <PowersetCompareModal />

      {/* Proc Settings Modal */}
      <ProcSettingsModal
        isOpen={procSettingsModalOpen}
        onClose={closeProcSettingsModal}
      />

      {/* Enhancement Tools Modal */}
      <EnhancementToolsModal
        isOpen={enhancementToolsModalOpen}
        onClose={closeEnhancementToolsModal}
      />

      {/* Attack Chain Builder Modal */}
      <AttackChainModal
        isOpen={attackChainModalOpen}
        onClose={closeAttackChainModal}
      />
      </>}
    </>
  );
}

// Action buttons for the Dashboard's bottom quickbar. Rendered twice:
// once inline on desktop and once as a 3-column grid on mobile. Kept as a
// single component so the set of actions can't drift between layouts.
interface DashboardActionButtonsProps {
  openAccoladesModal: () => void;
  openSetBonusLookupModal: () => void;
  openSetBonusPopup: () => void;
  openDetailedTotalsModal: () => void;
  openPowersetCompareModal: () => void;
  openCompareSlotting: () => void;
  openEnhancementListModal: () => void;
  openStatsConfigModal: () => void;
  openControlsModal: () => void;
  openAttackChainModal: () => void;
  variant: 'desktop' | 'mobile';
}

// Tailwind classes must be literal strings so the JIT can detect them. A
// mapping keeps per-action hover accents while still letting us share one
// button factory. (Dynamic `hover:${color}` strings don't work — the scanner
// never sees them and the CSS rule never gets generated.)
const DESKTOP_BTN_BY_ACCENT: Record<string, string> = {
  amber:  'flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-amber-300  hover:bg-gray-800 rounded transition-colors shrink-0 hidden lg:flex',
  green:  'flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-green-300  hover:bg-gray-800 rounded transition-colors shrink-0 hidden lg:flex',
  blue:   'flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-blue-300   hover:bg-gray-800 rounded transition-colors shrink-0 hidden lg:flex',
  cyan:   'flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-cyan-300   hover:bg-gray-800 rounded transition-colors shrink-0 hidden lg:flex',
  purple: 'flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-purple-300 hover:bg-gray-800 rounded transition-colors shrink-0 hidden lg:flex',
  gray:   'flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-gray-200   hover:bg-gray-800 rounded transition-colors shrink-0 hidden lg:flex',
};
const MOBILE_BTN_BY_ACCENT: Record<string, string> = {
  amber:  'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-gray-300 hover:text-amber-300  active:text-amber-300  bg-gray-800/40 hover:bg-gray-800 rounded transition-colors',
  green:  'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-gray-300 hover:text-green-300  active:text-green-300  bg-gray-800/40 hover:bg-gray-800 rounded transition-colors',
  blue:   'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-gray-300 hover:text-blue-300   active:text-blue-300   bg-gray-800/40 hover:bg-gray-800 rounded transition-colors',
  cyan:   'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-gray-300 hover:text-cyan-300   active:text-cyan-300   bg-gray-800/40 hover:bg-gray-800 rounded transition-colors',
  purple: 'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-gray-300 hover:text-purple-300 active:text-purple-300 bg-gray-800/40 hover:bg-gray-800 rounded transition-colors',
  gray:   'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-gray-300 hover:text-gray-200   active:text-gray-200   bg-gray-800/40 hover:bg-gray-800 rounded transition-colors',
};

type Accent = keyof typeof DESKTOP_BTN_BY_ACCENT;

function DashboardActionButtons(props: DashboardActionButtonsProps) {
  const isMobile = props.variant === 'mobile';

  const btn = (
    accent: Accent,
    onClick: () => void,
    title: string,
    iconPath: JSX.Element,
    label: string,
    onboarding?: string,
  ) => {
    const classes = isMobile ? MOBILE_BTN_BY_ACCENT[accent] : DESKTOP_BTN_BY_ACCENT[accent];
    const iconClass = isMobile ? 'w-5 h-5' : 'w-3.5 h-3.5';
    return (
      <button
        onClick={onClick}
        className={classes}
        title={title}
        {...(onboarding ? { 'data-onboarding': onboarding } : {})}
      >
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {iconPath}
        </svg>
        <span className={isMobile ? 'text-center leading-tight' : 'hidden lg:inline'}>{label}</span>
      </button>
    );
  };

  return (
    <>
      {btn(
        'amber',
        props.openAccoladesModal,
        'Toggle accolade bonuses',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 18.75h-9a3 3 0 00-3 3h15a3 3 0 00-3-3zm0 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871m-5.007 0H8.625C8.004 14.25 7.5 14.754 7.5 15.375v3.375m9-4.5a7.5 7.5 0 00.982-3.172M7.5 14.25a7.5 7.5 0 01-.981-3.172m10.962 0a6 6 0 005.395-4.972c-.95-.187-1.913-.357-2.886-.51m-2.51 5.482a23.65 23.65 0 01-9 0m-2.51-5.482c-.973.153-1.937.323-2.886.51A6 6 0 006.52 11.078M18.75 4.97A48.42 48.42 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0V4.5c0-.621-.504-1.125-1.125-1.125H6.875c-.621 0-1.125.504-1.125 1.125v.47" />,
        'Accolades',
        'accolades',
      )}
      {btn(
        'green',
        props.openSetBonusLookupModal,
        'Look up set bonuses by stat',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
        isMobile ? 'Set Bonuses' : 'Set Bonus Finder',
        'set-bonus-finder',
      )}
      {btn(
        'green',
        props.openSetBonusPopup,
        'Active set-bonus totals (hover a row for set + power sources)',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h13M3 12h9M3 18h5" />,
        'Set Totals',
        'set-bonus-totals',
      )}
      {btn(
        'blue',
        props.openDetailedTotalsModal,
        'View detailed character totals',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        'Totals',
        'detailed-totals',
      )}
      {btn(
        'cyan',
        props.openPowersetCompareModal,
        'Compare powersets side-by-side',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        'Compare Sets',
      )}
      {btn(
        'purple',
        props.openAttackChainModal,
        'Build and analyze an attack chain (DPS, dead time, endurance)',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
        isMobile ? 'Chain' : 'Attack Chain',
        'attack-chain',
      )}
      {btn(
        'purple',
        props.openCompareSlotting,
        'Compare enhancement slotting configurations',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
        isMobile ? 'Compare Slots' : 'Compare Slotting',
        'compare-slotting',
      )}
      {btn(
        'purple',
        props.openEnhancementListModal,
        'View enhancement shopping list',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
        isMobile ? 'Enh List' : 'Enhancement List',
        'enhancement-list',
      )}
      {btn(
        'gray',
        props.openStatsConfigModal,
        'Configure dashboard stats',
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>,
        'Configure',
        'stats-config',
      )}
      {btn(
        'cyan',
        props.openControlsModal,
        'View control hints',
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'Controls',
        'controls',
      )}
    </>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  color?: string;
  tooltip?: string;
  breakdown?: DashboardStatBreakdown;
  breakdownUnit?: string;
  /** Constant added to the displayed total (and only the total) — used by
   *  Recharge to follow Mids' speed-multiplier "Haste" convention where
   *  100% base is added to the sum of bonuses. */
  totalBaseOffset?: number;
  rawValue?: StatValue;
  className?: string;
  tracked?: boolean;
  onTrack?: () => void;
  /** HP cap for this archetype (only for HP stat) */
  hpCap?: number;
  /** Stat cap as percentage (e.g. 75 for resistance, 45 for defense) */
  cap?: number;
}

function StatItem({ label, value, color = 'text-gray-300', tooltip, breakdown, breakdownUnit = '%', totalBaseOffset = 0, rawValue, className = '', tracked, onTrack, hpCap, cap }: StatItemProps) {
  const hasCapped = breakdown?.sources.some(s => s.capped) ?? false;
  const numericValue = typeof rawValue === 'number' ? rawValue : undefined;
  const isAtCap = cap !== undefined && numericValue !== undefined && numericValue >= cap;
  const overCap = isAtCap ? numericValue - cap : 0;
  // When a stat hits its AT cap (Defense / Resistance / etc.), keep its
  // native color (defense purple, resistance orange) and signal "capped"
  // by underlining the value rather than recoloring to orange. The
  // overflow amount moves into the tooltip so the headline stays compact.
  const displayColor = color;

  // Split a trailing parenthetical (e.g. "10.49/s (+90%)") into main and
  // secondary parts. The secondary renders smaller and dimmer so it stays
  // out of the way and truncates first if the column is tight. Full value
  // is preserved in the tooltip.
  const renderedValue = isAtCap ? `${cap.toFixed(2)}%` : value;
  const parenMatch = typeof renderedValue === 'string'
    ? renderedValue.match(/^(.*?)\s+\(([^)]+)\)$/)
    : null;
  const mainText = parenMatch ? parenMatch[1] : renderedValue;
  const secondaryText = parenMatch ? parenMatch[2] : null;

  const content = (
    <div
      className={`flex items-baseline justify-between gap-1 min-w-0 overflow-hidden ${onTrack ? 'cursor-pointer' : 'cursor-help'} ${
        (tracked || hasCapped) ? `ring-1 ${hasCapped ? 'ring-orange-400/70' : 'ring-blue-500/60'} rounded px-1 -mx-1` : ''
      } ${className}`}
      onClick={onTrack}
    >
      <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
      <span className={`text-sm font-medium tabular-nums text-right truncate ${displayColor} ${isAtCap ? 'underline decoration-current decoration-dotted underline-offset-2' : ''}`}>
        {mainText}
        {secondaryText && (
          <span className="text-[10px] text-gray-500 ml-1">{secondaryText}</span>
        )}
      </span>
    </div>
  );

  // Build detailed tooltip content with breakdown
  const tooltipContent = useMemo(() => {
    if (!breakdown || breakdown.sources.length === 0) {
      return tooltip || label;
    }

    // Compute base regen rate for HP/sec display on regen sources
    const isRegen = rawValue && typeof rawValue === 'object' && 'perSec' in rawValue && 'buff' in rawValue;
    const regenBaseRate = isRegen
      ? (rawValue as CompoundStatValue).perSec / (1 + (rawValue as CompoundStatValue).buff / 100)
      : 0;

    // Format HP/sec suffix for a source's percentage value
    const hpsSuffix = (pct: number) =>
      isRegen ? ` (${(regenBaseRate * pct / 100).toFixed(2)}/s)` : '';

    // Group sources by type for display
    const setBonusSources = breakdown.sources.filter(s => s.type === 'set-bonus');
    const activePowerSources = breakdown.sources.filter(s => s.type === 'active-power');
    const inherentSources = breakdown.sources.filter(s => s.type === 'inherent');
    const accoladeSources = breakdown.sources.filter(s => s.type === 'accolade');
    const procSources = breakdown.sources.filter(s => s.type === 'proc');
    const incarnateSources = breakdown.sources.filter(s => s.type === 'incarnate');

    return (
      <div className="space-y-2 max-w-[300px]">
        <div className="font-semibold text-slate-200">{label}</div>
        {tooltip && <div className="text-slate-400 text-[10px]">{tooltip}</div>}
        {isAtCap && numericValue !== undefined && (
          <div className="text-orange-400 text-[10px]">
            Capped at {cap}% — actual total {numericValue.toFixed(2)}% (over by {overCap.toFixed(2)}%)
          </div>
        )}

        {/* Set Bonuses */}
        {setBonusSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Set Bonuses</div>
            {setBonusSources.map((source, i) => (
              <div key={i} className={`flex justify-between text-[10px] ${source.capped ? 'opacity-70' : ''}`}>
                <span className={`${source.capped ? 'text-orange-400 line-through' : 'text-slate-300'} truncate max-w-[200px]`}>
                  {source.name}
                </span>
                <span className={`ml-2 whitespace-nowrap ${source.capped ? 'text-orange-400 line-through' : 'text-green-400'}`}>
                  +{formatBonusValue(source.value)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Active Powers */}
        {activePowerSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Active Powers</div>
            {activePowerSources.map((source, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-slate-300">{source.name}</span>
                <span className="text-amber-400 ml-2 whitespace-nowrap">+{formatBonusValue(source.value)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
              </div>
            ))}
          </div>
        )}

        {/* Inherent Powers */}
        {inherentSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Inherent Powers</div>
            {inherentSources.map((source, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-slate-300">{source.name}</span>
                <span className="text-blue-400 ml-2 whitespace-nowrap">+{formatBonusValue(source.value)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
              </div>
            ))}
          </div>
        )}

        {/* Accolades */}
        {accoladeSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Accolades</div>
            {accoladeSources.map((source, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-slate-300">{source.name}</span>
                <span className="text-amber-300 ml-2 whitespace-nowrap">+{formatBonusValue(source.value)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
              </div>
            ))}
          </div>
        )}

        {/* Procs */}
        {procSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Procs</div>
            {procSources.map((source, i) => (
              <div key={i} className={`flex justify-between text-[10px] ${source.capped ? 'opacity-70' : ''}`}>
                <span className={`${source.capped ? 'text-orange-400 line-through' : 'text-slate-300'} truncate max-w-[200px]`}>{source.name}</span>
                <span className={`ml-2 whitespace-nowrap ${source.capped ? 'text-orange-400 line-through' : 'text-cyan-400'}`}>+{formatBonusValue(source.value)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
              </div>
            ))}
          </div>
        )}

        {/* Incarnates */}
        {incarnateSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Incarnate Powers</div>
            {incarnateSources.map((source, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-slate-300 truncate max-w-[200px]">{source.name}</span>
                <span className="text-purple-400 ml-2 whitespace-nowrap">+{formatBonusValue(source.value)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total — adds the optional base offset for stats that use the
            Mids speed-multiplier convention (e.g. Recharge: 100% base +
            global bonuses). Sources above still render as their raw
            bonus contribution; only the displayed total shifts. */}
        <div className="border-t border-slate-600 pt-1 flex justify-between text-[11px] font-medium">
          <span className="text-slate-300">{totalBaseOffset ? `Total (100% base + bonuses)` : 'Total'}</span>
          <span className={color}>
            {totalBaseOffset
              ? `${formatBonusValue(totalBaseOffset + breakdown.total)}${breakdownUnit}`
              : <>+{formatBonusValue(breakdown.total)}{breakdownUnit}</>}
            {isRegen && <span className="text-slate-400"> ({(rawValue as CompoundStatValue).perSec.toFixed(2)}/s)</span>}
          </span>
        </div>

        {/* HP Cap */}
        {hpCap !== undefined && hpCap > 0 && (
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>AT Cap</span>
            <span className="text-slate-400">{Math.floor(hpCap)} HP</span>
          </div>
        )}
      </div>
    );
  }, [breakdown, tooltip, label, color, breakdownUnit, totalBaseOffset, rawValue]);

  return <Tooltip content={tooltipContent}>{content}</Tooltip>;
}
