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
import { StatsConfigModal, AccoladesModal, AboutModal, ExportImportModal, FeedbackModal, KnownIssuesModal, WelcomeModal, useWelcomeModal, SetBonusLookupModal, ControlsModal } from '@/components/modals';
import { IncarnateSlotGrid, IncarnateModal, IncarnateCraftingModal } from '@/components/incarnate';
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

/** Mez stat value carrying both protection and resistance */
interface MezStatValue {
  protection: number; // magnitude points
  resistance: number; // percentage
}

type StatValue = number | string | CompoundStatValue | MezStatValue;

interface StatDefinition {
  id: string;
  label: string;
  getValue: (stats: CalculatedStats, baseHP: number, maxHPCap: number) => StatValue;
  format: (value: StatValue) => string;
  color: string;
  tooltip: string;
  showWhenZero?: boolean;
  breakdownKey?: string; // Key to look up breakdown from calculation result
  breakdownUnit?: string; // Unit for breakdown values (default: '%'). Use 'Mag' for mez protection.
}

/** Format mez stat showing protection (Mag) and resistance (%) */
function formatMezStat(v: StatValue): string {
  if (typeof v === 'object' && v !== null && 'protection' in v) {
    const mez = v as MezStatValue;
    const prot = mez.protection > 0 ? mez.protection.toFixed(1) : '0';
    if (mez.resistance > 0) return `${prot} (${mez.resistance.toFixed(1)}% Res)`;
    return prot;
  }
  return String(v);
}

