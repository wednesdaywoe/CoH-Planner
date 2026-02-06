/**
 * StatsDashboard component - displays key stats in a horizontal bar
 * Stats shown are configurable via the StatsConfigModal
 * Tooltips show detailed breakdowns of stat sources with Rule of 5 tracking
 */

import { useMemo } from 'react';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { useBuildStore, useUIStore } from '@/stores';
import { Tooltip } from '@/components/ui';
import { StatsConfigModal, AccoladesModal, AboutModal, ExportImportModal, FeedbackModal, WelcomeModal, useWelcomeModal } from '@/components/modals';
import { IncarnateSlotGrid, IncarnateModal } from '@/components/incarnate';
import { INCARNATE_REQUIRED_LEVEL, createEmptyIncarnateBuildState } from '@/types';
import type { CalculatedStats, DashboardStatBreakdown } from '@/hooks/useCalculatedStats';

// ============================================
// STAT DEFINITIONS
// ============================================

/** Compound stat value for stats that show rate + percentage */
interface CompoundStatValue {
  perSec: number;
  buff: number;
}

type StatValue = number | string | CompoundStatValue;

interface StatDefinition {
  id: string;
  label: string;
  getValue: (stats: CalculatedStats, maxHP: number) => StatValue;
  format: (value: StatValue) => string;
  color: string;
  tooltip: string;
  showWhenZero?: boolean;
  breakdownKey?: string; // Key to look up breakdown from calculation result
}

