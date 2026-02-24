/**
 * City of Heroes - Character Stats Calculation
 *
 * Functions for calculating character statistics
 */

import type { ArchetypeId } from '@/types';
import { getArchetype } from '@/data';

// ============================================
// STAT CATEGORIES
// ============================================

export interface StatDefinition {
  name: string;
  format: string;
  color: string;
  dualDisplay?: boolean;
}

export interface StatCategory {
  name: string;
  stats: Record<string, StatDefinition>;
}

export const STAT_CATEGORIES: Record<string, StatCategory> = {
  offense: {
    name: 'Offense',
    stats: {
      damage: { name: 'Damage', format: '+{value}%', color: 'stat-damage' },
      accuracy: { name: 'Accuracy', format: '+{value}%', color: 'stat-accuracy' },
      tohit: { name: 'To-Hit', format: '+{value}%', color: 'stat-tohit' },
      recharge: { name: 'Recharge', format: '+{value}%', color: 'stat-recharge' },
      endrdx: { name: 'End Reduction', format: '+{value}%', color: 'stat-endurance' },
    },
  },
  defense: {
    name: 'Defense',
    stats: {
      defMelee: { name: 'Def (Melee)', format: '{value}%', color: 'stat-defense' },
      defRanged: { name: 'Def (Ranged)', format: '{value}%', color: 'stat-defense' },
      defAoE: { name: 'Def (AoE)', format: '{value}%', color: 'stat-defense' },
      defSL: { name: 'Def (S/L)', format: '{value}%', color: 'stat-defense' },
      defFC: { name: 'Def (F/C)', format: '{value}%', color: 'stat-defense' },
      defEN: { name: 'Def (E/N)', format: '{value}%', color: 'stat-defense' },
      defPsionic: { name: 'Def (Psy)', format: '{value}%', color: 'stat-defense' },
      defToxic: { name: 'Def (Tox)', format: '{value}%', color: 'stat-defense' },
    },
  },
  resistance: {
    name: 'Resistance',
    stats: {
      resSL: { name: 'Res (S/L)', format: '{value}%', color: 'stat-resistance' },
      resFC: { name: 'Res (F/C)', format: '{value}%', color: 'stat-resistance' },
      resEN: { name: 'Res (E/N)', format: '{value}%', color: 'stat-resistance' },
      resPsionic: { name: 'Res (Psy)', format: '{value}%', color: 'stat-resistance' },
      resToxic: { name: 'Res (Tox)', format: '{value}%', color: 'stat-resistance' },
    },
  },
  recovery: {
    name: 'Recovery & HP',
    stats: {
      maxend: {
        name: 'Max End',
        format: '{absValue} (+{value}%)',
        color: 'stat-endurance',
        dualDisplay: true,
      },
      recovery: {
        name: 'Recovery',
        format: '{absValue} /sec (+{value}%)',
        color: 'stat-recovery',
        dualDisplay: true,
      },
      maxhp: {
        name: 'Max HP',
        format: '{absValue} HP (+{value}%)',
        color: 'stat-healing',
        dualDisplay: true,
      },
      regeneration: {
        name: 'Regeneration',
        format: '{absValue} HP/sec (+{value}%)',
        color: 'stat-regeneration',
        dualDisplay: true,
      },
    },
  },
  movement: {
    name: 'Movement',
    stats: {
      runspeed: {
        name: 'Run Speed',
        format: '{absValue} mph (+{value}%)',
        color: 'stat-speed',
        dualDisplay: true,
      },
      flyspeed: { name: 'Fly Speed', format: '+{value}%', color: 'stat-fly' },
      jumpspeed: { name: 'Jump Speed', format: '+{value}%', color: 'stat-jump' },
      jumpheight: { name: 'Jump Height', format: '+{value}%', color: 'stat-jump' },
    },
  },
};

export const DEFAULT_ENABLED_STATS = ['damage', 'tohit', 'maxhp', 'regeneration', 'recovery'];

// ============================================
// CHARACTER STATS
// ============================================

export interface CharacterStats {
  // Offense
  damage: number;
  accuracy: number;
  tohit: number;
  recharge: number;
  endrdx: number;

  // Defense (Positional)
  defMelee: number;
  defRanged: number;
  defAoE: number;

  // Defense (Typed - Combined)
  defSL: number;
  defFC: number;
  defEN: number;
  defPsionic: number;
  defToxic: number;

  // Resistance (Combined)
  resSL: number;
  resFC: number;
  resEN: number;
  resPsionic: number;
  resToxic: number;

  // Recovery & HP
  recovery: number;
  regeneration: number;
  maxhp: number;
  maxend: number;

  // Movement
  runspeed: number;
  flyspeed: number;
  jumpspeed: number;
  jumpheight: number;