const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  // Offense
  damage: {
    id: 'damage',
    label: 'Dmg',
    getValue: (stats) => stats.globalDamage,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-red-400',
    tooltip: 'Global damage from set bonuses',
    showWhenZero: true,
    breakdownKey: 'damage',
  },
  accuracy: {
    id: 'accuracy',
    label: 'Acc',
    getValue: (stats) => stats.globalAccuracy,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-yellow-400',
    tooltip: 'Global accuracy from set bonuses',
    showWhenZero: true,
    breakdownKey: 'accuracy',
  },
  tohit: {
    id: 'tohit',
    label: 'ToHit',
    getValue: (stats) => stats.toHitBuff,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-yellow-300',
    tooltip: 'ToHit buff from set bonuses',
    showWhenZero: true,
    breakdownKey: 'tohit',
  },
  recharge: {
    id: 'recharge',
    label: 'Rech',
    getValue: (stats) => stats.globalRecharge,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-blue-400',
    tooltip: 'Global recharge from set bonuses',
    showWhenZero: true,
    breakdownKey: 'recharge',
  },

  // Defense
  defense_melee: {
    id: 'defense_melee',
    label: 'Melee',
    getValue: (stats) => stats.defense.melee,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Melee defense',
    showWhenZero: true,
    breakdownKey: 'defMelee',
  },
  defense_ranged: {
    id: 'defense_ranged',
    label: 'Ranged',
    getValue: (stats) => stats.defense.ranged,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Ranged defense',
    showWhenZero: true,
    breakdownKey: 'defRanged',
  },
  defense_aoe: {
    id: 'defense_aoe',
    label: 'AoE',
    getValue: (stats) => stats.defense.aoe,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'AoE defense',
    showWhenZero: true,
    breakdownKey: 'defAoE',
  },
  defense_smashing: {
    id: 'defense_smashing',
    label: 'S/L',
    getValue: (stats) => Math.max(stats.defense.smashing, stats.defense.lethal),
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Smashing/Lethal defense',
    showWhenZero: true,
    breakdownKey: 'defSmashing',
  },
  defense_fire: {
    id: 'defense_fire',
    label: 'F/C',
    getValue: (stats) => Math.max(stats.defense.fire, stats.defense.cold),
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Fire/Cold defense',
    showWhenZero: true,
    breakdownKey: 'defFire',
  },
  defense_energy: {
    id: 'defense_energy',
    label: 'E/N',
    getValue: (stats) => Math.max(stats.defense.energy, stats.defense.negative),
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Energy/Negative defense',
    showWhenZero: true,
    breakdownKey: 'defEnergy',
  },
  defense_psionic: {
    id: 'defense_psionic',
    label: 'Psi',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Psionic defense',
    showWhenZero: true,
    breakdownKey: 'defPsionic',
  },
  defense_toxic: {
    id: 'defense_toxic',
    label: 'Toxic',
    getValue: () => 0, // Toxic defense is rare
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-purple-400',
    tooltip: 'Toxic defense',
    showWhenZero: true,
    breakdownKey: 'defToxic',
  },

  // Resistance
  resist_smashing: {
    id: 'resist_smashing',
    label: 'S/L',
    getValue: (stats) => Math.max(stats.resistance.smashing, stats.resistance.lethal),
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-orange-400',
    tooltip: 'Smashing/Lethal resistance',
    showWhenZero: true,
    breakdownKey: 'resSmashing',
  },
  resist_fire: {
    id: 'resist_fire',
    label: 'F/C',
    getValue: (stats) => Math.max(stats.resistance.fire, stats.resistance.cold),
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-orange-400',
    tooltip: 'Fire/Cold resistance',
    showWhenZero: true,
    breakdownKey: 'resFire',
  },
  resist_energy: {
    id: 'resist_energy',
    label: 'E/N',
    getValue: (stats) => Math.max(stats.resistance.energy, stats.resistance.negative),
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-orange-400',
    tooltip: 'Energy/Negative resistance',
    showWhenZero: true,
    breakdownKey: 'resEnergy',
  },
  resist_psionic: {
    id: 'resist_psionic',
    label: 'Psi',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-orange-400',
    tooltip: 'Psionic resistance',
    showWhenZero: true,
    breakdownKey: 'resPsionic',
  },
  resist_toxic: {
    id: 'resist_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-orange-400',
    tooltip: 'Toxic resistance',
    showWhenZero: true,
    breakdownKey: 'resToxic',
  },

  // Mez Protection & Resistance
  mez_hold: {
    id: 'mez_hold',
    label: 'Hold',
    getValue: (stats) => ({ protection: stats.mezProtection.hold, resistance: stats.mezResistance.hold }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Hold protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protHold',
    breakdownUnit: 'Mag',
  },
  mez_stun: {
    id: 'mez_stun',
    label: 'Stun',
    getValue: (stats) => ({ protection: stats.mezProtection.stun, resistance: stats.mezResistance.stun }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Stun protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protStun',
    breakdownUnit: 'Mag',
  },
  mez_immob: {
    id: 'mez_immob',
    label: 'Immob',
    getValue: (stats) => ({ protection: stats.mezProtection.immobilize, resistance: stats.mezResistance.immobilize }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Immobilize protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protImmobilize',
    breakdownUnit: 'Mag',
  },
  mez_sleep: {
    id: 'mez_sleep',
    label: 'Sleep',
    getValue: (stats) => ({ protection: stats.mezProtection.sleep, resistance: stats.mezResistance.sleep }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Sleep protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protSleep',
    breakdownUnit: 'Mag',
  },
  mez_confuse: {
    id: 'mez_confuse',
    label: 'Confuse',
    getValue: (stats) => ({ protection: stats.mezProtection.confuse, resistance: stats.mezResistance.confuse }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Confuse protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protConfuse',
    breakdownUnit: 'Mag',
  },
  mez_fear: {
    id: 'mez_fear',
    label: 'Fear',
    getValue: (stats) => ({ protection: stats.mezProtection.fear, resistance: stats.mezResistance.fear }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Fear protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protFear',
    breakdownUnit: 'Mag',
  },
  mez_kb: {
    id: 'mez_kb',
    label: 'KB',
    getValue: (stats) => ({ protection: stats.mezProtection.knockback, resistance: stats.mezResistance.knockback }),
    format: formatMezStat,
    color: 'text-orange-300',
    tooltip: 'Knockback protection (Mag) and resistance (%)',
    showWhenZero: true,
    breakdownKey: 'protKnockback',
    breakdownUnit: 'Mag',
  },

  // Endurance
  maxend: {
    id: 'maxend',
    label: 'End',
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
        return `${perSec.toFixed(2)}/s (+${buff.toFixed(2)}%)`;
      }
      return `+${Number(v).toFixed(2)}%`;
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
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-blue-300',
    tooltip: 'Endurance reduction',
  },

  // Health
  health: {
    id: 'health',
    label: 'HP',
    getValue: (stats, baseHP, maxHPCap) => {
      if (baseHP <= 0) return 0;
      const buffedHP = baseHP * (1 + stats.hpBuff / 100);
      return Math.floor(maxHPCap > 0 ? Math.min(buffedHP, maxHPCap) : buffedHP);
    },
    format: (v) => `${v}`,
    color: 'text-green-400',
    tooltip: 'Maximum hit points',
    showWhenZero: true,
    breakdownKey: 'maxhp',
  },
  regeneration: {
    id: 'regeneration',
    label: 'Regn',
    // Return an object with both values for formatting
    getValue: (stats, baseHP, maxHPCap) => {
      if (baseHP <= 0) return { perSec: 0, buff: stats.regenBuff };
      // Actual max HP (base + buffs, capped)
      const buffedHP = baseHP * (1 + stats.hpBuff / 100);
      const actualHP = maxHPCap > 0 ? Math.min(buffedHP, maxHPCap) : buffedHP;
      // Base regen: 100% HP in 240 seconds = actualHP/240 HP/sec
      const baseRegenRate = actualHP / 240;
      const hpPerSec = baseRegenRate * (1 + stats.regenBuff / 100);
      return { perSec: hpPerSec, buff: stats.regenBuff };
    },
    format: (v) => {
      if (typeof v === 'object' && v !== null && 'perSec' in v) {
        const { perSec, buff } = v as { perSec: number; buff: number };
        return `${perSec.toFixed(2)}/s (+${buff.toFixed(2)}%)`;
      }
      return `+${Number(v).toFixed(2)}%`;
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
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-teal-400',
    tooltip: 'Run speed buff',
  },
  flyspeed: {
    id: 'flyspeed',
    label: 'Fly',
    getValue: (stats) => stats.flySpeed,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-teal-400',
    tooltip: 'Fly speed buff',
  },
  jumpspeed: {
    id: 'jumpspeed',
    label: 'Jump Spd',
    getValue: (stats) => stats.jumpHeight, // Using jumpHeight for now
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-teal-400',
    tooltip: 'Jump speed buff',
  },
  jumpheight: {
    id: 'jumpheight',
    label: 'Jump Ht',
    getValue: (stats) => stats.jumpHeight,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: 'text-teal-400',
    tooltip: 'Jump height buff',
  },

  // Debuff Resistance
  debuff_slow: {
    id: 'debuff_slow',
    label: 'Slow Res',
    getValue: (stats) => stats.debuffResistance.slow,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to slow/movement debuffs',
  },
  debuff_defense: {
    id: 'debuff_defense',
    label: 'Def Debuff Res',
    getValue: (stats) => stats.debuffResistance.defense,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to defense debuffs',
  },
  debuff_recharge: {
    id: 'debuff_recharge',
    label: 'Rech Debuff Res',
    getValue: (stats) => stats.debuffResistance.recharge,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to recharge debuffs',
  },
  debuff_endurance: {
    id: 'debuff_endurance',
    label: 'End Drain Res',
    getValue: (stats) => stats.debuffResistance.endurance,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to endurance drain',
  },
  debuff_recovery: {
    id: 'debuff_recovery',
    label: 'Rec Debuff Res',
    getValue: (stats) => stats.debuffResistance.recovery,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to recovery debuffs',
  },
  debuff_tohit: {
    id: 'debuff_tohit',
    label: 'ToHit Debuff Res',
    getValue: (stats) => stats.debuffResistance.tohit,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to ToHit debuffs',
  },
  debuff_regen: {
    id: 'debuff_regen',
    label: 'Regen Debuff Res',
    getValue: (stats) => stats.debuffResistance.regeneration,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: 'text-cyan-400',
    tooltip: 'Resistance to regeneration debuffs',
  },
  debuff_perception: {
    id: 'debuff_perception',
    label: 'Percep Res',
    getValue: (stats) => stats.debuffResistance.perception,
    format: (v) => `${Number(v).toFixed(2)}%`,
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

  // Calculate power and slot counts
  const currentPowerCount =
    build.primary.powers.length +
    build.secondary.powers.length +
    build.pools.reduce((sum, pool) => sum + pool.powers.length, 0) +
    (build.epicPool?.powers.length ?? 0);
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
            <span className="hidden sm:inline">Set Bonuses</span>
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
