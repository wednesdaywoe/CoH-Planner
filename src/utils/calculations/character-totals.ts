/**
 * Character Totals Calculation System
 *
 * This module wires together all calculation utilities to produce:
 * 1. Global bonuses (set bonuses with Rule of 5)
 * 2. Character stats for the dashboard
 * 3. Stat breakdown tracking for tooltips
 *
 * The calculation chain:
 * - Set Bonuses → Rule of 5 → Global Bonuses
 * - Active Powers → Toggle Buffs → Global Bonuses
 * - Global Bonuses → Dashboard Stats (with breakdown tracking)
 */

import type { Build } from '@/types';
import { getIOSet } from '@/data';
import {
  calculateSetBonuses,
  getStatBreakdown,
  type AggregatedBonuses,
  type StatBreakdownItem,
  type BuildPowers,
} from './set-bonuses';
import {
  createEmptyStats,
  type CharacterStats,
} from './stats';

// ============================================
// TYPES
// ============================================

/**
 * Global bonuses from set bonuses and active powers
 * These modify all powers (Final values)
 */
export interface GlobalBonuses {
  damage: number;
  accuracy: number;
  toHit: number;
  recharge: number;
  endurance: number;
  range: number;
  // Defense
  defMelee: number;
  defRanged: number;
  defAoE: number;
  defSmashing: number;
  defLethal: number;
  defFire: number;
  defCold: number;
  defEnergy: number;
  defNegative: number;
  defPsionic: number;
  defToxic: number;
  // Resistance
  resSmashing: number;
  resLethal: number;
  resFire: number;
  resCold: number;
  resEnergy: number;
  resNegative: number;
  resPsionic: number;
  resToxic: number;
  // Recovery & Health
  maxHP: number;
  maxEndurance: number;
  regeneration: number;
  recovery: number;
  // Movement
  runSpeed: number;
  jumpHeight: number;
  flySpeed: number;
  // Mez Resistance
  mezResist: number;
  // Special
  healOther: number;
  threatLevel: number;
}

/**
 * Source of a stat contribution for breakdown
 */
export interface StatSource {
  name: string;
  value: number;
  type: 'set-bonus' | 'active-power' | 'inherent' | 'enhancement';
  setId?: string;
  pieces?: number;
  capped?: boolean; // True if this instance hit the Rule of 5 cap
}

/**
 * Complete stat breakdown for a dashboard stat
 */
export interface DashboardStatBreakdown {
  total: number;
  base: number;
  sources: StatSource[];
  cappedSources: number; // Count of sources that are capped
}

/**
 * Full calculation result with all data needed
 */
export interface CharacterCalculationResult {
  stats: CharacterStats;
  globalBonuses: GlobalBonuses;
  breakdown: Map<string, DashboardStatBreakdown>;
  setBonuses: AggregatedBonuses;
}

// ============================================
// GLOBAL BONUS INITIALIZATION
// ============================================

function createEmptyGlobalBonuses(): GlobalBonuses {
  return {
    damage: 0,
    accuracy: 0,
    toHit: 0,
    recharge: 0,
    endurance: 0,
    range: 0,
    defMelee: 0,
    defRanged: 0,
    defAoE: 0,
    defSmashing: 0,
    defLethal: 0,
    defFire: 0,
    defCold: 0,
    defEnergy: 0,
    defNegative: 0,
    defPsionic: 0,
    defToxic: 0,
    resSmashing: 0,
    resLethal: 0,
    resFire: 0,
    resCold: 0,
    resEnergy: 0,
    resNegative: 0,
    resPsionic: 0,
    resToxic: 0,
    maxHP: 0,
    maxEndurance: 0,
    regeneration: 0,
    recovery: 0,
    runSpeed: 0,
    jumpHeight: 0,
    flySpeed: 0,
    mezResist: 0,
    healOther: 0,
    threatLevel: 0,
  };
}

// ============================================
// STAT NAME MAPPING
// ============================================

/**
 * Map set bonus stat names to our global bonus property names
 */