  // Debuff Resistance
  debuffResistSlow: number;
  debuffResistDefense: number;
  debuffResistRecharge: number;
  debuffResistEndurance: number;
  debuffResistRecovery: number;
  debuffResistToHit: number;
  debuffResistRegeneration: number;
  debuffResistPerception: number;
}

/**
 * Create empty character stats object
 */
export function createEmptyStats(): CharacterStats {
  return {
    damage: 0,
    accuracy: 0,
    tohit: 0,
    recharge: 0,
    endrdx: 0,
    defMelee: 0,
    defRanged: 0,
    defAoE: 0,
    defSL: 0,
    defFC: 0,
    defEN: 0,
    defPsionic: 0,
    defToxic: 0,
    resSL: 0,
    resFC: 0,
    resEN: 0,
    resPsionic: 0,
    resToxic: 0,
    recovery: 0,
    regeneration: 0,
    maxhp: 0,
    maxend: 0,
    runspeed: 0,
    flyspeed: 0,
    jumpspeed: 0,
    jumpheight: 0,
    debuffResistSlow: 0,
    debuffResistDefense: 0,
    debuffResistRecharge: 0,
    debuffResistEndurance: 0,
    debuffResistRecovery: 0,
    debuffResistToHit: 0,
    debuffResistRegeneration: 0,
    debuffResistPerception: 0,
  };
}

// ============================================
// BASELINE STATS
// ============================================

/**
 * Get baseline endurance for current archetype and level.
 * Endurance is flat 100 at all levels (confirmed from attrib_max.endurance in raw data).
 */
export function getBaselineEndurance(archetypeId: ArchetypeId | undefined, _level: number): number {
  if (!archetypeId) return 100;

  const archetype = getArchetype(archetypeId);
  if (!archetype) return 100;

  return archetype.stats?.baseEndurance || 100;
}

/**
 * Get baseline recovery for current archetype and level
 * Recovery = endurance recovered per second
 */
export function getBaselineRecovery(archetypeId: ArchetypeId | undefined, level: number): number {
  if (!archetypeId) return 1.67;

  const archetype = getArchetype(archetypeId);
  if (!archetype) return 1.67;

  const baseRecovery = archetype.stats?.baseRecovery || 1.67;

  // Recovery scales with level (~2% per level after level 1)
  const levelMultiplier = 1 + (level - 1) * 0.02;
  return baseRecovery * levelMultiplier;
}

export interface BaselineHealth {
  baseHealth: number;
  maxHealth: number;
}

/**
 * Get baseline health for current archetype and level.
 * Uses per-level HP lookup tables from the raw game data (attrib_max / attrib_max_max).
 */
export function getBaselineHealth(
  archetypeId: ArchetypeId | undefined,
  level: number
): BaselineHealth {
  if (!archetypeId) {
    return { baseHealth: 1204.7588, maxHealth: 2088.2485 };
  }

  const archetype = getArchetype(archetypeId);
  if (!archetype) {
    return { baseHealth: 1204.7588, maxHealth: 2088.2485 };
  }

  const stats = archetype.stats;
  const hpTable = stats?.hpTable;
  const hpCapTable = stats?.hpCapTable;

  // Clamp level to 1-50 range, convert to 0-indexed
  const idx = Math.max(0, Math.min(49, level - 1));

  if (hpTable && hpCapTable && hpTable.length > idx && hpCapTable.length > idx) {
    return {
      baseHealth: hpTable[idx],
      maxHealth: hpCapTable[idx],
    };
  }

  // Fallback to level 50 scalar values if tables are missing
  return {
    baseHealth: stats?.baseHP || 1204.7588,
    maxHealth: stats?.maxHP || 2088.2485,
  };
}

// ============================================
// POWER BONUSES
// ============================================

export interface PowerBonuses {
  regeneration?: number;
  recovery?: number;
  runspeed?: number;
  flyspeed?: number;
  jumpheight?: number;
  jumpspeed?: number;
  maxend?: number;
  maxhp?: number;
}

export interface ActivePowerBonuses {
  tohit?: number;
  damage?: number;
  defSL?: number;
  defFC?: number;
  defEN?: number;
  defPsionic?: number;
  defToxic?: number;
  resSL?: number;
  resFC?: number;
  resEN?: number;
  resPsionic?: number;
  resToxic?: number;
  toggleEndCost?: number;
}

interface PowerEffects {
  regeneration?: number | { scale: number };
  recovery?: number | { scale: number };
  runSpeed?: number | { scale: number };
  flySpeed?: number | { scale: number };
  jumpHeight?: number | { scale: number };
  jumpSpeed?: number | { scale: number };
  maxEndurance?: number | { scale: number };
  maxHealth?: number | { scale: number };
  tohitBuff?: number;
  damageBuff?: number;
  defense?: Record<string, number>;
  resistance?: Record<string, number>;
  endurance?: number;
}

