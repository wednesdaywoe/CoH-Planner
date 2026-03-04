/**
 * StatsDashboard component - displays key stats in a horizontal bar
 * Stats shown are configurable via the StatsConfigModal
 * Tooltips show detailed breakdowns of stat sources with Rule of 5 tracking
 */

import { useMemo } from 'react';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { useBuildStore, useUIStore } from '@/stores';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { Tooltip } from '@/components/ui';
import { StatsConfigModal, AccoladesModal, AboutModal, ExportImportModal, FeedbackModal, KnownIssuesModal, WelcomeModal, useWelcomeModal, SetBonusLookupModal, ControlsModal, CompareSlottingModal } from '@/components/modals';
import { IncarnateSlotGrid, IncarnateModal, IncarnateCraftingModal } from '@/components/incarnate';
import { INCARNATE_REQUIRED_LEVEL, createEmptyIncarnateBuildState } from '@/types';
import type { DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import { STAT_DEFINITIONS } from '@/data/stat-definitions';
import type { StatDefinition, StatValue, CompoundStatValue, MezStatValue } from '@/data/stat-definitions';

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
  const openAboutModal = useUIStore((s) => s.openAboutModal);
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
  const controlsModalOpen = useUIStore((s) => s.controlsModalOpen);
  const openControlsModal = useUIStore((s) => s.openControlsModal);
  const closeControlsModal = useUIStore((s) => s.closeControlsModal);
  const trackedStats = useUIStore((s) => s.trackedStats);
  const toggleTrackedStat = useUIStore((s) => s.toggleTrackedStat);
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
        const value = def.getValue(stats, baseHP, maxHPCap);
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
        return Number(v) !== 0;
      });
  }, [statsConfig, stats, baseHP, maxHPCap, breakdowns]);

  // Stat categories for grouping (should match config modal)
  const STAT_CATEGORIES = [
    {
      name: 'General',
      stats: [
        'damage', 'accuracy', 'tohit', 'recharge',
        'health', 'regeneration', 'maxend', 'recovery', 'endreduction',
        'runspeed', 'flyspeed', 'jumpspeed', 'jumpheight',
      ],
    },
    {
      name: 'Defense',
      stats: [
        'defense_melee',
        'defense_ranged',
        'defense_aoe',
        'defense_smashing',
        'defense_fire',
        'defense_energy',
        'defense_psionic',
        'defense_toxic',
      ],
    },
    {
      name: 'Resistance & Mez',
      stats: [
        'resist_smashing',
        'resist_fire',
        'resist_energy',
        'resist_psionic',
        'resist_toxic',
        'mez_hold',
        'mez_stun',
        'mez_immob',
        'mez_sleep',
        'mez_confuse',
        'mez_fear',
        'mez_kb',
      ],
    },
    {
      name: 'Debuff Resistance',
      stats: [
        'debuff_slow',
        'debuff_defense',
        'debuff_recharge',
        'debuff_endurance',
        'debuff_recovery',
        'debuff_tohit',
        'debuff_regen',
        'debuff_perception',
      ],
    },
  ];

  // Group visible stats by category
  const groupedStats = STAT_CATEGORIES.map((cat) => ({
    name: cat.name,
    stats: visibleStats.filter((s) => cat.stats.includes(s.id)),
  })).filter((cat) => cat.stats.length > 0);

  return (
    <>
      <div className="bg-gray-900/50 border-b border-gray-800 px-2 sm:px-4 py-2 overflow-hidden">
        {/* Grouped stats - CSS Grid auto-fill layout with vertical stretch */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 items-stretch">
            {/* All stat group panels */}
            {groupedStats.map((group) => (
              <div
                key={group.name}
                className="bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 overflow-hidden min-w-0"
              >
                <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide truncate">{group.name}</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {group.stats.map((stat) => (
                    <StatItem
                      key={stat.id}
                      label={stat.label}
                      value={stat.format(stat.value)}
                      color={stat.color}
                      tooltip={stat.tooltip}
                      breakdown={stat.breakdown}
                      breakdownUnit={stat.breakdownUnit}
                      tracked={stat.breakdownKey ? trackedStats.includes(stat.breakdownKey) : false}
                      onTrack={stat.breakdownKey ? () => toggleTrackedStat(stat.breakdownKey!) : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Incarnate Powers panel - hide on very small screens */}
            <div className="hidden md:flex flex-col bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700">
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide flex items-center justify-between">
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
        <div className="flex items-center gap-1 pt-1 mt-1 border-t border-gray-800 flex-wrap">
          {/* Resources: Powers and Slots remaining */}
          <Tooltip content={`${24 - currentPowerCount} power picks remaining (${currentPowerCount} used)`}>
            <span className={`text-xs tabular-nums font-medium px-1.5 ${
              currentPowerCount > 24 ? 'text-red-400' : 24 - currentPowerCount <= 3 ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              Pwr {24 - currentPowerCount}/24
            </span>
          </Tooltip>
          <Tooltip content={`${Math.max(0, 67 - currentSlotCount)} enhancement slots remaining (${currentSlotCount} used)`}>
            <span className={`text-xs tabular-nums font-medium px-1.5 ${
              currentSlotCount > 67 ? 'text-red-400' : 67 - currentSlotCount <= 5 ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              Slot {Math.max(0, 67 - currentSlotCount)}/67
            </span>
          </Tooltip>
          <div className="w-px h-4 bg-gray-700 mx-0.5" />
          {/* Incarnate button - only visible when incarnate panel is hidden (small screens) */}
          <button
            onClick={() => openIncarnateModal()}
            className={`flex md:hidden items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
              !isLevel50
                ? 'text-gray-500 cursor-not-allowed opacity-50'
                : 'text-gray-400 hover:text-purple-300 hover:bg-gray-800'
            }`}
            title={isLevel50 ? "Select incarnate powers" : "Incarnate powers unlock at level 50"}
            disabled={!isLevel50}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="hidden sm:inline">Incarnate</span>
          </button>
          {/* Crafting button - only visible when incarnate panel is hidden (small screens) */}
          {isLevel50 && (
            <button
              onClick={openIncarnateCraftingModal}
              className="flex md:hidden items-center gap-1.5 px-2 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded transition-colors"
              title="Incarnate Crafting Checklist"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="hidden sm:inline">Crafting</span>
            </button>
          )}
          <button
            onClick={openAccoladesModal}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-amber-300 hover:bg-gray-800 rounded transition-colors"
            title="Toggle accolade bonuses"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="hidden sm:inline">Accolades</span>
          </button>
          <button
            onClick={openSetBonusLookupModal}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-green-300 hover:bg-gray-800 rounded transition-colors"
            title="Look up set bonuses by stat"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Set Bonus Finder</span>
          </button>
          <button
            onClick={openStatsConfigModal}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
            title="Configure dashboard stats"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Configure</span>
          </button>
          <button
            onClick={openControlsModal}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-cyan-300 hover:bg-gray-800 rounded transition-colors"
            title="View control hints"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Controls</span>
          </button>
          {/* Spacer pushes About to the right */}
          <div className="flex-1" />
          <button
            onClick={openAboutModal}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors group"
            title="About Sidekick"
          >
            <img
              src="img/favicon-32x32.png"
              alt="About"
              className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
            />
            <span className="hidden sm:inline">About</span>
          </button>
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

      {/* Controls Modal */}
      <ControlsModal
        isOpen={controlsModalOpen}
        onClose={closeControlsModal}
      />

      {/* Welcome Modal (auto-shows on first visit) */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={closeWelcomeModal}
      />

      {/* Compare Slotting Modal */}
      <CompareSlottingModal />
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
  className?: string;
  tracked?: boolean;
  onTrack?: () => void;
}

function StatItem({ label, value, color = 'text-gray-300', tooltip, breakdown, breakdownUnit = '%', className = '', tracked, onTrack }: StatItemProps) {
  const content = (
    <div
      className={`flex items-baseline justify-between gap-1 min-w-0 overflow-hidden ${onTrack ? 'cursor-pointer' : 'cursor-help'} ${
        tracked ? 'ring-1 ring-blue-500/60 rounded px-1 -mx-1' : ''
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
                <span className={`ml-2 ${source.capped ? 'text-orange-400 line-through' : 'text-green-400'}`}>
                  +{source.value.toFixed(2)}{breakdownUnit}
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
                <span className="text-amber-400 ml-2">+{source.value.toFixed(2)}{breakdownUnit}</span>
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
                <span className="text-blue-400 ml-2">+{source.value.toFixed(2)}{breakdownUnit}</span>
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
                <span className="text-amber-300 ml-2">+{source.value.toFixed(2)}</span>
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
                <span className={`ml-2 ${source.capped ? 'text-orange-400 line-through' : 'text-cyan-400'}`}>+{source.value.toFixed(2)}{breakdownUnit}</span>
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
                <span className="text-purple-400 ml-2">+{source.value.toFixed(2)}{breakdownUnit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-slate-600 pt-1 flex justify-between text-[11px] font-medium">
          <span className="text-slate-300">Total</span>
          <span className={color}>+{breakdown.total.toFixed(2)}{breakdownUnit}</span>
        </div>
      </div>
    );
  }, [breakdown, tooltip, label, color, breakdownUnit]);

  return <Tooltip content={tooltipContent}>{content}</Tooltip>;
}