const STAT_TO_GLOBAL: Record<string, keyof GlobalBonuses> = {
  // Offense
  damage: 'damage',
  accuracy: 'accuracy',
  tohit: 'toHit',
  recharge: 'recharge',
  endrdx: 'endurance',
  range: 'range',

  // Defense positional
  defmelee: 'defMelee',
  defranged: 'defRanged',
  defaoe: 'defAoE',

  // Defense typed
  defsmashing: 'defSmashing',
  deflethal: 'defLethal',
  deffire: 'defFire',
  defcold: 'defCold',
  defenergy: 'defEnergy',
  defnegative: 'defNegative',
  defpsionic: 'defPsionic',
  deftoxic: 'defToxic',

  // Combined defense (S/L, F/C, E/N)
  defsl: 'defSmashing', // Will apply to both
  deffc: 'defFire',
  defen: 'defEnergy',

  // Resistance
  ressmashing: 'resSmashing',
  reslethal: 'resLethal',
  resfire: 'resFire',
  rescold: 'resCold',
  resenergy: 'resEnergy',
  resnegative: 'resNegative',
  respsionic: 'resPsionic',
  restoxic: 'resToxic',

  // Combined resistance
  ressl: 'resSmashing',
  resfc: 'resFire',
  resen: 'resEnergy',

  // Recovery & Health
  maxhp: 'maxHP',
  maxend: 'maxEndurance',
  regeneration: 'regeneration',
  recovery: 'recovery',

  // Movement
  runspeed: 'runSpeed',
  jumpheight: 'jumpHeight',
  flyspeed: 'flySpeed',

  // Special
  mezresist: 'mezResist',
  healother: 'healOther',
  threatlevel: 'threatLevel',
};

/**
 * Stats that should apply to paired types (S/L, F/C, E/N)
 */
const PAIRED_STATS: Record<string, string[]> = {
  defsl: ['defSmashing', 'defLethal'],
  deffc: ['defFire', 'defCold'],
  defen: ['defEnergy', 'defNegative'],
  ressl: ['resSmashing', 'resLethal'],
  resfc: ['resFire', 'resCold'],
  resen: ['resEnergy', 'resNegative'],
};

// ============================================
// SET BONUS PROCESSING
// ============================================

/**
 * Convert set bonus aggregated values to global bonuses
 */
function applySetBonusesToGlobal(
  aggregated: AggregatedBonuses,
  global: GlobalBonuses
): void {
  for (const [stat, value] of Object.entries(aggregated)) {
    const normalizedStat = stat.toLowerCase().replace(/[^a-z]/g, '');

    // Check for paired stats (e.g., smashing/lethal resistance)
    if (PAIRED_STATS[normalizedStat]) {
      const paired = PAIRED_STATS[normalizedStat];
      for (const pairStat of paired) {
        const key = pairStat as keyof GlobalBonuses;
        if (key in global) {
          global[key] += value;
        }
      }
    } else {
      // Direct mapping
      const key = STAT_TO_GLOBAL[normalizedStat];
      if (key && key in global) {
        global[key] += value;
      }
    }
  }
}

/**
 * Build stat breakdown from set bonus tracking
 */
function buildStatBreakdown(
  breakdownItems: StatBreakdownItem[]
): DashboardStatBreakdown {
  const sources: StatSource[] = [];
  let cappedCount = 0;
  let total = 0;

  for (const item of breakdownItems) {
    // Each item represents a unique value with potentially multiple sources
    for (const sourceName of item.sources) {
      const source: StatSource = {
        name: sourceName,
        value: item.value,
        type: 'set-bonus',
        capped: item.capped,
      };
      sources.push(source);
    }
    total += item.total;
    if (item.capped) cappedCount++;
  }

  return {
    total,
    base: 0,
    sources,
    cappedSources: cappedCount,
  };
}

// ============================================
// ACTIVE POWER PROCESSING
// ============================================

interface ActivePowerEffect {
  tohitBuff?: number;
  damageBuff?: number;
  defense?: Record<string, number>;
  resistance?: Record<string, number>;
  runSpeed?: number;
  flySpeed?: number;
  jumpHeight?: number;
  regeneration?: number | { scale: number };
  recovery?: number | { scale: number };
  maxEndurance?: number | { scale: number };
  maxHealth?: number | { scale: number };
}

interface PowerWithToggle {
  name: string;
  powerType?: string;
  isActive?: boolean;
  effects?: ActivePowerEffect;
}