interface PowerWithEffects {
  name: string;
  effects?: PowerEffects;
  powerType?: string;
  isActive?: boolean;
}

/**
 * Extract scale value from effect
 */
function extractScaleValue(effect: number | { scale: number } | undefined | null): number {
  if (effect === undefined || effect === null) return 0;
  if (typeof effect === 'number') return effect;
  return effect.scale || 0;
}

/**
 * Calculate bonuses from inherent and pool powers
 */
export function calculatePoolPowerBonuses(powers: PowerWithEffects[]): PowerBonuses {
  const bonuses: PowerBonuses = {};

  powers.forEach((power) => {
    // Skip Rest power
    if (power.name === 'Rest') return;

    const effects = power.effects;
    if (!effects) return;

    // Regeneration
    if (effects.regeneration !== undefined) {
      bonuses.regeneration = (bonuses.regeneration || 0) + extractScaleValue(effects.regeneration);
    }

    // Recovery
    if (effects.recovery !== undefined) {
      bonuses.recovery = (bonuses.recovery || 0) + extractScaleValue(effects.recovery);
    }

    // Run speed
    if (effects.runSpeed !== undefined) {
      bonuses.runspeed = (bonuses.runspeed || 0) + extractScaleValue(effects.runSpeed);
    }

    // Fly speed
    if (effects.flySpeed !== undefined) {
      bonuses.flyspeed = (bonuses.flyspeed || 0) + extractScaleValue(effects.flySpeed);
    }

    // Jump height
    if (effects.jumpHeight !== undefined) {
      bonuses.jumpheight = (bonuses.jumpheight || 0) + extractScaleValue(effects.jumpHeight);
    }

    // Jump speed
    if (effects.jumpSpeed !== undefined) {
      bonuses.jumpspeed = (bonuses.jumpspeed || 0) + extractScaleValue(effects.jumpSpeed);
    }

    // Max endurance
    if (effects.maxEndurance !== undefined) {
      bonuses.maxend = (bonuses.maxend || 0) + extractScaleValue(effects.maxEndurance);
    }

    // Max HP
    if (effects.maxHealth !== undefined) {
      bonuses.maxhp = (bonuses.maxhp || 0) + extractScaleValue(effects.maxHealth);
    }
  });

  return bonuses;
}

/**
 * Calculate bonuses from active (toggled) powers
 */
export function calculateActivePowerBonuses(powers: PowerWithEffects[]): ActivePowerBonuses {
  const bonuses: ActivePowerBonuses = {};

  powers.forEach((power) => {
    if (!power.isActive || !power.effects) return;

    const effects = power.effects;

    // ToHit buff
    if (effects.tohitBuff !== undefined) {
      bonuses.tohit = (bonuses.tohit || 0) + effects.tohitBuff * 100;
    }

    // Damage buff
    if (effects.damageBuff !== undefined) {
      bonuses.damage = (bonuses.damage || 0) + effects.damageBuff * 100;
    }

    // Defense from detailed object
    if (effects.defense && typeof effects.defense === 'object') {
      const def = effects.defense;

      // Smashing/Lethal
      if (def.smashing !== undefined || def.lethal !== undefined) {
        const avgSL = ((def.smashing || 0) + (def.lethal || 0)) / 2;
        bonuses.defSL = (bonuses.defSL || 0) + avgSL * 100;
      }

      // Fire/Cold
      if (def.fire !== undefined || def.cold !== undefined) {
        const avgFC = ((def.fire || 0) + (def.cold || 0)) / 2;
        bonuses.defFC = (bonuses.defFC || 0) + avgFC * 100;
      }

      // Energy/Negative
      if (def.energy !== undefined || def.negative !== undefined) {
        const avgEN = ((def.energy || 0) + (def.negative || 0)) / 2;
        bonuses.defEN = (bonuses.defEN || 0) + avgEN * 100;
      }

      // Psionic
      if (def.psionic !== undefined) {
        bonuses.defPsionic = (bonuses.defPsionic || 0) + def.psionic * 100;
      }

      // Toxic
      if (def.toxic !== undefined) {
        bonuses.defToxic = (bonuses.defToxic || 0) + def.toxic * 100;
      }
    }

    // Resistance from detailed object
    if (effects.resistance && typeof effects.resistance === 'object') {
      const res = effects.resistance;

      // Smashing/Lethal
      if (res.smashing !== undefined || res.lethal !== undefined) {
        const avgSL = ((res.smashing || 0) + (res.lethal || 0)) / 2;
        bonuses.resSL = (bonuses.resSL || 0) + avgSL * 100;
      }

      // Fire/Cold
      if (res.fire !== undefined || res.cold !== undefined) {
        const avgFC = ((res.fire || 0) + (res.cold || 0)) / 2;
        bonuses.resFC = (bonuses.resFC || 0) + avgFC * 100;
      }

      // Energy/Negative
      if (res.energy !== undefined || res.negative !== undefined) {
        const avgEN = ((res.energy || 0) + (res.negative || 0)) / 2;
        bonuses.resEN = (bonuses.resEN || 0) + avgEN * 100;
      }

      // Psionic
      if (res.psionic !== undefined) {
        bonuses.resPsionic = (bonuses.resPsionic || 0) + res.psionic * 100;
      }

      // Toxic
      if (res.toxic !== undefined) {
        bonuses.resToxic = (bonuses.resToxic || 0) + res.toxic * 100;
      }
    }

    // Toggle endurance cost
    if (power.powerType === 'Toggle' && effects.endurance) {
      bonuses.toggleEndCost = (bonuses.toggleEndCost || 0) + effects.endurance;
    }
  });

  return bonuses;
}