const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  // Offense
  damage: {
    id: 'damage',
    label: 'Damage',
    getValue: (stats) => stats.globalDamage,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-red-400',
    tooltip: 'Global damage from set bonuses',
    showWhenZero: true,
    breakdownKey: 'damage',
  },
  accuracy: {
    id: 'accuracy',
    label: 'Accuracy',
    getValue: (stats) => stats.globalAccuracy,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-yellow-400',
    tooltip: 'Global accuracy from set bonuses',
    showWhenZero: true,
    breakdownKey: 'accuracy',
  },
  tohit: {
    id: 'tohit',
    label: 'ToHit',
    getValue: (stats) => stats.toHitBuff,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-yellow-300',
    tooltip: 'ToHit buff from set bonuses',
    showWhenZero: true,
    breakdownKey: 'tohit',
  },
  recharge: {
    id: 'recharge',
    label: 'Recharge',
    getValue: (stats) => stats.globalRecharge,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-blue-400',
    tooltip: 'Global recharge from set bonuses',
    showWhenZero: true,
    breakdownKey: 'recharge',
  },

  // Defense
  defense_melee: {
    id: 'defense_melee',
    label: 'Melee Def',
    getValue: (stats) => stats.defense.melee,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Melee defense',
    showWhenZero: true,
    breakdownKey: 'defMelee',
  },
  defense_ranged: {
    id: 'defense_ranged',
    label: 'Ranged Def',
    getValue: (stats) => stats.defense.ranged,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Ranged defense',
    showWhenZero: true,
    breakdownKey: 'defRanged',
  },
  defense_aoe: {
    id: 'defense_aoe',
    label: 'AoE Def',
    getValue: (stats) => stats.defense.aoe,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'AoE defense',
    showWhenZero: true,
    breakdownKey: 'defAoE',
  },
  defense_smashing: {
    id: 'defense_smashing',
    label: 'S/L Def',
    getValue: (stats) => Math.max(stats.defense.smashing, stats.defense.lethal),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Smashing/Lethal defense',
    showWhenZero: true,
    breakdownKey: 'defSmashing',
  },
  defense_fire: {
    id: 'defense_fire',
    label: 'F/C Def',
    getValue: (stats) => Math.max(stats.defense.fire, stats.defense.cold),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Fire/Cold defense',
    showWhenZero: true,
    breakdownKey: 'defFire',
  },
  defense_energy: {
    id: 'defense_energy',
    label: 'E/N Def',
    getValue: (stats) => Math.max(stats.defense.energy, stats.defense.negative),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Energy/Negative defense',
    showWhenZero: true,
    breakdownKey: 'defEnergy',
  },
  defense_psionic: {
    id: 'defense_psionic',
    label: 'Psi Def',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Psionic defense',
    showWhenZero: true,
    breakdownKey: 'defPsionic',
  },
  defense_toxic: {
    id: 'defense_toxic',
    label: 'Toxic Def',
    getValue: () => 0, // Toxic defense is rare
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Toxic defense',
    showWhenZero: true,
    breakdownKey: 'defToxic',
  },

  // Resistance
  resist_smashing: {
    id: 'resist_smashing',
    label: 'S/L Res',
    getValue: (stats) => Math.max(stats.resistance.smashing, stats.resistance.lethal),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Smashing/Lethal resistance',
    showWhenZero: true,
    breakdownKey: 'resSmashing',
  },
  resist_fire: {
    id: 'resist_fire',
    label: 'F/C Res',
    getValue: (stats) => Math.max(stats.resistance.fire, stats.resistance.cold),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Fire/Cold resistance',
    showWhenZero: true,
    breakdownKey: 'resFire',
  },
  resist_energy: {
    id: 'resist_energy',
    label: 'E/N Res',
    getValue: (stats) => Math.max(stats.resistance.energy, stats.resistance.negative),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Energy/Negative resistance',
    showWhenZero: true,
    breakdownKey: 'resEnergy',
  },
  resist_psionic: {
    id: 'resist_psionic',
    label: 'Psi Res',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Psionic resistance',
    showWhenZero: true,
    breakdownKey: 'resPsionic',
  },
  resist_toxic: {
    id: 'resist_toxic',
    label: 'Toxic Res',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Toxic resistance',
    showWhenZero: true,
    breakdownKey: 'resToxic',
  },

  // Mez Resistance
  mez_hold: {
    id: 'mez_hold',
    label: 'Hold Res',
    getValue: (stats) => stats.mezResistance.hold,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Hold resistance',
  },
  mez_stun: {
    id: 'mez_stun',
    label: 'Stun Res',
    getValue: (stats) => stats.mezResistance.stun,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Stun resistance',
  },
  mez_immob: {
    id: 'mez_immob',
    label: 'Immob Res',
    getValue: (stats) => stats.mezResistance.immobilize,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Immobilize resistance',
  },
  mez_sleep: {
    id: 'mez_sleep',
    label: 'Sleep Res',
    getValue: (stats) => stats.mezResistance.sleep,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Sleep resistance',
  },
  mez_confuse: {
    id: 'mez_confuse',
    label: 'Confuse Res',
    getValue: (stats) => stats.mezResistance.confuse,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Confuse resistance',
  },
  mez_fear: {
    id: 'mez_fear',
    label: 'Fear Res',
    getValue: (stats) => stats.mezResistance.fear,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Fear resistance',
  },
  mez_kb: {
    id: 'mez_kb',
    label: 'KB Res',
    getValue: (stats) => stats.mezResistance.knockback,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Knockback resistance',
  },

  // Endurance
  maxend: {
    id: 'maxend',
    label: 'Max End',
    getValue: (stats) => stats.maxEndurance,
    format: (v) => `${Number(v).toFixed(0)}`,
    color: 'text-blue-400',
    tooltip: 'Maximum endurance',
    showWhenZero: true,
    breakdownKey: 'maxend',
  },
  recovery: {
    id: 'recovery',
    label: 'Rec',
    // Return an object with both values for formatting
    getValue: (stats) => {
      const baseRecovery = 1.667; // 100 end in 60 seconds
      const endPerSec = baseRecovery * (1 + stats.recoveryBuff / 100);
      return { perSec: endPerSec, buff: stats.recoveryBuff };
    },
    format: (v) => {
      if (typeof v === 'object' && v !== null && 'perSec' in v) {
        const { perSec, buff } = v as { perSec: number; buff: number };
        return `${perSec.toFixed(2)}/s (+${buff.toFixed(1)}%)`;
      }
      return `+${Number(v).toFixed(1)}%`;
    },
    color: 'text-blue-300',
    tooltip: 'Endurance recovery: base 1.67/sec',
    showWhenZero: true,
    breakdownKey: 'recovery',
  },
  endreduction: {
    id: 'endreduction',
    label: 'End Red',
    getValue: (stats) => stats.enduranceReduction,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-blue-300',
    tooltip: 'Endurance reduction',
  },

  // Health
  health: {
    id: 'health',
    label: 'HP',
    getValue: (stats, maxHP) => maxHP > 0 ? Math.floor(maxHP * (1 + stats.hpBuff / 100)) : 0,
    format: (v) => `${v}`,
    color: 'text-green-400',
    tooltip: 'Maximum hit points',
    showWhenZero: true,
    breakdownKey: 'maxhp',
  },
  regeneration: {
    id: 'regeneration',
    label: 'Regen',
    // Return an object with both values for formatting
    getValue: (stats, maxHP) => {
      // Base regen: 100% HP in 240 seconds = maxHP/240 HP/sec
      const baseRegenRate = maxHP / 240;
      const hpPerSec = baseRegenRate * (1 + stats.regenBuff / 100);
      return { perSec: hpPerSec, buff: stats.regenBuff };
    },
    format: (v) => {
      if (typeof v === 'object' && v !== null && 'perSec' in v) {
        const { perSec, buff } = v as { perSec: number; buff: number };
        return `${perSec.toFixed(1)}/s (+${buff.toFixed(1)}%)`;
      }
      return `+${Number(v).toFixed(1)}%`;
    },
    color: 'text-green-300',
    tooltip: 'HP regeneration: base is 100% HP in 240s',
    showWhenZero: true,
    breakdownKey: 'regeneration',
  },

  // Movement
  runspeed: {
    id: 'runspeed',
    label: 'Run',
    getValue: (stats) => stats.runSpeed,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Run speed buff',
  },
  flyspeed: {
    id: 'flyspeed',
    label: 'Fly',
    getValue: (stats) => stats.flySpeed,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Fly speed buff',
  },
  jumpspeed: {
    id: 'jumpspeed',
    label: 'Jump Spd',
    getValue: (stats) => stats.jumpHeight, // Using jumpHeight for now
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Jump speed buff',
  },
  jumpheight: {
    id: 'jumpheight',
    label: 'Jump Ht',
    getValue: (stats) => stats.jumpHeight,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Jump height buff',
  },

  // Debuff Resistance
  debuff_slow: {
    id: 'debuff_slow',
    label: 'Slow Res',
    getValue: (stats) => stats.debuffResistance.slow,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to slow/movement debuffs',
  },
  debuff_defense: {
    id: 'debuff_defense',
    label: 'Def Debuff Res',
    getValue: (stats) => stats.debuffResistance.defense,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to defense debuffs',
  },
  debuff_recharge: {
    id: 'debuff_recharge',
    label: 'Rech Debuff Res',
    getValue: (stats) => stats.debuffResistance.recharge,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to recharge debuffs',
  },
  debuff_endurance: {
    id: 'debuff_endurance',
    label: 'End Drain Res',
    getValue: (stats) => stats.debuffResistance.endurance,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to endurance drain',
  },
  debuff_recovery: {
    id: 'debuff_recovery',
    label: 'Rec Debuff Res',
    getValue: (stats) => stats.debuffResistance.recovery,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to recovery debuffs',
  },
  debuff_tohit: {
    id: 'debuff_tohit',
    label: 'ToHit Debuff Res',
    getValue: (stats) => stats.debuffResistance.tohit,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to ToHit debuffs',
  },
  debuff_regen: {
    id: 'debuff_regen',
    label: 'Regen Debuff Res',
    getValue: (stats) => stats.debuffResistance.regeneration,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to regeneration debuffs',
  },
  debuff_perception: {
    id: 'debuff_perception',
    label: 'Percep Res',
    getValue: (stats) => stats.debuffResistance.perception,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to perception debuffs',
  },
};

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
  const incarnateModalOpen = useUIStore((s) => s.incarnateModalOpen);
  const openIncarnateModal = useUIStore((s) => s.openIncarnateModal);
  const closeIncarnateModal = useUIStore((s) => s.closeIncarnateModal);
  const exportImportModalOpen = useUIStore((s) => s.exportImportModalOpen);
  const closeExportImportModal = useUIStore((s) => s.closeExportImportModal);
  const feedbackModalOpen = useUIStore((s) => s.feedbackModalOpen);
  const closeFeedbackModal = useUIStore((s) => s.closeFeedbackModal);

  // Welcome modal (auto-shows on first visit)
  const [welcomeModalOpen, closeWelcomeModal] = useWelcomeModal();

  // Get incarnate state with fallback for old builds
  const incarnatesRaw = build.incarnates;
  const incarnates = incarnatesRaw || createEmptyIncarnateBuildState();
  const isLevel50 = build.level >= INCARNATE_REQUIRED_LEVEL;

  const maxHP = build.archetype?.stats?.maxHP || 0;
  const breakdowns = calcResult.breakdown;

  // Calculate power and slot counts
  const currentPowerCount =
    build.primary.powers.length +
    build.secondary.powers.length +
    build.pools.reduce((sum, pool) => sum + pool.powers.length, 0) +
    (build.epicPool?.powers.length ?? 0);
  const currentSlotCount =
    build.primary.powers.reduce((sum, p) => sum + p.slots.length, 0) +
    build.secondary.powers.reduce((sum, p) => sum + p.slots.length, 0) +
    build.pools.reduce((sum, pool) => sum + pool.powers.reduce((s, p) => s + p.slots.length, 0), 0) +
    (build.epicPool?.powers.reduce((sum, p) => sum + p.slots.length, 0) ?? 0);

  // Get visible stats based on config
  const visibleStats = useMemo(() => {
    return statsConfig
      .filter((config) => config.visible && STAT_DEFINITIONS[config.stat])
      .sort((a, b) => a.order - b.order)
      .map((config) => {
        const def = STAT_DEFINITIONS[config.stat];
        const value = def.getValue(stats, maxHP);
        const breakdown = def.breakdownKey ? breakdowns.get(def.breakdownKey) : undefined;
        return { ...def, value, breakdown };
      })
      .filter((stat) => stat.showWhenZero || Number(stat.value) !== 0);
  }, [statsConfig, stats, maxHP, breakdowns]);

  // Stat categories for grouping (should match config modal)
  const STAT_CATEGORIES = [
    {
      name: 'Offense',
      stats: ['damage', 'accuracy', 'tohit', 'recharge'],
      panelClass: 'h-[80px] min-h-[80px] max-h-[100px] overflow-hidden',
    },
    {
      name: 'Health & Endurance',
      stats: ['health', 'regeneration', 'maxend', 'recovery'],
      panelClass: 'h-[80px] min-h-[80px] max-h-[100px] overflow-hidden',
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
      panelClass: 'h-[168px] min-h-[168px] max-h-[168px] overflow-hidden',
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
      panelClass: 'h-[168px] min-h-[168px] max-h-[168px] overflow-hidden',
    },
    {
      name: 'Endurance',
      stats: ['endreduction'],
      panelClass: '',
    },
    {
      name: 'Movement',
      stats: ['runspeed', 'flyspeed', 'jumpspeed', 'jumpheight'],
      panelClass: '',
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
      panelClass: 'h-[168px] min-h-[168px] max-h-[168px] overflow-hidden',
    },
  ];

  // Group visible stats by category
  const groupedStats = STAT_CATEGORIES.map((cat) => ({
    name: cat.name,
    stats: visibleStats.filter((s) => cat.stats.includes(s.id)),
    panelClass: cat.panelClass || '',
  })).filter((cat) => cat.stats.length > 0);

  return (
    <>
      <div className="bg-gray-900/50 border-b border-gray-800 px-2 sm:px-4 py-2 relative">
        {/* About button - top right */}
        <button
          onClick={openAboutModal}
          className="absolute top-2 right-2 sm:right-4 z-10 flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-gray-200 bg-gray-800 hover:bg-gray-750 rounded-lg transition-all duration-300 group border-2 border-transparent"
          style={{
            backgroundImage: 'linear-gradient(rgb(31, 41, 55), rgb(31, 41, 55)), linear-gradient(135deg, rgb(37, 99, 235), rgb(147, 51, 234))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
          title="About Sidekick"
        >
          <img
            src="img/favicon-32x32.png"
            alt="About"
            className="w-4 h-4 group-hover:scale-110 transition-transform"
          />
          <span className="hidden sm:inline">About</span>
        </button>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-4">
          {/* Grouped stats - responsive grid layout */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 lg:gap-4 items-start">
            {/* Resources panel - Powers and Slots remaining */}
            <div className="flex flex-col gap-2 w-full sm:w-auto lg:min-w-[140px] lg:max-w-[160px]">
              <div className="bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 lg:h-[168px] lg:min-h-[168px] lg:max-h-[168px]">
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Resources</div>
                <div className="flex flex-row sm:flex-col gap-3 sm:gap-3">
                  <Tooltip content={`${24 - currentPowerCount} power picks remaining (${currentPowerCount} used)`}>
                    <div className="flex items-center justify-between flex-1 sm:flex-auto">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Powers</span>
                      <span
                        className={`text-sm font-medium ${
                          currentPowerCount > 24 ? 'text-red-400' : 24 - currentPowerCount <= 3 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}
                      >
                        {24 - currentPowerCount}/24
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip content={`${67 - currentSlotCount} enhancement slots remaining (${currentSlotCount} used)`}>
                    <div className="flex items-center justify-between flex-1 sm:flex-auto">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Slots</span>
                      <span
                        className={`text-sm font-medium ${
                          currentSlotCount > 67 ? 'text-red-400' : 67 - currentSlotCount <= 5 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}
                      >
                        {67 - currentSlotCount}/67
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Offense and Health & Endurance stacked vertically */}
            <div className="flex flex-col gap-2 w-full sm:w-auto lg:min-w-[300px] lg:max-w-[360px]">
              {groupedStats.find((g) => g.name === 'Offense') && (
                <div
                  className={`bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 ${groupedStats.find((g) => g.name === 'Offense')?.panelClass.replace(/h-\[80px\]|min-h-\[80px\]|max-h-\[100px\]/g, 'lg:$&')}`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Offense</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {groupedStats.find((g) => g.name === 'Offense')?.stats.map((stat) => (
                      <StatItem
                        key={stat.id}
                        label={stat.label}
                        value={stat.format(stat.value)}
                        color={stat.color}
                        tooltip={stat.tooltip}
                        breakdown={stat.breakdown}
                      />
                    ))}
                  </div>
                </div>
              )}
              {groupedStats.find((g) => g.name === 'Health & Endurance') && (
                <div
                  className={`bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 ${groupedStats.find((g) => g.name === 'Health & Endurance')?.panelClass.replace(/h-\[80px\]|min-h-\[80px\]|max-h-\[100px\]/g, 'lg:$&')}`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Health & Endurance</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {groupedStats.find((g) => g.name === 'Health & Endurance')?.stats.map((stat) => (
                      <StatItem
                        key={stat.id}
                        label={stat.label}
                        value={stat.format(stat.value)}
                        color={stat.color}
                        tooltip={stat.tooltip}
                        breakdown={stat.breakdown}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* The rest of the panels */}
            {groupedStats
              .filter((g) => g.name !== 'Offense' && g.name !== 'Health & Endurance')
              .map((group) => (
                <div
                  key={group.name}
                  className={`w-full sm:w-auto lg:min-w-[300px] lg:max-w-[360px] bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 ${group.panelClass.replace(/h-\[\d+px\]|min-h-\[\d+px\]|max-h-\[\d+px\]/g, 'lg:$&')}`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">{group.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {group.stats.map((stat) => (
                      <StatItem
                        key={stat.id}
                        label={stat.label}
                        value={stat.format(stat.value)}
                        color={stat.color}
                        tooltip={stat.tooltip}
                        breakdown={stat.breakdown}
                      />
                    ))}
                  </div>
                </div>
              ))}

            {/* Incarnate Powers panel - 2x3 grid - hide on small/medium screens to prevent overlap with power tree */}
            <div className="hidden lg:block w-full sm:w-auto lg:min-w-[260px] lg:max-w-[300px] bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 lg:h-[168px] lg:min-h-[168px] lg:max-h-[168px]">
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide flex items-center justify-between">
                <span>Incarnate</span>
                {!isLevel50 && (
                  <span className="text-[9px] text-gray-500 font-normal normal-case">Lv50</span>
                )}
              </div>
              <IncarnateSlotGrid
                incarnates={incarnates}
                disabled={!isLevel50}
                onSlotClick={openIncarnateModal}
              />
            </div>
          </div>

          {/* Dashboard actions - horizontal on mobile, vertical on desktop */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 lg:gap-1 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-700">
            {/* Incarnate button - only visible on mobile/tablet when incarnate panel is hidden */}
            <button
              onClick={openIncarnateModal}
              className={`flex lg:hidden items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                !isLevel50
                  ? 'text-gray-500 cursor-not-allowed opacity-50'
                  : 'text-gray-400 hover:text-purple-300 hover:bg-gray-800'
              }`}
              title={isLevel50 ? "Select incarnate powers" : "Incarnate powers unlock at level 50"}
              disabled={!isLevel50}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Incarnate</span>
            </button>
            <button
              onClick={openAccoladesModal}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-amber-300 hover:bg-gray-800 rounded transition-colors"
              title="Toggle accolade bonuses"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Accolades</span>
            </button>
            {/* Configure button - inline on mobile */}
            <button
              onClick={openStatsConfigModal}
              className="flex lg:hidden items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
              title="Configure dashboard stats"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Configure button - bottom right, desktop only */}
        <button
          onClick={openStatsConfigModal}
          className="hidden lg:flex absolute bottom-2 right-4 z-10 items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
          title="Configure dashboard stats"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configure</span>
        </button>
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

      {/* Incarnate Modal */}
      <IncarnateModal
        isOpen={incarnateModalOpen}
        onClose={closeIncarnateModal}
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

      {/* Welcome Modal (auto-shows on first visit) */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={closeWelcomeModal}
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
  className?: string;
}

function StatItem({ label, value, color = 'text-gray-300', tooltip, breakdown, className = '' }: StatItemProps) {
  const content = (
    <div className={`flex items-center justify-between cursor-help ${className}`}>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-medium tabular-nums text-right ${color}`}>{value}</span>
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
              <div key={i} className="flex justify-between text-[10px]">
                <span className={`${source.capped ? 'text-red-400' : 'text-slate-300'} truncate max-w-[200px]`}>
                  {source.name}
                  {source.capped && ' (capped)'}
                </span>
                <span className="text-green-400 ml-2">+{source.value.toFixed(1)}%</span>
              </div>
            ))}
            {breakdown.cappedSources > 0 && (
              <div className="text-[9px] text-red-400 mt-0.5">
                Rule of 5: {breakdown.cappedSources} bonus(es) at cap
              </div>
            )}
          </div>
        )}

        {/* Active Powers */}
        {activePowerSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Active Powers</div>
            {activePowerSources.map((source, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-slate-300">{source.name}</span>
                <span className="text-amber-400 ml-2">+{source.value.toFixed(1)}%</span>
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
                <span className="text-blue-400 ml-2">+{source.value.toFixed(1)}%</span>
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
                <span className="text-amber-300 ml-2">+{source.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Procs */}
        {procSources.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 uppercase mb-0.5">Procs</div>
            {procSources.map((source, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-slate-300 truncate max-w-[200px]">{source.name}</span>
                <span className="text-cyan-400 ml-2">+{source.value.toFixed(1)}%</span>
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
                <span className="text-purple-400 ml-2">+{source.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-slate-600 pt-1 flex justify-between text-[11px] font-medium">
          <span className="text-slate-300">Total</span>
          <span className={color}>+{breakdown.total.toFixed(1)}%</span>
        </div>
      </div>
    );
  }, [breakdown, tooltip, label, color]);

  return <Tooltip content={tooltipContent}>{content}</Tooltip>;
}
