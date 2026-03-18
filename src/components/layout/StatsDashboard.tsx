/**
 * StatsDashboard component - displays key stats in a horizontal bar
 * Stats shown are configurable via the StatsConfigModal
 * Tooltips show detailed breakdowns of stat sources with Rule of 5 tracking
 */

import { useEffect, useMemo } from 'react';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { useBuildStore, useUIStore } from '@/stores';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { Tooltip } from '@/components/ui';
import { StatsConfigModal, AccoladesModal, AboutModal, ExportImportModal, FeedbackModal, KnownIssuesModal, ChangelogModal, WelcomeModal, useWelcomeModal, SetBonusLookupModal, ControlsModal, HelpModal, CompareSlottingModal, DetailedTotalsModal, PowersetCompareModal, ProcSettingsModal } from '@/components/modals';
import { IncarnateSlotGrid, IncarnateModal, IncarnateCraftingModal } from '@/components/incarnate';
import { INCARNATE_REQUIRED_LEVEL, createEmptyIncarnateBuildState } from '@/types';
import type { DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import { STAT_DEFINITIONS } from '@/data/stat-definitions';
import type { StatDefinition, StatValue, CompoundStatValue, MezStatValue } from '@/data/stat-definitions';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';

// Stats that need globalBonuses values instead of CalculatedStats
const GLOBAL_BONUS_OVERRIDES: Record<string, keyof GlobalBonuses> = {
  range_bonus: 'range',
  heal_other: 'healOther',
  threat_level: 'threatLevel',
  stealth_pve: 'stealthRadiusPvE',
  stealth_pvp: 'stealthRadiusPvP',
  perception_bonus: 'perceptionRadius',
  prot_repel: 'protRepel',
  prot_teleport: 'protTeleport',
  mezres_taunt: 'mezResistTaunt',
  mezres_placate: 'mezResistPlacate',
  level_shift: 'levelShift',
  endcost: 'toggleEndCost',
  netend: 'netEndPerSec',
};

// Re-export for any consumers that imported from here
export { STAT_DEFINITIONS };
export type { StatDefinition, StatValue, CompoundStatValue, MezStatValue };

export function StatsDashboard() {
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
  const knownIssuesModalOpen = useUIStore((s) => s.knownIssuesModalOpen);
  const closeKnownIssuesModal = useUIStore((s) => s.closeKnownIssuesModal);
  const changelogModalOpen = useUIStore((s) => s.changelogModalOpen);
  const closeChangelogModal = useUIStore((s) => s.closeChangelogModal);
  const controlsModalOpen = useUIStore((s) => s.controlsModalOpen);
  const openControlsModal = useUIStore((s) => s.openControlsModal);
  const closeControlsModal = useUIStore((s) => s.closeControlsModal);
  const helpModalOpen = useUIStore((s) => s.helpModalOpen);
  const closeHelpModal = useUIStore((s) => s.closeHelpModal);
  const detailedTotalsModalOpen = useUIStore((s) => s.detailedTotalsModalOpen);
  const openDetailedTotalsModal = useUIStore((s) => s.openDetailedTotalsModal);
  const closeDetailedTotalsModal = useUIStore((s) => s.closeDetailedTotalsModal);
  const openPowersetCompareModal = useUIStore((s) => s.openPowersetCompareModal);
  const openCompareSlotting = useUIStore((s) => s.openCompareSlotting);
  const procSettingsModalOpen = useUIStore((s) => s.procSettingsModalOpen);
  const closeProcSettingsModal = useUIStore((s) => s.closeProcSettingsModal);
  const trackedStats = useUIStore((s) => s.trackedStats);
  const toggleTrackedStat = useUIStore((s) => s.toggleTrackedStat);
  const ensureTrackedStats = useUIStore((s) => s.ensureTrackedStats);
  // Welcome modal (auto-shows on first visit)
  const [welcomeModalOpen, closeWelcomeModal] = useWelcomeModal();

  // Get incarnate state with fallback for old builds
  const incarnatesRaw = build.incarnates;
  const incarnates = incarnatesRaw || createEmptyIncarnateBuildState();
  const isLevel50 = build.level >= INCARNATE_REQUIRED_LEVEL;

  const health = getBaselineHealth(build.archetype?.id ?? undefined, build.level);
  const baseHP = health.baseHealth;
  const maxHPCap = health.maxHealth;
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
  // Count placed (additional) slots only — excludes the free first slot each power gets.
  // The 67 budget is for manually placed slots; free first slots are separate.
  // Includes inherent power slots (they count against the budget in-game).
  const countExtra = (powers: { slots: unknown[] }[]) =>
    powers.reduce((sum, p) => sum + Math.max(0, p.slots.length - 1), 0);
  const currentSlotCount =
    countExtra(build.primary.powers) +
    countExtra(build.secondary.powers) +
    build.pools.reduce((sum, pool) => sum + countExtra(pool.powers), 0) +
    (build.epicPool ? countExtra(build.epicPool.powers) : 0) +
    countExtra(build.inherents);

  // Get visible stats based on config
  const visibleStats = useMemo(() => {
    return statsConfig
      .filter((config) => config.visible && STAT_DEFINITIONS[config.stat])
      .sort((a, b) => a.order - b.order)
      .map((config) => {
        const def = STAT_DEFINITIONS[config.stat];
        const globalKey = GLOBAL_BONUS_OVERRIDES[config.stat];
        const value = globalKey
          ? globalBonuses[globalKey]
          : def.getValue(stats, baseHP, maxHPCap);
        const breakdown = def.breakdownKey ? breakdowns.get(def.breakdownKey) : undefined;
        return { ...def, value, breakdown, breakdownUnit: def.breakdownUnit };
      })
      .filter((stat) => {
        if (stat.showWhenZero) return true;
        const v = stat.value;
        // MezStatValue: show if either protection or resistance is non-zero
        if (typeof v === 'object' && v !== null && 'protection' in v) {
          return v.protection !== 0 || v.resistance !== 0;
        }
        // PairedStatValue: show if either value is non-zero
        if (typeof v === 'object' && v !== null && 'first' in v) {
          return v.first !== 0 || v.second !== 0;
        }
        return Number(v) !== 0;
      });
  }, [statsConfig, stats, baseHP, maxHPCap, breakdowns, globalBonuses]);

  // Stat categories for grouping (should match config modal)
  const STAT_CATEGORIES = [
    {
      name: 'Offense',
      stats: [
        'damage', 'accuracy', 'tohit', 'recharge', 'endreduction',
        'range_bonus', 'heal_other', 'threat_level',
      ],
    },
    {
      name: 'Health & Endurance',
      stats: ['health', 'regeneration', 'maxend', 'recovery', 'endcost', 'netend', 'level_shift'],
    },
    {
      name: 'Movement',
      stats: ['runspeed', 'flyspeed', 'jumpspeed', 'jumpheight'],
    },
    {
      name: 'Stealth & Perception',
      stats: ['stealth_pve', 'stealth_pvp', 'perception_bonus'],
    },
    {
      name: 'Defense',
      stats: [
        'defense_melee', 'defense_ranged', 'defense_aoe',
        'def_smashing', 'def_lethal', 'def_fire', 'def_cold',
        'def_energy', 'def_negative', 'def_psionic', 'def_toxic',
      ],
    },
    {
      name: 'Resistance',
      stats: [
        'res_smashing', 'res_lethal', 'res_fire', 'res_cold',
        'res_energy', 'res_negative', 'res_psionic', 'res_toxic',
      ],
    },
    {
      name: 'Status Protection',
      stats: [
        'mez_hold', 'mez_stun', 'mez_immob', 'mez_sleep',
        'mez_confuse', 'mez_fear', 'mez_kb',
        'prot_repel', 'prot_teleport',
      ],
    },
    {
      name: 'Status Resistance',
      stats: ['mezres_taunt', 'mezres_placate'],
    },
    {
      name: 'Debuff Resistance',
      stats: [
        'debuff_slow', 'debuff_defense', 'debuff_recharge',
        'debuff_endurance', 'debuff_recovery', 'debuff_tohit',
        'debuff_regen', 'debuff_perception',
      ],
    },
  ];

  // Group visible stats by category
  const groupedStats = STAT_CATEGORIES.map((cat) => ({
    name: cat.name,
    stats: visibleStats.filter((s) => cat.stats.includes(s.id)),
  })).filter((cat) => cat.stats.length > 0);

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
      <div className="bg-gray-900/50 border-b border-gray-800 px-2 sm:px-4 py-2 overflow-hidden">
        {/* Grouped stats + Incarnate panel in a single flex row */}
        <div className="flex items-stretch gap-2">
          {/* Stats grid - fills remaining space */}
          <div className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 items-stretch min-w-0">
            {groupedStats.map((group) => (
              <div
                key={group.name}
                className="@container bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 overflow-hidden min-w-0"
              >
                <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide truncate">{group.name}</div>
                <div className="grid grid-cols-1 @[280px]:grid-cols-2 gap-x-4 gap-y-1">
                  {group.stats.map((stat) => (
                    <StatItem
                      key={stat.id}
                      label={stat.label}
                      value={stat.format(stat.value)}
                      color={stat.color}
                      tooltip={stat.tooltip}
                      breakdown={stat.breakdown}
                      breakdownUnit={stat.breakdownUnit}
                      rawValue={stat.value}
                      tracked={stat.breakdownKey ? trackedStats.includes(stat.breakdownKey) : false}
                      onTrack={stat.breakdownKey ? () => toggleTrackedStat(stat.breakdownKey!) : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Incarnate Powers panel - always in the same row, never wraps */}
          <div className="hidden md:flex flex-col shrink-0 bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700">
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
            />
          </div>
        </div>

        {/* Dashboard action bar */}
        <div className="flex items-center gap-0.5 pt-1 mt-1 border-t border-gray-800 overflow-x-auto">
          {/* Resources: Powers and Slots remaining */}
          <Tooltip content={`${24 - currentPowerCount} power picks remaining (${currentPowerCount} used)`}>
            <span className={`text-xs tabular-nums font-medium px-1 ${
              currentPowerCount > 24 ? 'text-red-400' : 24 - currentPowerCount <= 3 ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              Pwr {24 - currentPowerCount}/24
            </span>
          </Tooltip>
          <Tooltip content={`${Math.max(0, 67 - currentSlotCount)} enhancement slots remaining (${currentSlotCount} used)`}>
            <span className={`text-xs tabular-nums font-medium px-1 ${
              currentSlotCount > 67 ? 'text-red-400' : 67 - currentSlotCount <= 5 ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              Slot {Math.max(0, 67 - currentSlotCount)}/67
            </span>
          </Tooltip>
          <div className="w-px h-4 bg-gray-700 mx-0.5 shrink-0" />
          <button onClick={openAccoladesModal} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-amber-300 hover:bg-gray-800 rounded transition-colors shrink-0" title="Toggle accolade bonuses">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="hidden md:inline">Accolades</span>
          </button>
          <button onClick={openSetBonusLookupModal} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-green-300 hover:bg-gray-800 rounded transition-colors shrink-0" title="Look up set bonuses by stat">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden md:inline">Set Bonus Finder</span>
          </button>
          <button onClick={openDetailedTotalsModal} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-blue-300 hover:bg-gray-800 rounded transition-colors shrink-0" title="View detailed character totals">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden md:inline">Totals</span>
          </button>
          <button onClick={openPowersetCompareModal} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-cyan-300 hover:bg-gray-800 rounded transition-colors shrink-0" title="Compare powersets side-by-side">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden md:inline">Compare Sets</span>
          </button>
          <button onClick={() => openCompareSlotting()} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-purple-300 hover:bg-gray-800 rounded transition-colors shrink-0" title="Compare enhancement slotting configurations">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span className="hidden md:inline">Compare Slotting</span>
          </button>
          <button onClick={openStatsConfigModal} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors shrink-0" title="Configure dashboard stats">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden md:inline">Configure</span>
          </button>
          <button onClick={openControlsModal} className="flex items-center gap-1 px-1.5 py-1 text-xs text-gray-400 hover:text-cyan-300 hover:bg-gray-800 rounded transition-colors shrink-0" title="View control hints">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:inline">Controls</span>
          </button>
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

      {/* Known Issues Modal */}
      <KnownIssuesModal
        isOpen={knownIssuesModalOpen}
        onClose={closeKnownIssuesModal}
      />

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={changelogModalOpen}
        onClose={closeChangelogModal}
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
      />

      {/* Detailed Totals Modal */}
      <DetailedTotalsModal
        isOpen={detailedTotalsModalOpen}
        onClose={closeDetailedTotalsModal}
      />

      {/* Welcome Modal (auto-shows on first visit) */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={closeWelcomeModal}
      />

      {/* Compare Slotting Modal */}
      <CompareSlottingModal />

      {/* Powerset Compare Modal */}
      <PowersetCompareModal />

      {/* Proc Settings Modal */}
      <ProcSettingsModal
        isOpen={procSettingsModalOpen}
        onClose={closeProcSettingsModal}
      />
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
  rawValue?: StatValue;
  className?: string;
  tracked?: boolean;
  onTrack?: () => void;
}

function StatItem({ label, value, color = 'text-gray-300', tooltip, breakdown, breakdownUnit = '%', rawValue, className = '', tracked, onTrack }: StatItemProps) {
  const hasCapped = breakdown?.sources.some(s => s.capped) ?? false;
  const content = (
    <div
      className={`flex items-baseline justify-between gap-1 min-w-0 overflow-hidden ${onTrack ? 'cursor-pointer' : 'cursor-help'} ${
        (tracked || hasCapped) ? `ring-1 ${hasCapped ? 'ring-orange-400/70' : 'ring-blue-500/60'} rounded px-1 -mx-1` : ''
      } ${className}`}
      onClick={onTrack}
    >
      <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
      <span className={`text-sm font-medium tabular-nums text-right truncate ${color}`}>{value}</span>
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
                  +{source.value.toFixed(2)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}
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
                <span className="text-amber-400 ml-2 whitespace-nowrap">+{source.value.toFixed(2)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
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
                <span className="text-blue-400 ml-2 whitespace-nowrap">+{source.value.toFixed(2)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
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
                <span className="text-amber-300 ml-2 whitespace-nowrap">+{source.value.toFixed(2)}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
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
                <span className={`ml-2 whitespace-nowrap ${source.capped ? 'text-orange-400 line-through' : 'text-cyan-400'}`}>+{source.value.toFixed(2)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
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
                <span className="text-purple-400 ml-2 whitespace-nowrap">+{source.value.toFixed(2)}{breakdownUnit}{isRegen && <span className="text-slate-400">{hpsSuffix(source.value)}</span>}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-slate-600 pt-1 flex justify-between text-[11px] font-medium">
          <span className="text-slate-300">Total</span>
          <span className={color}>+{breakdown.total.toFixed(2)}{breakdownUnit}{isRegen && <span className="text-slate-400"> ({(rawValue as CompoundStatValue).perSec.toFixed(2)}/s)</span>}</span>
        </div>
      </div>
    );
  }, [breakdown, tooltip, label, color, breakdownUnit, rawValue]);

  return <Tooltip content={tooltipContent}>{content}</Tooltip>;
}