// ============================================
// STAT FORMATTING
// ============================================

export interface FormattedStat {
  label: string;
  value: string;
  color: string;
  rawValue: number;
}

/**
 * Format a stat value for display
 */
export function formatStatValue(
  statId: string,
  value: number,
  archetypeId: ArchetypeId | undefined,
  level: number,
  stats: CharacterStats
): FormattedStat | null {
  // Find stat definition
  let statDef: StatDefinition | undefined;
  for (const category of Object.values(STAT_CATEGORIES)) {
    if (category.stats[statId]) {
      statDef = category.stats[statId];
      break;
    }
  }

  if (!statDef) return null;

  let formattedValue: string;

  if (statDef.dualDisplay) {
    let absValue = 0;

    if (statId === 'maxhp') {
      const health = getBaselineHealth(archetypeId, level);
      const buffedHP = health.baseHealth * (1 + value / 100);
      absValue = Math.min(buffedHP, health.maxHealth);
    } else if (statId === 'maxend') {
      const baselineMaxEnd = getBaselineEndurance(archetypeId, level);
      absValue = baselineMaxEnd * (1 + value / 100);
    } else if (statId === 'regeneration') {
      const health = getBaselineHealth(archetypeId, level);
      const buffedHP = health.baseHealth * (1 + (stats.maxhp || 0) / 100);
      const actualHP = Math.min(buffedHP, health.maxHealth);
      const baseRegenRate = 0.05; // 5% per 12 seconds
      const baseRegenPerSecond = (actualHP * baseRegenRate) / 12;
      absValue = baseRegenPerSecond * (1 + value / 100);
    } else if (statId === 'recovery') {
      const baselineRecovery = getBaselineRecovery(archetypeId, level);
      absValue = baselineRecovery * (1 + value / 100);
    } else if (statId === 'runspeed') {
      const baseRunSpeed = 12.5; // mph
      absValue = baseRunSpeed * (1 + value / 100);
    }

    formattedValue = statDef.format
      .replace('{absValue}', absValue.toFixed(2))
      .replace('{value}', value.toFixed(1));
  } else {
    formattedValue = statDef.format.replace('{value}', value.toFixed(1));
  }

  return {
    label: statDef.name,
    value: formattedValue,
    color: statDef.color,
    rawValue: value,
  };
}

// ============================================
// STAT TO COMBINED MAPPING
// ============================================

/**
 * Mapping from individual defense/resistance stats to combined dashboard stats
 */
export const STAT_TO_COMBINED: Record<string, string> = {
  // Defense typed -> combined
  defSmashing: 'defSL',
  defLethal: 'defSL',
  defFire: 'defFC',
  defCold: 'defFC',
  defEnergy: 'defEN',
  defNegative: 'defEN',
  // Resistance typed -> combined
  resSmashing: 'resSL',
  resLethal: 'resSL',
  resFire: 'resFC',
  resCold: 'resFC',
  resEnergy: 'resEN',
  resNegative: 'resEN',
};

/**
 * Apply a stat value to character stats with combined stat mapping
 */
export function applyStatToCharacter(
  stats: CharacterStats,
  stat: string,
  value: number
): void {
  // Check if it needs to be mapped to a combined stat
  if (STAT_TO_COMBINED[stat]) {
    const combinedStat = STAT_TO_COMBINED[stat] as keyof CharacterStats;
    (stats[combinedStat] as number) += value;
  } else if (stat in stats) {
    (stats[stat as keyof CharacterStats] as number) += value;
  }
}
