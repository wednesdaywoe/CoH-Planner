/**
 * Stat definitions for the stats dashboard and compare slotting modal.
 *
 * Extracted to a shared module to avoid circular dependencies between
 * StatsDashboard (which renders modals) and CompareSlottingModal
 * (which needs stat definitions).
 */

import { STAT_COLORS } from '@/data/stat-colors';
import type { CalculatedStats } from '@/hooks/useCalculatedStats';

// ============================================
// TYPES
// ============================================

/** Compound stat value for stats that show rate + percentage */
export interface CompoundStatValue {
  perSec: number;
  buff: number;
}

/** Mez stat value carrying both protection and resistance */
export interface MezStatValue {
  protection: number; // magnitude points
  resistance: number; // percentage
}

/** Paired stat value for S/L, F/C, E/N when the two values differ */
export interface PairedStatValue {
  first: number;
  second: number;
}

export type StatValue = number | string | CompoundStatValue | MezStatValue | PairedStatValue;

export interface StatDefinition {
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

// ============================================
// HELPERS
// ============================================

/** Return PairedStatValue if values differ, otherwise just the number */
function pairedValue(a: number, b: number): StatValue {
  if (a === b) return a;
  return { first: a, second: b } as PairedStatValue;
}

/** Format a paired or simple percentage stat */
function formatPairedPercent(v: StatValue): string {
  if (typeof v === 'object' && v !== null && 'first' in v) {
    const p = v as PairedStatValue;
    return `${p.first.toFixed(2)}%/${p.second.toFixed(2)}%`;
  }
  return `${Number(v).toFixed(2)}%`;
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

// ============================================
// STAT DEFINITIONS
// ============================================

export const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  // Offense
  damage: {
    id: 'damage',
    label: 'Dmg',
    getValue: (stats) => stats.globalDamage,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.damage,
    tooltip: 'Global damage from set bonuses',
    showWhenZero: true,
    breakdownKey: 'damage',
  },
  accuracy: {
    id: 'accuracy',
    label: 'Acc',
    getValue: (stats) => stats.globalAccuracy,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.accuracy,
    tooltip: 'Global accuracy from set bonuses',
    showWhenZero: true,
    breakdownKey: 'accuracy',
  },
  tohit: {
    id: 'tohit',
    label: 'ToHit',
    getValue: (stats) => stats.toHitBuff,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.tohit,
    tooltip: 'ToHit buff from set bonuses. Additive modifier to base hit chance.',
    showWhenZero: true,
    breakdownKey: 'tohit',
  },
  recharge: {
    id: 'recharge',
    label: 'Rech',
    getValue: (stats) => stats.globalRecharge,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.recharge,
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
    color: STAT_COLORS.defense,
    tooltip: 'Melee defense',
    showWhenZero: true,
    breakdownKey: 'defMelee',
  },
  defense_ranged: {
    id: 'defense_ranged',
    label: 'Ranged',
    getValue: (stats) => stats.defense.ranged,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Ranged defense',
    showWhenZero: true,
    breakdownKey: 'defRanged',
  },
  defense_aoe: {
    id: 'defense_aoe',
    label: 'AoE',
    getValue: (stats) => stats.defense.aoe,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'AoE defense',
    showWhenZero: true,
    breakdownKey: 'defAoE',
  },
  defense_smashing: {
    id: 'defense_smashing',
    label: 'S/L',
    getValue: (stats) => pairedValue(stats.defense.smashing, stats.defense.lethal),
    format: formatPairedPercent,
    color: STAT_COLORS.defense,
    tooltip: 'Smashing/Lethal defense',
    showWhenZero: true,
    breakdownKey: 'defSmashing',
  },
  defense_fire: {
    id: 'defense_fire',
    label: 'F/C',
    getValue: (stats) => pairedValue(stats.defense.fire, stats.defense.cold),
    format: formatPairedPercent,
    color: STAT_COLORS.defense,
    tooltip: 'Fire/Cold defense',
    showWhenZero: true,
    breakdownKey: 'defFire',
  },
  defense_energy: {
    id: 'defense_energy',
    label: 'E/N',
    getValue: (stats) => pairedValue(stats.defense.energy, stats.defense.negative),
    format: formatPairedPercent,
    color: STAT_COLORS.defense,
    tooltip: 'Energy/Negative defense',
    showWhenZero: true,
    breakdownKey: 'defEnergy',
  },
  defense_psionic: {
    id: 'defense_psionic',
    label: 'Psi',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Psionic defense',
    showWhenZero: true,
    breakdownKey: 'defPsionic',
  },
  defense_toxic: {
    id: 'defense_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.defense.toxic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Toxic defense',
    showWhenZero: true,
    breakdownKey: 'defToxic',
  },

  // Resistance
  resist_smashing: {
    id: 'resist_smashing',
    label: 'S/L',
    getValue: (stats) => pairedValue(stats.resistance.smashing, stats.resistance.lethal),
    format: formatPairedPercent,
    color: STAT_COLORS.resistance,
    tooltip: 'Smashing/Lethal resistance',
    showWhenZero: true,
    breakdownKey: 'resSmashing',
  },
  resist_fire: {
    id: 'resist_fire',
    label: 'F/C',
    getValue: (stats) => pairedValue(stats.resistance.fire, stats.resistance.cold),
    format: formatPairedPercent,
    color: STAT_COLORS.resistance,
    tooltip: 'Fire/Cold resistance',
    showWhenZero: true,
    breakdownKey: 'resFire',
  },
  resist_energy: {
    id: 'resist_energy',
    label: 'E/N',
    getValue: (stats) => pairedValue(stats.resistance.energy, stats.resistance.negative),
    format: formatPairedPercent,
    color: STAT_COLORS.resistance,
    tooltip: 'Energy/Negative resistance',
    showWhenZero: true,
    breakdownKey: 'resEnergy',
  },
  resist_psionic: {
    id: 'resist_psionic',
    label: 'Psi',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Psionic resistance',
    showWhenZero: true,
    breakdownKey: 'resPsionic',
  },
  resist_toxic: {
    id: 'resist_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
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
    color: STAT_COLORS.hold,
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
    color: STAT_COLORS.stun,
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
    color: STAT_COLORS.immobilize,
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
    color: STAT_COLORS.sleep,
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
    color: STAT_COLORS.confuse,
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
    color: STAT_COLORS.fear,
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
    color: STAT_COLORS.knockback,
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
    color: STAT_COLORS.maxEnd,
    tooltip: 'Maximum endurance',
    showWhenZero: true,
    breakdownKey: 'maxend',
  },
  recovery: {
    id: 'recovery',
    label: 'Rec',
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
    color: STAT_COLORS.recovery,
    tooltip: 'Endurance recovery: base 1.67/sec',
    showWhenZero: true,
    breakdownKey: 'recovery',
  },
  endreduction: {
    id: 'endreduction',
    label: 'End Red',
    getValue: (stats) => stats.enduranceReduction,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.enduranceDiscount,
    tooltip: 'Endurance reduction',
  },
  endcost: {
    id: 'endcost',
    label: 'End Cost',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => `${Number(v).toFixed(2)}/s`,
    color: 'text-orange-400',
    tooltip: 'Endurance cost per second from active toggle powers',
    showWhenZero: true,
    breakdownKey: 'toggleEndCost',
    breakdownUnit: '/s',
  },
  netend: {
    id: 'netend',
    label: 'Net End',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => {
      const n = Number(v);
      const sign = n >= 0 ? '+' : '';
      return `${sign}${n.toFixed(2)}/s`;
    },
    color: 'text-emerald-400',
    tooltip: 'Net endurance per second: recovery minus toggle costs',
    showWhenZero: true,
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
    color: STAT_COLORS.health,
    tooltip: 'Maximum hit points',
    showWhenZero: true,
    breakdownKey: 'maxhp',
  },
  regeneration: {
    id: 'regeneration',
    label: 'Regn',
    getValue: (stats, baseHP, maxHPCap) => {
      if (baseHP <= 0) return { perSec: 0, buff: stats.regenBuff };
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
    color: STAT_COLORS.regen,
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
    color: STAT_COLORS.runSpeed,
    tooltip: 'Run speed buff',
  },
  flyspeed: {
    id: 'flyspeed',
    label: 'Fly',
    getValue: (stats) => stats.flySpeed,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.flySpeed,
    tooltip: 'Fly speed buff',
  },
  jumpspeed: {
    id: 'jumpspeed',
    label: 'Jump Spd',
    getValue: (stats) => stats.jumpHeight, // Using jumpHeight for now
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.jumpSpeed,
    tooltip: 'Jump speed buff',
  },
  jumpheight: {
    id: 'jumpheight',
    label: 'Jump Ht',
    getValue: (stats) => stats.jumpHeight,
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.jumpHeight,
    tooltip: 'Jump height buff',
  },

  // Debuff Resistance
  debuff_slow: {
    id: 'debuff_slow',
    label: 'Slow Res',
    getValue: (stats) => stats.debuffResistance.slow,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to slow/movement debuffs',
  },
  debuff_defense: {
    id: 'debuff_defense',
    label: 'Def Debuff Res',
    getValue: (stats) => stats.debuffResistance.defense,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to defense debuffs',
  },
  debuff_recharge: {
    id: 'debuff_recharge',
    label: 'Rech Debuff Res',
    getValue: (stats) => stats.debuffResistance.recharge,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to recharge debuffs',
  },
  debuff_endurance: {
    id: 'debuff_endurance',
    label: 'End Drain Res',
    getValue: (stats) => stats.debuffResistance.endurance,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to endurance drain',
  },
  debuff_recovery: {
    id: 'debuff_recovery',
    label: 'Rec Debuff Res',
    getValue: (stats) => stats.debuffResistance.recovery,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to recovery debuffs',
  },
  debuff_tohit: {
    id: 'debuff_tohit',
    label: 'ToHit Debuff Res',
    getValue: (stats) => stats.debuffResistance.tohit,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to ToHit debuffs',
  },
  debuff_regen: {
    id: 'debuff_regen',
    label: 'Regen Debuff Res',
    getValue: (stats) => stats.debuffResistance.regeneration,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to regeneration debuffs',
  },
  debuff_perception: {
    id: 'debuff_perception',
    label: 'Percep Res',
    getValue: (stats) => stats.debuffResistance.perception,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to perception debuffs',
  },

  // ============================================
  // INDIVIDUAL DEFENSE (for Detailed Totals)
  // ============================================
  def_smashing: {
    id: 'def_smashing',
    label: 'Smashing',
    getValue: (stats) => stats.defense.smashing,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Smashing defense',
    showWhenZero: true,
    breakdownKey: 'defSmashing',
  },
  def_lethal: {
    id: 'def_lethal',
    label: 'Lethal',
    getValue: (stats) => stats.defense.lethal,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Lethal defense',
    showWhenZero: true,
    breakdownKey: 'defLethal',
  },
  def_fire: {
    id: 'def_fire',
    label: 'Fire',
    getValue: (stats) => stats.defense.fire,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Fire defense',
    showWhenZero: true,
    breakdownKey: 'defFire',
  },
  def_cold: {
    id: 'def_cold',
    label: 'Cold',
    getValue: (stats) => stats.defense.cold,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Cold defense',
    showWhenZero: true,
    breakdownKey: 'defCold',
  },
  def_energy: {
    id: 'def_energy',
    label: 'Energy',
    getValue: (stats) => stats.defense.energy,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Energy defense',
    showWhenZero: true,
    breakdownKey: 'defEnergy',
  },
  def_negative: {
    id: 'def_negative',
    label: 'Negative',
    getValue: (stats) => stats.defense.negative,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Negative energy defense',
    showWhenZero: true,
    breakdownKey: 'defNegative',
  },
  def_psionic: {
    id: 'def_psionic',
    label: 'Psionic',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Psionic defense',
    showWhenZero: true,
    breakdownKey: 'defPsionic',
  },
  def_toxic: {
    id: 'def_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.defense.toxic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Toxic defense',
    showWhenZero: true,
    breakdownKey: 'defToxic',
  },

  // ============================================
  // INDIVIDUAL RESISTANCE (for Detailed Totals)
  // ============================================
  res_smashing: {
    id: 'res_smashing',
    label: 'Smashing',
    getValue: (stats) => stats.resistance.smashing,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Smashing resistance',
    showWhenZero: true,
    breakdownKey: 'resSmashing',
  },
  res_lethal: {
    id: 'res_lethal',
    label: 'Lethal',
    getValue: (stats) => stats.resistance.lethal,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Lethal resistance',
    showWhenZero: true,
    breakdownKey: 'resLethal',
  },
  res_fire: {
    id: 'res_fire',
    label: 'Fire',
    getValue: (stats) => stats.resistance.fire,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Fire resistance',
    showWhenZero: true,
    breakdownKey: 'resFire',
  },
  res_cold: {
    id: 'res_cold',
    label: 'Cold',
    getValue: (stats) => stats.resistance.cold,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Cold resistance',
    showWhenZero: true,
    breakdownKey: 'resCold',
  },
  res_energy: {
    id: 'res_energy',
    label: 'Energy',
    getValue: (stats) => stats.resistance.energy,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Energy resistance',
    showWhenZero: true,
    breakdownKey: 'resEnergy',
  },
  res_negative: {
    id: 'res_negative',
    label: 'Negative',
    getValue: (stats) => stats.resistance.negative,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Negative energy resistance',
    showWhenZero: true,
    breakdownKey: 'resNegative',
  },
  res_psionic: {
    id: 'res_psionic',
    label: 'Psionic',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Psionic resistance',
    showWhenZero: true,
    breakdownKey: 'resPsionic',
  },
  res_toxic: {
    id: 'res_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Toxic resistance',
    showWhenZero: true,
    breakdownKey: 'resToxic',
  },

  // ============================================
  // SEPARATE MEZ PROTECTION (magnitude only)
  // ============================================
  prot_hold: {
    id: 'prot_hold',
    label: 'Hold',
    getValue: (stats) => stats.mezProtection.hold,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.hold,
    tooltip: 'Hold protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protHold',
    breakdownUnit: 'Mag',
  },
  prot_stun: {
    id: 'prot_stun',
    label: 'Stun',
    getValue: (stats) => stats.mezProtection.stun,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.stun,
    tooltip: 'Stun protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protStun',
    breakdownUnit: 'Mag',
  },
  prot_immob: {
    id: 'prot_immob',
    label: 'Immobilize',
    getValue: (stats) => stats.mezProtection.immobilize,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.immobilize,
    tooltip: 'Immobilize protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protImmobilize',
    breakdownUnit: 'Mag',
  },
  prot_sleep: {
    id: 'prot_sleep',
    label: 'Sleep',
    getValue: (stats) => stats.mezProtection.sleep,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.sleep,
    tooltip: 'Sleep protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protSleep',
    breakdownUnit: 'Mag',
  },
  prot_confuse: {
    id: 'prot_confuse',
    label: 'Confuse',
    getValue: (stats) => stats.mezProtection.confuse,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.confuse,
    tooltip: 'Confuse protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protConfuse',
    breakdownUnit: 'Mag',
  },
  prot_fear: {
    id: 'prot_fear',
    label: 'Fear',
    getValue: (stats) => stats.mezProtection.fear,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.fear,
    tooltip: 'Fear/Terrorize protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protFear',
    breakdownUnit: 'Mag',
  },
  prot_kb: {
    id: 'prot_kb',
    label: 'Knockback',
    getValue: (stats) => stats.mezProtection.knockback,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.knockback,
    tooltip: 'Knockback protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protKnockback',
    breakdownUnit: 'Mag',
  },

  // ============================================
  // SEPARATE MEZ RESISTANCE (% only)
  // ============================================
  mezres_hold: {
    id: 'mezres_hold',
    label: 'Hold',
    getValue: (stats) => stats.mezResistance.hold,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.hold,
    tooltip: 'Hold resistance',
    breakdownKey: 'mezResist',
  },
  mezres_stun: {
    id: 'mezres_stun',
    label: 'Stun',
    getValue: (stats) => stats.mezResistance.stun,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.stun,
    tooltip: 'Stun resistance',
    breakdownKey: 'mezResist',
  },
  mezres_immob: {
    id: 'mezres_immob',
    label: 'Immobilize',
    getValue: (stats) => stats.mezResistance.immobilize,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.immobilize,
    tooltip: 'Immobilize resistance',
    breakdownKey: 'mezResist',
  },
  mezres_sleep: {
    id: 'mezres_sleep',
    label: 'Sleep',
    getValue: (stats) => stats.mezResistance.sleep,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.sleep,
    tooltip: 'Sleep resistance',
    breakdownKey: 'mezResist',
  },
  mezres_confuse: {
    id: 'mezres_confuse',
    label: 'Confuse',
    getValue: (stats) => stats.mezResistance.confuse,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.confuse,
    tooltip: 'Confuse resistance',
    breakdownKey: 'mezResist',
  },
  mezres_fear: {
    id: 'mezres_fear',
    label: 'Fear',
    getValue: (stats) => stats.mezResistance.fear,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.fear,
    tooltip: 'Fear/Terrorize resistance',
    breakdownKey: 'mezResist',
  },
  mezres_kb: {
    id: 'mezres_kb',
    label: 'Knockback',
    getValue: (stats) => stats.mezResistance.knockback,
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.knockback,
    tooltip: 'Knockback resistance',
    breakdownKey: 'mezResist',
  },

  // ============================================
  // ADDITIONAL STATS (for Detailed Totals)
  // ============================================
  range_bonus: {
    id: 'range_bonus',
    label: 'Range',
    getValue: () => 0, // Range bonus requires globalBonuses, handled via override in DetailedTotalsModal
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.accuracy,
    tooltip: 'Range bonus from set bonuses',
    breakdownKey: 'range',
  },
  heal_other: {
    id: 'heal_other',
    label: 'Heal Other',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.health,
    tooltip: 'Healing bonus for heals cast on others',
    breakdownKey: 'healOther',
  },
  threat_level: {
    id: 'threat_level',
    label: 'Threat',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Threat level modifier',
    breakdownKey: 'threatLevel',
  },

  // ============================================
  // STEALTH & PERCEPTION
  // ============================================
  stealth_pve: {
    id: 'stealth_pve',
    label: 'Stealth (PvE)',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(0)} ft`,
    color: STAT_COLORS.defense,
    tooltip: 'Stealth radius in PvE (feet)',
    breakdownKey: 'stealthRadiusPvE',
    breakdownUnit: ' ft',
  },
  stealth_pvp: {
    id: 'stealth_pvp',
    label: 'Stealth (PvP)',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(0)} ft`,
    color: STAT_COLORS.defense,
    tooltip: 'Stealth radius in PvP (feet)',
    breakdownKey: 'stealthRadiusPvP',
    breakdownUnit: ' ft',
  },
  perception_bonus: {
    id: 'perception_bonus',
    label: 'Perception',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `+${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.accuracy,
    tooltip: 'Perception radius bonus',
    breakdownKey: 'perceptionRadius',
  },

  // ============================================
  // ADDITIONAL STATUS PROTECTION/RESISTANCE
  // ============================================
  prot_repel: {
    id: 'prot_repel',
    label: 'Repel',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.knockback,
    tooltip: 'Repel protection magnitude',
    breakdownKey: 'protRepel',
    breakdownUnit: 'Mag',
  },
  prot_teleport: {
    id: 'prot_teleport',
    label: 'Teleport',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(0)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Teleport protection',
    breakdownKey: 'protTeleport',
  },
  mezres_taunt: {
    id: 'mezres_taunt',
    label: 'Taunt',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.hold,
    tooltip: 'Taunt resistance',
    breakdownKey: 'mezResistTaunt',
  },
  mezres_placate: {
    id: 'mezres_placate',
    label: 'Placate',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(2)}%`,
    color: STAT_COLORS.confuse,
    tooltip: 'Placate resistance',
    breakdownKey: 'mezResistPlacate',
  },

  // ============================================
  // INCARNATE
  // ============================================
  level_shift: {
    id: 'level_shift',
    label: 'Level Shift',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => Number(v) > 0 ? `+${Number(v)}` : '0',
    color: 'text-amber-400',
    tooltip: 'Incarnate level shift (from Alpha/Destiny)',
    breakdownKey: 'levelShift',
    breakdownUnit: '',
  },
};