/**
 * Apply bonuses from active toggle powers
 */
function applyActivePowerBonuses(
  powers: PowerWithToggle[],
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>
): void {
  for (const power of powers) {
    if (!power.isActive || !power.effects) continue;

    const effects = power.effects;

    // ToHit buff (stored as decimal, convert to percentage)
    if (effects.tohitBuff !== undefined) {
      const value = effects.tohitBuff * 100;
      global.toHit += value;
      addToBreakdown(breakdown, 'toHit', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Damage buff
    if (effects.damageBuff !== undefined) {
      const value = effects.damageBuff * 100;
      global.damage += value;
      addToBreakdown(breakdown, 'damage', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Defense from active powers
    if (effects.defense && typeof effects.defense === 'object') {
      const def = effects.defense;
      for (const [type, value] of Object.entries(def)) {
        const percentage = (value as number) * 100;
        const key = `def${capitalizeFirst(type)}` as keyof GlobalBonuses;
        if (key in global) {
          global[key] += percentage;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: percentage,
            type: 'active-power',
          });
        }
      }
    }

    // Resistance from active powers
    if (effects.resistance && typeof effects.resistance === 'object') {
      const res = effects.resistance;
      for (const [type, value] of Object.entries(res)) {
        const percentage = (value as number) * 100;
        const key = `res${capitalizeFirst(type)}` as keyof GlobalBonuses;
        if (key in global) {
          global[key] += percentage;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: percentage,
            type: 'active-power',
          });
        }
      }
    }

    // Movement
    if (effects.runSpeed !== undefined) {
      const value = extractScaleValue(effects.runSpeed) * 100;
      global.runSpeed += value;
      addToBreakdown(breakdown, 'runSpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.flySpeed !== undefined) {
      const value = extractScaleValue(effects.flySpeed) * 100;
      global.flySpeed += value;
      addToBreakdown(breakdown, 'flySpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.jumpHeight !== undefined) {
      const value = extractScaleValue(effects.jumpHeight) * 100;
      global.jumpHeight += value;
      addToBreakdown(breakdown, 'jumpHeight', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }
  }
}

function extractScaleValue(effect: number | { scale: number } | undefined): number {
  if (effect === undefined) return 0;
  if (typeof effect === 'number') return effect;
  return effect.scale || 0;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addToBreakdown(
  breakdown: Map<string, DashboardStatBreakdown>,
  stat: string,
  source: StatSource
): void {
  if (!breakdown.has(stat)) {
    breakdown.set(stat, {
      total: 0,
      base: 0,
      sources: [],
      cappedSources: 0,
    });
  }
  const entry = breakdown.get(stat)!;
  entry.sources.push(source);
  entry.total += source.value;
  if (source.capped) entry.cappedSources++;
}

// ============================================
// CONVERT TO CHARACTER STATS
// ============================================

/**
 * Convert global bonuses to character stats format for dashboard
 */
function convertToCharacterStats(global: GlobalBonuses): CharacterStats {
  const stats = createEmptyStats();

  // Offense
  stats.damage = global.damage;
  stats.accuracy = global.accuracy;
  stats.tohit = global.toHit;
  stats.recharge = global.recharge;
  stats.endrdx = global.endurance;

  // Defense positional
  stats.defMelee = global.defMelee;
  stats.defRanged = global.defRanged;
  stats.defAoE = global.defAoE;

  // Defense typed (combined S/L, F/C, E/N)
  stats.defSL = Math.max(global.defSmashing, global.defLethal);
  stats.defFC = Math.max(global.defFire, global.defCold);
  stats.defEN = Math.max(global.defEnergy, global.defNegative);
  stats.defPsionic = global.defPsionic;
  stats.defToxic = global.defToxic;

  // Resistance typed (combined)
  stats.resSL = Math.max(global.resSmashing, global.resLethal);
  stats.resFC = Math.max(global.resFire, global.resCold);
  stats.resEN = Math.max(global.resEnergy, global.resNegative);
  stats.resPsionic = global.resPsionic;
  stats.resToxic = global.resToxic;

  // Recovery & Health
  stats.regeneration = global.regeneration;
  stats.recovery = global.recovery;
  stats.maxhp = global.maxHP;
  stats.maxend = global.maxEndurance;

  // Movement
  stats.runspeed = global.runSpeed;
  stats.flyspeed = global.flySpeed;
  stats.jumpheight = global.jumpHeight;

  return stats;
}

// ============================================
// MAIN CALCULATION
// ============================================

/**
 * Collect all powers from build for bonus calculation
 */
function collectAllPowers(build: Build): PowerWithToggle[] {
  const powers: PowerWithToggle[] = [];

  // Primary powers
  for (const power of build.primary.powers) {
    powers.push(power as unknown as PowerWithToggle);
  }

  // Secondary powers
  for (const power of build.secondary.powers) {
    powers.push(power as unknown as PowerWithToggle);
  }

  // Pool powers
  for (const pool of build.pools) {
    for (const power of pool.powers) {
      powers.push(power as unknown as PowerWithToggle);
    }
  }

  // Epic pool
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      powers.push(power as unknown as PowerWithToggle);
    }
  }

  return powers;
}

/**
 * Convert Build to BuildPowers format for set bonus calculation
 */
function buildToBuildPowers(build: Build): BuildPowers {
  return {
    primary: { powers: build.primary.powers },
    secondary: { powers: build.secondary.powers },
    pools: build.pools.map((pool) => ({ powers: pool.powers })),
    epicPool: build.epicPool ? { powers: build.epicPool.powers } : undefined,
  };
}

/**
 * Main calculation function - calculates all character stats
 * @param build - The current build state
 * @param exemplarMode - When true, respects build level for set bonus suppression.
 *                       When false (default), always calculates as if at level 50.
 */
export function calculateCharacterTotals(
  build: Build,
  exemplarMode = false
): CharacterCalculationResult {
  const breakdown = new Map<string, DashboardStatBreakdown>();
  const globalBonuses = createEmptyGlobalBonuses();

  // Step 1: Calculate set bonuses with Rule of 5
  // In exemplar mode, use build level; otherwise always use 50
  const effectiveLevel = exemplarMode ? build.level : 50;
  const buildPowers = buildToBuildPowers(build);
  const { bonuses: setBonusAggregated, tracking } = calculateSetBonuses(
    buildPowers,
    getIOSet,
    build.exemplarLevel ?? undefined,
    effectiveLevel
  );


  // Step 2: Apply set bonuses to global bonuses
  applySetBonusesToGlobal(setBonusAggregated, globalBonuses);

  // Step 3: Build detailed breakdown from set bonus tracking
  for (const stat of Object.keys(setBonusAggregated)) {
    const statBreakdownItems = getStatBreakdown(tracking, stat);
    if (statBreakdownItems.length > 0) {
      const built = buildStatBreakdown(statBreakdownItems);
      // Merge into existing breakdown if there are other sources
      const existing = breakdown.get(stat);
      if (existing) {
        existing.sources.push(...built.sources);
        existing.total += built.total;
        existing.cappedSources += built.cappedSources;
      } else {
        breakdown.set(stat, built);
      }
    }
  }

  // Step 4: Collect all powers
  const allPowers = collectAllPowers(build);

  // Step 5: Apply inherent power bonuses (Fitness, etc.)
  // Note: Inherent powers would need to be added to the build state
  // For now, we skip this as they're not in the current build structure

  // Step 6: Apply active toggle power bonuses
  applyActivePowerBonuses(allPowers, globalBonuses, breakdown);

  // Step 7: Convert to character stats format
  const stats = convertToCharacterStats(globalBonuses);

  // Update breakdown totals from final values
  for (const [, bd] of breakdown) {
    bd.total = bd.sources.reduce((sum, s) => sum + s.value, 0);
  }

  return {
    stats,
    globalBonuses,
    breakdown,
    setBonuses: setBonusAggregated,
  };
}

/**
 * Get breakdown for a specific stat
 */
export function getBreakdownForStat(
  result: CharacterCalculationResult,
  stat: string
): DashboardStatBreakdown | undefined {
  return result.breakdown.get(stat);
}

/**
 * Check if a stat has any bonuses
 */
export function hasStatBonuses(
  result: CharacterCalculationResult,
  stat: string
): boolean {
  const bd = result.breakdown.get(stat);
  return bd !== undefined && bd.sources.length > 0;
}
