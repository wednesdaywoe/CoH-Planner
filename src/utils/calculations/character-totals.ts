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

import type { Build, Accolade, Enhancement, IncarnateActiveState, IncarnateBuildState, IOSetEnhancement } from '@/types';
import type { ProcSettings } from '@/stores/uiStore';
import { getIOSet, getAlphaEffects, getDestinyEffects, getHybridEffects, getLoreEffects, findProcData, parseProcEffect, isProcAlwaysOn, calculateAutoToggleProcsPerMinute, calculateProcChance, arcToDegrees } from '@/data';
import { getTableValue } from '@/data/at-tables';
import { getBaseToHit, getCombatModifier } from '@/data/purple-patch';
import { getPowerPool } from '@/data/power-pools';
import { getEpicPool } from '@/data/epic-pools';
import { getPowerset } from '@/data/powersets';
import {
  calculateSetBonuses,
  getStatBreakdown,
  trackBonus,
  createBonusTracking,
  type AggregatedBonuses,
  type BonusTracking,
  type StatBreakdownItem,
  type BuildPowers,
} from './set-bonuses';
import {
  createEmptyStats,
  type CharacterStats,
} from './stats';
import {
  calculatePowerEnhancementBonuses,
  BASE_RECOVERY_RATE,
  BASE_REGEN_RATE,
  type EnhancementBonuses,
} from './enhancement-values';
import { calculateVigilanceDamageBonus, calculateFuryDamageBonus } from './inherents';
import {
  isCalcDebugEnabled,
  debugBuildContext,
  debugSetBonuses,
  debugAlphaBonuses,
  debugGroup,
  debugGroupEnd,
  debugFitnessPower,
  debugFormula,
  debugAccolade,
  debugHitChance,
  debugFinalStats,
  debugNetEndurance,
  debugEnd,
} from '@/utils/calc-debug';

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
  jumpSpeed: number;
  flySpeed: number;
  // Mez Resistance (generic, from IO set bonuses — applies to all types)
  mezResist: number;
  // Per-type mez resistance (from active power effects)
  mezResistHold: number;
  mezResistStun: number;
  mezResistImmobilize: number;
  mezResistSleep: number;
  mezResistConfuse: number;
  mezResistFear: number;
  mezResistKnockback: number;
  // Mez Protection (magnitude points)
  protHold: number;
  protStun: number;
  protImmobilize: number;
  protSleep: number;
  protConfuse: number;
  protFear: number;
  protKnockback: number;
  // Debuff Resistance
  debuffResistSlow: number;
  debuffResistDefense: number;
  debuffResistRecharge: number;
  debuffResistEndurance: number;
  debuffResistRecovery: number;
  debuffResistToHit: number;
  debuffResistRegeneration: number;
  debuffResistPerception: number;
  // Special
  healOther: number;
  threatLevel: number;
  // Stealth
  stealthRadiusPvE: number;
  stealthRadiusPvP: number;
  perceptionRadius: number;
  // Additional mez protection
  protRepel: number;
  protTeleport: number;
  // Additional mez resistance
  mezResistTaunt: number;
  mezResistPlacate: number;
  // Incarnate
  levelShift: number;
  // Toggle endurance cost (end/sec from active toggles)
  toggleEndCost: number;
  // Endurance discount from powers like Conserve Power (reduces end costs by this %)
  enduranceDiscount: number;
  // Net endurance per second (recovery minus toggle costs)
  netEndPerSec: number;
  // Purple patch - hit chance against target level
  baseToHit: number;
  hitChance: number;
  combatModifier: number;
}

/**
 * Source of a stat contribution for breakdown
 */
export interface StatSource {
  name: string;
  value: number;
  type: 'set-bonus' | 'active-power' | 'inherent' | 'enhancement' | 'accolade' | 'incarnate' | 'proc';
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
  /** Raw Rule of 5 tracking — use getBonusCount/isBonusCapped to query */
  bonusTracking: BonusTracking;
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
    jumpSpeed: 0,
    flySpeed: 0,
    mezResist: 0,
    mezResistHold: 0,
    mezResistStun: 0,
    mezResistImmobilize: 0,
    mezResistSleep: 0,
    mezResistConfuse: 0,
    mezResistFear: 0,
    mezResistKnockback: 0,
    protHold: 0,
    protStun: 0,
    protImmobilize: 0,
    protSleep: 0,
    protConfuse: 0,
    protFear: 0,
    protKnockback: 0,
    debuffResistSlow: 0,
    debuffResistDefense: 0,
    debuffResistRecharge: 0,
    debuffResistEndurance: 0,
    debuffResistRecovery: 0,
    debuffResistToHit: 0,
    debuffResistRegeneration: 0,
    debuffResistPerception: 0,
    healOther: 0,
    threatLevel: 0,
    stealthRadiusPvE: 0,
    stealthRadiusPvP: 0,
    perceptionRadius: 0,
    protRepel: 0,
    protTeleport: 0,
    mezResistTaunt: 0,
    mezResistPlacate: 0,
    levelShift: 0,
    toggleEndCost: 0,
    enduranceDiscount: 0,
    netEndPerSec: 0,
    baseToHit: 0.75,
    hitChance: 0.75,
    combatModifier: 1.0,
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

  // Mez Protection (from IO set bonuses — value is stored as %, divide by 100 for mag)
  kbprotection: 'protKnockback',

  // Debuff Resistance (from IO set bonuses)
  debuffresistrecharge: 'debuffResistRecharge',
  debuffresistslow: 'debuffResistSlow',

  // Knockback Resistance (from IO set bonuses)
  kbresistance: 'mezResistKnockback',
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
  // +Res(Recharge Debuff) set bonuses also provide Slow resistance
  debuffresistrecharge: ['debuffResistRecharge', 'debuffResistSlow'],
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
        // IO set KB protection is stored as percentage (400 = Mag 4.0)
        const scale = normalizedStat === 'kbprotection' ? 0.01 : 1;
        global[key] += value * scale;
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
    // Counted sources (first 5) — these are active and NOT capped
    for (const sourceName of item.sources) {
      sources.push({
        name: sourceName,
        value: item.value,
        type: 'set-bonus',
        capped: false,
      });
    }

    // Rejected sources (6th+) — these exceeded the Rule of 5 and are NOT counted
    for (const sourceName of item.rejectedSources) {
      sources.push({
        name: sourceName,
        value: item.value,
        type: 'set-bonus',
        capped: true,
      });
      cappedCount++;
    }

    total += item.total;
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

type ScalarOrScaled = number | { scale: number; table?: string };
type MezScaled = { mag?: number; scale: number; table: string };

/**
 * Adjust a scaled effect for per-target stacking.
 * If the effect has a perTarget field and targetsHit > 1, adjusts the scale.
 * Returns the original value for non-per-target effects.
 */
function adjustForPerTarget(value: ScalarOrScaled, targetsHit?: number): ScalarOrScaled {
  if (!targetsHit || targetsHit <= 1) return value;
  if (typeof value !== 'object' || value === null) return value;
  const obj = value as { scale: number; table?: string; perTarget?: number };
  if (!obj.perTarget) return value;
  return { ...value, scale: value.scale + obj.perTarget * (targetsHit - 1) };
}

/**
 * Combined stacking adjustment: applies perTarget AoE math (existing behavior)
 * and, when the effect key is listed in `effects.stacksLinear`, multiplies
 * scale by stack count for linear self-stacking powers (e.g. Psychokinetic
 * Barrier's debuff resistance). Effects not in stacksLinear are unaffected.
 */
function adjustForStacking(
  value: ScalarOrScaled,
  targetsHit: number | undefined,
  stacksLinear: readonly string[] | undefined,
  effectKey: string,
): ScalarOrScaled {
  const adjusted = adjustForPerTarget(value, targetsHit);
  if (!targetsHit || targetsHit <= 1) return adjusted;
  if (!stacksLinear || !stacksLinear.includes(effectKey)) return adjusted;
  if (typeof adjusted !== 'object' || adjusted === null) return adjusted;
  const obj = adjusted as { scale: number };
  return { ...adjusted, scale: obj.scale * targetsHit };
}

interface ActivePowerEffect {
  tohitBuff?: number;
  damageBuff?: number;
  rechargeBuff?: ScalarOrScaled;
  defense?: Record<string, ScalarOrScaled>;
  defenseBuff?: Record<string, ScalarOrScaled>;
  defenseBuffExcludesSelf?: boolean;
  defenseBuffSuppressible?: Record<string, ScalarOrScaled>;
  resistance?: Record<string, ScalarOrScaled>;
  debuffResistance?: Record<string, ScalarOrScaled>;
  mezResistance?: Record<string, ScalarOrScaled>;
  elusivity?: Record<string, ScalarOrScaled>;
  runSpeed?: number;
  flySpeed?: number;
  jumpHeight?: number;
  jumpSpeed?: number;
  regeneration?: ScalarOrScaled;
  recovery?: ScalarOrScaled;
  maxEndurance?: ScalarOrScaled;
  maxHealth?: ScalarOrScaled;
  regenBuff?: ScalarOrScaled;
  regenBuffUnenhanced?: ScalarOrScaled;
  recoveryBuff?: ScalarOrScaled;
  maxHPBuff?: ScalarOrScaled;
  maxEndBuff?: ScalarOrScaled;
  // Effect targeting (SingleTarget, AoE, etc.)
  effectArea?: string;
  // Mez protection (pool/epic style — direct magnitudes)
  protection?: Record<string, number>;
  // Mez effects that may be protection when using Res_Boolean tables
  hold?: number | MezScaled;
  stun?: number | MezScaled;
  immobilize?: number | MezScaled;
  sleep?: number | MezScaled;
  confuse?: number | MezScaled;
  fear?: number | MezScaled;
  knockback?: number | MezScaled;
  // Additional status effects
  repel?: ScalarOrScaled;
  teleport?: ScalarOrScaled;
  taunt?: number | MezScaled;
  placate?: number | MezScaled;
  // Stealth
  stealth?: {
    stealthPvE?: ScalarOrScaled;
    stealthPvP?: ScalarOrScaled;
  };
  // Perception
  perceptionBuff?: ScalarOrScaled;
  // Endurance cost per second (for toggles)
  enduranceCost?: number;
  // Endurance discount (e.g., Conserve Power — reduces end costs by a percentage)
  enduranceDiscount?: ScalarOrScaled;
  // Self-debuffs (e.g., Granite Armor) — only applied when selfPenalty is true
  // Most powers with these fields target enemies, not the caster
  selfPenalty?: boolean;
  tohitDebuff?: ScalarOrScaled;
  slow?: ScalarOrScaled | Record<string, ScalarOrScaled>;
  movement?: Record<string, ScalarOrScaled>;
  rechargeDebuff?: ScalarOrScaled;
  damageDebuff?: ScalarOrScaled;
  /** Linear self-stacking metadata — see PowerEffects.stacksLinear */
  stacksLinear?: readonly string[];
}

interface PowerWithToggle {
  name: string;
  internalName: string;
  powerType?: string;
  targetType?: string;
  effectArea?: string;
  isActive?: boolean;
  effects?: ActivePowerEffect;
  slots?: (Enhancement | null)[];
  stats?: { endurance?: number; activatePeriod?: number; [key: string]: unknown };
}

/** targetType values where the power cannot be cast on self — the buff goes
 *  to allies only and must not contribute to the caster's totals. Covers
 *  every ally-target string we've seen in HC and Rebirth bin exports plus
 *  the legacy "Ally"/"Ally (Alive)"/"Teammate" labels Mids data uses.
 *  Powers that auto-apply to the caster (Recovery Aura, Regeneration Aura,
 *  Farsight, etc.) are tagged Self and are unaffected. */
const ALLY_ONLY_TARGET_TYPES = new Set([
  'ally',
  'ally (alive)',
  'teammate',
  'dead teammate',
  'friend',
  'deadplayerfriend',
  'deadoraliveleaguemate',
]);

/**
 * Apply bonuses from active toggle powers
 * Enhancement bonuses are now factored in to boost the base power values
 * Alpha incarnate bonuses are added to the enhancement bonuses for applicable aspects
 */
function applyActivePowerBonuses(
  powers: PowerWithToggle[],
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  buildLevel: number,
  archetypeId: string,
  alphaBonuses: EnhancementBonuses = {},
  targetsHitValues: Record<string, number> = {},
  exemplarLevel?: number,
  combatMode?: boolean
): void {
  for (const power of powers) {
    // Auto powers are always active; others require explicit isActive toggle
    const isAuto = power.powerType?.toLowerCase() === 'auto';
    if (!(isAuto || power.isActive)) continue;

    // Skip ally-only buffs — the caster does not benefit from these
    // (e.g. Speed Boost, Fortitude — "you cannot use this power on yourself")
    if (power.targetType && ALLY_ONLY_TARGET_TYPES.has(power.targetType.toLowerCase())) continue;

    // Calculate enhancement bonuses for this power from slotted enhancements
    let enhBonuses: EnhancementBonuses = {};
    if (power.slots && power.slots.length > 0) {
      enhBonuses = calculatePowerEnhancementBonuses(
        { name: power.name, slots: power.slots },
        buildLevel,
        getIOSet,
        exemplarLevel
      );
    }

    // Add Alpha incarnate enhancement bonuses (these apply universally to all powers)
    // Alpha bonuses are additive with slotted enhancement bonuses
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) {
        enhBonuses[aspect] = (enhBonuses[aspect] || 0) + value;
      }
    }

    // Track toggle endurance cost for active toggle powers.
    // Runs before the `!power.effects` bail-out below: most primary/secondary toggles
    // have no `effects` block (only `stats`), but still draw endurance per second.
    if (power.powerType?.toLowerCase() === 'toggle' && power.isActive) {
      // Pool/epic powers: effects.enduranceCost is already per-second (converted at transform)
      // Primary/secondary powers: stats.endurance is per-tick, divide by activatePeriod
      let baseEndPerSec = 0;
      if (power.effects?.enduranceCost) {
        baseEndPerSec = power.effects.enduranceCost;
      } else if (power.stats?.endurance) {
        const activatePeriod = power.stats.activatePeriod ?? 0.5;
        baseEndPerSec = activatePeriod > 0 ? power.stats.endurance / activatePeriod : 0;
      }
      if (baseEndPerSec > 0) {
        // EnduranceReduction enhancement reduces the cost
        const endRedBonus = enhBonuses.endurance || 0;
        const actualCost = baseEndPerSec * (1 / (1 + endRedBonus));
        global.toggleEndCost += actualCost;
        addToBreakdown(breakdown, 'toggleEndCost', {
          name: power.name,
          value: actualCost,
          type: 'active-power',
        });
      }
    }

    if (!power.effects) continue;

    const effects = power.effects;
    const _debugEnabled = isCalcDebugEnabled();
    // Snapshot global bonuses before this power for diff logging
    const _debugBefore = _debugEnabled ? { ...global } : null;

    // ToHit buff (stored as decimal, convert to percentage)
    // Enhanced by ToHit enhancements
    if (effects.tohitBuff !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.tohit || 0);
      const adjustedBuff = adjustForStacking(effects.tohitBuff as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'tohitBuff');
      const value = resolveScaledEffect(adjustedBuff, archetypeId, buildLevel) * 100 * enhMultiplier;
      global.toHit += value;
      addToBreakdown(breakdown, 'toHit', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Damage buff
    // Enhanced by Damage enhancements
    if (effects.damageBuff !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.damage || 0);
      const adjustedBuff = adjustForStacking(effects.damageBuff as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'damageBuff');
      const value = resolveScaledEffect(adjustedBuff, archetypeId, buildLevel) * 100 * enhMultiplier;
      global.damage += value;
      addToBreakdown(breakdown, 'damage', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Damage debuff (self-penalty, e.g. Granite Armor -30% damage)
    // Only applied when selfPenalty flag is set — most damageDebuff effects target enemies
    // Unenhanceable — self-debuffs are not boosted by slotted enhancements
    // Skip crash debuffs: if a power also has damageBuff, the debuff is a crash effect
    // (e.g., Rage: 120s buff + 10s crash) and should not count as sustained damage
    if (effects.selfPenalty && effects.damageDebuff !== undefined && effects.damageBuff === undefined) {
      const value = resolveScaledEffect(effects.damageDebuff as ScalarOrScaled, archetypeId, buildLevel) * -100;
      global.damage += value;
      addToBreakdown(breakdown, 'damage', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Defense from active powers
    // Enhanced by Defense enhancements
    // Power data uses either "defense" or "defenseBuff" key for defense effects
    // Skip defenseBuff when defenseBuffExcludesSelf is set (e.g., Grant Cover — team only)
    const defenseEffects = effects.defense || (!effects.defenseBuffExcludesSelf ? effects.defenseBuff : undefined);
    if (defenseEffects && typeof defenseEffects === 'object') {
      const enhMultiplier = 1 + (enhBonuses.defense || enhBonuses.defenseBuff || 0);
      for (const [type, value] of Object.entries(defenseEffects)) {
        const adjustedDef = adjustForStacking(value, targetsHitValues[power.internalName], effects.stacksLinear, 'defenseBuff');
        const percentage = resolveScaledEffect(adjustedDef, archetypeId, buildLevel) * 100 * enhMultiplier;
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

    // Suppressible defense from stealth/travel powers (skipped in combat mode)
    if (!combatMode && effects.defenseBuffSuppressible && typeof effects.defenseBuffSuppressible === 'object') {
      const enhMultiplier = 1 + (enhBonuses.defense || enhBonuses.defenseBuff || 0);
      for (const [type, value] of Object.entries(effects.defenseBuffSuppressible)) {
        const adjustedDef = adjustForStacking(value, targetsHitValues[power.internalName], effects.stacksLinear, 'defenseBuff');
        const percentage = resolveScaledEffect(adjustedDef, archetypeId, buildLevel) * 100 * enhMultiplier;
        const key = `def${capitalizeFirst(type)}` as keyof GlobalBonuses;
        if (key in global) {
          global[key] += percentage;
          addToBreakdown(breakdown, key, {
            name: `${power.name} (suppressible)`,
            value: percentage,
            type: 'active-power',
          });
        }
      }
    }

    // Resistance from active powers
    // Enhanced by Resistance enhancements
    if (effects.resistance && typeof effects.resistance === 'object') {
      const res = effects.resistance;
      const enhMultiplier = 1 + (enhBonuses.resistance || 0);
      for (const [type, value] of Object.entries(res)) {
        const adjustedRes = adjustForStacking(value, targetsHitValues[power.internalName], effects.stacksLinear, 'resistance');
        const percentage = resolveScaledEffect(adjustedRes, archetypeId, buildLevel) * 100 * enhMultiplier;
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

    // Debuff Resistance from active powers
    // Defense Debuff Resistance is enhanced by Defense enhancements
    if (effects.debuffResistance && typeof effects.debuffResistance === 'object') {
      const debuffRes = effects.debuffResistance;
      // Map debuff resistance types to global bonus keys
      const debuffResMapping: Record<string, keyof GlobalBonuses> = {
        movement: 'debuffResistSlow',
        defense: 'debuffResistDefense',
        recharge: 'debuffResistRecharge',
        endurance: 'debuffResistEndurance',
        recovery: 'debuffResistRecovery',
        tohit: 'debuffResistToHit',
        regeneration: 'debuffResistRegeneration',
        perception: 'debuffResistPerception',
      };
      // Enhancement type that boosts each debuff resistance type
      const debuffResEnhMapping: Record<string, string> = {
        defense: 'defense',
      };

      for (const [type, value] of Object.entries(debuffRes)) {
        const typeLower = type.toLowerCase();
        const enhKey = debuffResEnhMapping[typeLower];
        const enhMultiplier = enhKey ? 1 + (enhBonuses[enhKey] || 0) : 1;
        const stackedValue = adjustForStacking(
          value,
          targetsHitValues[power.internalName],
          effects.stacksLinear,
          'debuffResistance',
        );
        const percentage = resolveScaledEffect(stackedValue, archetypeId, buildLevel) * 100 * enhMultiplier;
        const key = debuffResMapping[typeLower];
        if (key && key in global) {
          global[key] += percentage;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: percentage,
            type: 'active-power',
          });
        }
      }
    }

    // Mez Resistance from active powers (e.g., Acrobatics Hold resistance)
    // Enhanced by the corresponding mez type enhancement (Hold enhancements for Hold resistance, etc.)
    // Stored as mezResistance: { hold: { scale, table }, ... }
    if (effects.mezResistance && typeof effects.mezResistance === 'object') {
      const mezResMapping: Record<string, keyof GlobalBonuses> = {
        hold: 'mezResistHold',
        stun: 'mezResistStun',
        immobilize: 'mezResistImmobilize',
        sleep: 'mezResistSleep',
        confuse: 'mezResistConfuse',
        fear: 'mezResistFear',
        knockback: 'mezResistKnockback',
      };
      for (const [type, value] of Object.entries(effects.mezResistance as Record<string, ScalarOrScaled>)) {
        const typeLower = type.toLowerCase();
        // Mez resistance is enhanced by the matching mez enhancement type
        const enhMultiplier = 1 + (enhBonuses[typeLower] || 0);
        const percentage = resolveScaledEffect(value, archetypeId, buildLevel) * 100 * enhMultiplier;
        const key = mezResMapping[typeLower];
        if (key && key in global) {
          global[key] += percentage;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: percentage,
            type: 'active-power',
          });
        }
      }
    }

    // Elusivity (Defense Debuff Resistance)
    // Super Reflexes, Shield Defense, etc. — stored as elusivity.all or per-type
    // Enhanced by Defense enhancements
    if (effects.elusivity && typeof effects.elusivity === 'object') {
      const enhMultiplier = 1 + (enhBonuses.defense || enhBonuses.defenseBuff || 0);
      const elusivity = effects.elusivity as Record<string, ScalarOrScaled>;
      for (const [, value] of Object.entries(elusivity)) {
        // Both 'all' and specific types (smashing, lethal, etc.) contribute to defense debuff resistance
        const percentage = resolveScaledEffect(value, archetypeId, buildLevel) * 100 * enhMultiplier;
        if (percentage > 0) {
          global.debuffResistDefense += percentage;
          addToBreakdown(breakdown, 'debuffResistDefense', {
            name: power.name,
            value: percentage,
            type: 'active-power',
          });
        }
      }
    }

    // Movement (top-level scalar form). Stack-aware.
    if (effects.runSpeed !== undefined) {
      const adjusted = adjustForStacking(effects.runSpeed as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'runSpeed');
      const value = extractScaleValue(adjusted) * 100;
      global.runSpeed += value;
      addToBreakdown(breakdown, 'runSpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.flySpeed !== undefined) {
      const adjusted = adjustForStacking(effects.flySpeed as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'flySpeed');
      const value = extractScaleValue(adjusted) * 100;
      global.flySpeed += value;
      addToBreakdown(breakdown, 'flySpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.jumpHeight !== undefined) {
      const adjusted = adjustForStacking(effects.jumpHeight as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'jumpHeight');
      const value = extractScaleValue(adjusted) * 100;
      global.jumpHeight += value;
      addToBreakdown(breakdown, 'jumpHeight', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.jumpSpeed !== undefined) {
      const adjusted = adjustForStacking(effects.jumpSpeed as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'jumpSpeed');
      const value = extractScaleValue(adjusted) * 100;
      global.jumpSpeed += value;
      addToBreakdown(breakdown, 'jumpSpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Movement buffs (new format — e.g., Lightning Reflexes, Reaction Time)
    // Skip when the power also has tohitDebuff or damageDebuff — those indicate
    // enemy-targeting debuff auras (e.g., Time's Juncture) where movement is a
    // foe slow, not a self-buff
    if (effects.movement && typeof effects.movement === 'object' &&
        effects.tohitDebuff === undefined && effects.damageDebuff === undefined) {
      const movementKeyMap: Record<string, keyof GlobalBonuses> = {
        runSpeed: 'runSpeed',
        flySpeed: 'flySpeed',
        fly: 'flySpeed',
        jumpHeight: 'jumpHeight',
        jumpSpeed: 'jumpSpeed',
      };
      for (const [type, val] of Object.entries(effects.movement)) {
        const key = movementKeyMap[type];
        if (key && key in global) {
          // Stack-aware: stacksLinear uses the bare effect key (e.g. 'runSpeed'),
          // matching what classifyTemplateForStacking produces.
          const adjusted = adjustForStacking(val as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, type);
          const value = resolveScaledEffect(adjusted, archetypeId, buildLevel) * 100;
          global[key] += value;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value,
            type: 'active-power',
          });
        }
      }
    }

    // Movement debuffs / slow (self-penalty, e.g. Granite Armor -70% run speed)
    // Only applied when selfPenalty flag is set — most slow effects target enemies
    // Unenhanceable — self-slows are not boosted by slotted enhancements
    if (effects.selfPenalty && effects.slow && typeof effects.slow === 'object') {
      const slowKeyMap: Record<string, keyof GlobalBonuses> = {
        runSpeed: 'runSpeed',
        flySpeed: 'flySpeed',
        fly: 'flySpeed',
        jumpHeight: 'jumpHeight',
        jumpSpeed: 'jumpSpeed',
      };
      for (const [type, val] of Object.entries(effects.slow)) {
        const key = slowKeyMap[type];
        if (key && key in global) {
          const value = resolveScaledEffect(val as ScalarOrScaled, archetypeId, buildLevel) * -100;
          global[key] += value;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value,
            type: 'active-power',
          });
        }
      }
    }

    // Recharge buff
    // NOT enhanced by Recharge enhancements — recharge enhancements reduce the
    // power's own recharge time, they don't boost the recharge speed buff value
    if (effects.rechargeBuff !== undefined) {
      const adjusted = adjustForStacking(effects.rechargeBuff, targetsHitValues[power.internalName], effects.stacksLinear, 'rechargeBuff');
      const value = extractScaleValue(adjusted) * 100;
      global.recharge += value;
      addToBreakdown(breakdown, 'recharge', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Recharge debuff (self-penalty, e.g. Granite Armor -65% recharge)
    // Only applied when selfPenalty flag is set — most rechargeDebuff effects target enemies
    // Unenhanceable — self-debuffs are not boosted by slotted enhancements
    if (effects.selfPenalty && effects.rechargeDebuff !== undefined) {
      const value = resolveScaledEffect(effects.rechargeDebuff as ScalarOrScaled, archetypeId, buildLevel) * -100;
      global.recharge += value;
      addToBreakdown(breakdown, 'recharge', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Regeneration buff
    // Enhanced by Healing enhancements
    // Skip Res_Boolean tables — those are regen debuff resistance, not regen buffs
    if (effects.regenBuff !== undefined) {
      const regenVal = effects.regenBuff as ScalarOrScaled;
      const regenTable = (typeof regenVal === 'object' && regenVal !== null && 'table' in regenVal)
        ? (regenVal as { table?: string }).table ?? ''
        : '';
      if (!regenTable.toLowerCase().includes('res_boolean')) {
        const enhMultiplier = 1 + (enhBonuses.heal || 0);
        const adjustedRegen = adjustForStacking(regenVal, targetsHitValues[power.internalName], effects.stacksLinear, 'regenBuff');
        const value = resolveScaledEffect(adjustedRegen, archetypeId, buildLevel) * 100 * enhMultiplier;
        // If the power also has an unenhanced portion, combine into one breakdown entry
        const adjustedRegenUnenh = effects.regenBuffUnenhanced !== undefined
          ? adjustForStacking(effects.regenBuffUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'regenBuffUnenhanced')
          : undefined;
        const unenhValue = adjustedRegenUnenh !== undefined
          ? resolveScaledEffect(adjustedRegenUnenh, archetypeId, buildLevel) * 100
          : 0;
        const totalValue = value + unenhValue;
        global.regeneration += totalValue;
        addToBreakdown(breakdown, 'regeneration', {
          name: power.name,
          value: totalValue,
          type: 'active-power',
        });
      }
    } else if (effects.regenBuffUnenhanced !== undefined) {
      // Power only has unenhanceable regen (no enhanceable portion)
      const adjustedUnenhOnly = adjustForStacking(effects.regenBuffUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'regenBuffUnenhanced');
      const value = resolveScaledEffect(adjustedUnenhOnly, archetypeId, buildLevel) * 100;
      global.regeneration += value;
      addToBreakdown(breakdown, 'regeneration', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Recovery buff
    // Enhanced by Endurance Modification enhancements
    // Skip Res_Boolean tables — those are endurance drain resistance, not recovery buffs
    if (effects.recoveryBuff !== undefined) {
      const recBuff = effects.recoveryBuff as ScalarOrScaled;
      const table = (typeof recBuff === 'object' && recBuff !== null && 'table' in recBuff)
        ? (recBuff as { table?: string }).table ?? ''
        : '';
      if (!table.toLowerCase().includes('res_boolean')) {
        const enhMultiplier = 1 + (enhBonuses.enduranceMod || 0);
        const adjustedRecovery = adjustForStacking(recBuff, targetsHitValues[power.internalName], effects.stacksLinear, 'recoveryBuff');
        const value = resolveScaledEffect(adjustedRecovery, archetypeId, buildLevel) * 100 * enhMultiplier;
        global.recovery += value;
        addToBreakdown(breakdown, 'recovery', {
          name: power.name,
          value,
          type: 'active-power',
        });
      }
    }

    // Max HP buff
    // Enhanced by Healing enhancements.
    //
    // MaxHP buffs use a flat 10% per scale point. The bin's
    // `Melee_HealSelf` reference is used by the engine for absolute-HP
    // bookkeeping (it's literally `baseMaxHP/10` for each AT) but the
    // displayed/applied buff is a percentage. Verified across the
    // canonical +HP powers:
    //   • Tanker  HPT: scale=2 → +20% (matches in-game)
    //   • Brute   Dull Pain (Second Wind): scale=2 → +20%
    //   • Brute   Earth's Embrace: scale=4 → +40%
    // The previous 5%/scale formula produced exactly half of each of
    // those numbers, which is what users were comparing against Mids
    // and seeing too low.
    if (effects.maxHPBuff !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.heal || 0);
      const scale = typeof effects.maxHPBuff === 'number'
        ? effects.maxHPBuff
        : effects.maxHPBuff.scale;
      const value = scale * 10 * enhMultiplier;
      global.maxHP += value;
      addToBreakdown(breakdown, 'maxHP', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Max Endurance buff
    // Enhanced by Endurance Modification enhancements
    // Scale values are already in absolute endurance points (e.g., scale 10 = +10 end)
    if (effects.maxEndBuff !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.enduranceMod || 0);
      const value = resolveScaledEffect(effects.maxEndBuff, archetypeId, buildLevel) * enhMultiplier;
      global.maxEndurance += value;
      addToBreakdown(breakdown, 'maxEndurance', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Endurance Discount (e.g., Conserve Power — reduces end costs by a percentage)
    // Stored as a scaled effect; the resolved value is a decimal (e.g., 0.6 = 60% discount)
    if (effects.enduranceDiscount !== undefined) {
      const discount = resolveScaledEffect(effects.enduranceDiscount, archetypeId, buildLevel) * 100;
      if (discount > 0) {
        global.enduranceDiscount += discount;
        addToBreakdown(breakdown, 'enduranceDiscount', {
          name: power.name,
          value: discount,
          type: 'active-power',
        });
      }
    }

    // Mez Protection from pool/epic powers (effects.protection = { hold: 1, stun: 1, ... })
    if (effects.protection && typeof effects.protection === 'object') {
      const protMapping: Record<string, keyof GlobalBonuses> = {
        hold: 'protHold',
        stun: 'protStun',
        immobilize: 'protImmobilize',
        sleep: 'protSleep',
        confuse: 'protConfuse',
        fear: 'protFear',
        knockback: 'protKnockback',
        knockup: 'protKnockback', // knockup maps to KB protection
      };
      for (const [type, mag] of Object.entries(effects.protection)) {
        const key = protMapping[type.toLowerCase()];
        if (key && key in global) {
          global[key] += mag;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: mag,
            type: 'active-power',
          });
        }
      }
    }

    // Mez Protection from curated armor powers (effects.hold/stun/etc. with Res_Boolean tables)
    // When mez effects use Res_Boolean tables, they represent protection, not offensive mez
    const mezProtTypes: Array<{ field: keyof ActivePowerEffect; key: keyof GlobalBonuses }> = [
      { field: 'hold', key: 'protHold' },
      { field: 'stun', key: 'protStun' },
      { field: 'immobilize', key: 'protImmobilize' },
      { field: 'sleep', key: 'protSleep' },
      { field: 'confuse', key: 'protConfuse' },
      { field: 'fear', key: 'protFear' },
      { field: 'knockback', key: 'protKnockback' },
    ];

    for (const { field, key } of mezProtTypes) {
      const mezVal = effects[field];
      if (mezVal === undefined || typeof mezVal === 'number') continue;
      const mez = mezVal as MezScaled;
      if (!mez.table) continue;
      const tableLower = mez.table.toLowerCase();
      const isResBoolean = tableLower.includes('res_boolean');
      // Knockback effects on SingleTarget Self-targeted powers are protection even without Res_Boolean
      // (e.g., Acrobatics uses Melee_Ones table for KB protection, Practiced Brawler is a Click)
      // AoE toggles like Repulsion Field and Hurricane are offensive KB, not protection
      const powerTypeLower = power.powerType?.toLowerCase();
      const isKbSelfProt = field === 'knockback' &&
        (effects.effectArea === 'SingleTarget' || power.effectArea === 'SingleTarget') &&
        (powerTypeLower === 'toggle' || powerTypeLower === 'auto' || powerTypeLower === 'click');
      if (isResBoolean || isKbSelfProt) {
        // Mez protection uses level 50 table values — protection magnitude is a fixed value
        // that doesn't scale down during leveling (matches Mids/in-game behavior)
        const tableValue = getTableValue(archetypeId, tableLower, 50);
        if (tableValue !== undefined) {
          let mag = Math.abs(mez.scale) * tableValue;
          // Knockback enhancements boost KB protection magnitude (per Acrobatics description)
          if (isKbSelfProt && !isResBoolean) {
            mag *= (1 + (enhBonuses.knockback || 0));
          }
          global[key] += mag;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: mag,
            type: 'active-power',
          });
        }
      }
    }

    // Repel Protection (e.g., Increase Density)
    if (effects.repel !== undefined) {
      const mag = Math.abs(resolveScaledEffect(effects.repel, archetypeId, buildLevel));
      if (mag > 0) {
        global.protRepel += mag;
        addToBreakdown(breakdown, 'protRepel', {
          name: power.name,
          value: mag,
          type: 'active-power',
        });
      }
    }

    // Teleport Protection (e.g., Increase Density)
    if (effects.teleport !== undefined) {
      const val = resolveScaledEffect(effects.teleport, archetypeId, buildLevel) * 100;
      if (val > 0) {
        global.protTeleport += val;
        addToBreakdown(breakdown, 'protTeleport', {
          name: power.name,
          value: val,
          type: 'active-power',
        });
      }
    }

    // Taunt Resistance (e.g., Leadership: Assault)
    if (effects.taunt !== undefined) {
      const mezVal = effects.taunt;
      if (typeof mezVal !== 'number') {
        const mez = mezVal as MezScaled;
        if (mez.table && mez.table.toLowerCase().includes('res_boolean')) {
          const tableValue = getTableValue(archetypeId, mez.table.toLowerCase(), buildLevel);
          if (tableValue !== undefined) {
            const mag = Math.abs(mez.scale) * tableValue * 100;
            global.mezResistTaunt += mag;
            addToBreakdown(breakdown, 'mezResistTaunt', {
              name: power.name,
              value: mag,
              type: 'active-power',
            });
          }
        }
      }
    }

    // Placate Resistance (e.g., Leadership: Assault)
    if (effects.placate !== undefined) {
      const mezVal = effects.placate;
      if (typeof mezVal !== 'number') {
        const mez = mezVal as MezScaled;
        if (mez.table && mez.table.toLowerCase().includes('res_boolean')) {
          const tableValue = getTableValue(archetypeId, mez.table.toLowerCase(), buildLevel);
          if (tableValue !== undefined) {
            const mag = Math.abs(mez.scale) * tableValue * 100;
            global.mezResistPlacate += mag;
            addToBreakdown(breakdown, 'mezResistPlacate', {
              name: power.name,
              value: mag,
              type: 'active-power',
            });
          }
        }
      }
    }

    // Stealth Radius — highest-source-wins, not additive. Per CoH game
    // mechanics, multiple stealth toggles (Stealth + Super Speed +
    // Infiltration etc.) do NOT stack their radii — only the largest
    // single source applies. Track contributors in the breakdown so the
    // user can see why the displayed total isn't the sum, but commit
    // only `Math.max` to the global stat.
    if (effects.stealth) {
      if (effects.stealth.stealthPvE !== undefined) {
        const val = resolveScaledEffect(effects.stealth.stealthPvE, archetypeId, buildLevel);
        if (val > 0) {
          global.stealthRadiusPvE = Math.max(global.stealthRadiusPvE, val);
          addToBreakdown(breakdown, 'stealthRadiusPvE', {
            name: power.name,
            value: val,
            type: 'active-power',
          });
        }
      }
      if (effects.stealth.stealthPvP !== undefined) {
        const val = resolveScaledEffect(effects.stealth.stealthPvP, archetypeId, buildLevel);
        if (val > 0) {
          global.stealthRadiusPvP = Math.max(global.stealthRadiusPvP, val);
          addToBreakdown(breakdown, 'stealthRadiusPvP', {
            name: power.name,
            value: val,
            type: 'active-power',
          });
        }
      }
    }

    // Perception Buff
    if (effects.perceptionBuff !== undefined) {
      const val = resolveScaledEffect(effects.perceptionBuff, archetypeId, buildLevel) * 100;
      if (val > 0) {
        global.perceptionRadius += val;
        addToBreakdown(breakdown, 'perceptionRadius', {
          name: power.name,
          value: val,
          type: 'active-power',
        });
      }
    }

    // Debug: log per-power diff with enhancement and alpha detail
    if (_debugEnabled && _debugBefore) {
      const diffs: { stat: string; value: number }[] = [];
      for (const key of Object.keys(global) as (keyof GlobalBonuses)[]) {
        const delta = global[key] - _debugBefore[key];
        if (Math.abs(delta) > 0.0001) {
          diffs.push({ stat: key, value: delta });
        }
      }
      // Only log powers that actually contributed something, or have enhancements worth showing
      const hasEnhBonuses = Object.values(enhBonuses).some(v => v !== undefined && Math.abs(v) > 0.0001);
      if (diffs.length > 0 || hasEnhBonuses) {
        debugGroup(`${power.name} (${power.powerType || 'unknown'}${power.isActive ? ', active' : ''})`);

        // Show enhancement bonuses applied to this power
        if (hasEnhBonuses) {
          debugGroup('Enhancement Bonuses (post-ED + Alpha)');
          for (const [aspect, val] of Object.entries(enhBonuses)) {
            if (val === undefined || Math.abs(val) < 0.0001) continue;
            const fromAlpha = alphaBonuses[aspect] ?? 0;
            const fromSlots = val - fromAlpha;
            let detail = `${aspect}: +${formatDebugNum(val * 100)}%`;
            if (fromAlpha > 0 && fromSlots > 0) {
              detail += ` (slots: ${formatDebugNum(fromSlots * 100)}% + alpha: ${formatDebugNum(fromAlpha * 100)}%)`;
            } else if (fromAlpha > 0) {
              detail += ` (alpha only)`;
            }
            debugFormula(detail);
          }
          debugGroupEnd();
        }

        // Show stat contributions
        if (diffs.length > 0) {
          debugGroup('Global Bonus Contributions');
          for (const d of diffs) {
            debugFormula(`${d.stat}: ${d.value > 0 ? '+' : ''}${formatDebugNum(d.value)}`);
          }
          debugGroupEnd();
        }

        debugGroupEnd();
      }
    }
  }
}

function formatDebugNum(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

function extractScaleValue(effect: ScalarOrScaled | undefined): number {
  if (effect === undefined) return 0;
  if (typeof effect === 'number') return effect;
  return effect.scale || 0;
}

/**
 * Resolve a ScaledEffect to its actual decimal value using AT tables.
 * For { scale: 3, table: "Melee_Res_Dmg" } with archetype "tanker" at level 50:
 *   → 3 × 0.10 = 0.30 (30% resistance)
 * For plain numbers, returns as-is.
 */
function resolveScaledEffect(
  effect: ScalarOrScaled | undefined,
  archetypeId: string,
  level: number,
  _debugContext?: string
): number {
  if (effect === undefined) return 0;
  if (typeof effect === 'number') return effect;
  if (effect.table) {
    // "Ones" tables (Melee_Ones, Ranged_Ones) are constant 1.0 for all ATs
    if (effect.table.toLowerCase().endsWith('_ones')) {
      return effect.scale * 1.0;
    }
    const tableValue = getTableValue(archetypeId, effect.table.toLowerCase(), level);
    if (tableValue !== undefined) {
      return effect.scale * tableValue;
    }
  }
  // Fallback: use a default multiplier of 0.10 for resistance/defense tables
  if (effect.table) {
    console.warn(`[character-totals] AT table not found: "${effect.table}" for archetype "${archetypeId}" — using fallback 0.10`);
  }
  return effect.scale * 0.10;
}

function capitalizeFirst(str: string): string {
  if (str.toLowerCase() === 'aoe') return 'AoE';
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
// FITNESS POWER PROCESSING
// ============================================

/**
 * Fitness power effects derived from INHERENT_FITNESS_POWERS scale data (levels.ts).
 * Each value = scale × 100 (percentage buff).
 *
 * Movement effects (runSpeed, flySpeed, jumpHeight) display as scale × 100 because
 * the speed tables (Melee_SpeedRunning, Melee_Leap, etc.) convert to ft/s for the
 * game physics engine, not for display. Buff effects (regenBuff, recoveryBuff) use
 * Melee_Ones tables (value 1.0), so scale × 1.0 × 100 = scale × 100 as well.
 *
 *   Swift:   runSpeed  { scale: 0.1,  table: 'Melee_SpeedRunning' } → 10%
 *            flySpeed  { scale: 0.1,  table: 'Melee_SpeedFlying' }  → 10%
 *   Hurdle:  jumpHeight { scale: 0.06, table: 'Melee_Leap' }        → 6%
 *   Health:  regenBuff  { scale: 0.4,  table: 'Melee_Ones' }        → 40%
 *   Stamina: recoveryBuff { scale: 0.25, table: 'Melee_Ones' }      → 25%
 */
interface FitnessEffect {
  stat: keyof GlobalBonuses;
  value: number;
  enhancementType: string;
}

const FITNESS_POWER_EFFECTS: Record<string, FitnessEffect[]> = {
  'Swift': [
    { stat: 'runSpeed', value: 10, enhancementType: 'run' },
    { stat: 'flySpeed', value: 10, enhancementType: 'fly' },
  ],
  'Hurdle': [
    { stat: 'jumpHeight', value: 6, enhancementType: 'jump' },
  ],
  'Health': [
    { stat: 'regeneration', value: 40, enhancementType: 'heal' },
  ],
  'Stamina': [
    { stat: 'recovery', value: 25, enhancementType: 'enduranceMod' },
  ],
};

/**
 * Apply bonuses from inherent fitness powers
 * Fitness powers provide base stats that can be enhanced with slotted enhancements
 */
function applyFitnessPowerBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  globalIOLevel: number,
  alphaBonuses: EnhancementBonuses = {},
  exemplarLevel?: number
): void {
  const fitnessPowers = (build.inherents || []).filter(
    (p) => p.inherentCategory === 'fitness'
  );

  for (const power of fitnessPowers) {
    const effects = FITNESS_POWER_EFFECTS[power.internalName];
    if (!effects) continue;

    // Calculate enhancement bonus for this power
    const enhBonuses = calculatePowerEnhancementBonuses(
      power,
      globalIOLevel,
      getIOSet,
      exemplarLevel
    );

    // Add Alpha incarnate enhancement bonuses (apply universally, bypass ED)
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) {
        enhBonuses[aspect] = (enhBonuses[aspect] || 0) + value;
      }
    }

    const _fitnessDebugEffects: { stat: string; base: number; enhanced: number; enhBonus: number }[] = [];
    for (const effect of effects) {
      // Get the enhancement multiplier for this effect's type
      const enhMultiplier = 1 + (enhBonuses[effect.enhancementType] || 0);

      // Calculate final value: base * (1 + enhancement%)
      const finalValue = effect.value * enhMultiplier;

      // Apply to global bonuses
      global[effect.stat] += finalValue;

      // Track in breakdown
      addToBreakdown(breakdown, effect.stat, {
        name: power.name,
        value: finalValue,
        type: 'inherent',
      });

      if (isCalcDebugEnabled()) {
        _fitnessDebugEffects.push({ stat: effect.stat, base: effect.value, enhanced: finalValue, enhBonus: enhBonuses[effect.enhancementType] || 0 });
      }
    }
    if (isCalcDebugEnabled() && _fitnessDebugEffects.length > 0) {
      debugFitnessPower(power.name, _fitnessDebugEffects);
    }
  }
}

// ============================================
// ACCOLADE PROCESSING
// ============================================

/**
 * Apply bonuses from accolades
 * Accolades provide flat or percentage bonuses to HP and endurance
 */
// ============================================
// PROC PROCESSING
// ============================================

interface SlottedProc {
  procName: string;
  setName: string;
  powerName: string;
  powerType: string;
  isActive: boolean;
}

/** Minimal power interface for proc collection */
interface PowerForProcScan {
  name: string;
  powerType?: string;
  isActive?: boolean;
  slots?: (Enhancement | null)[];
  stats?: { recharge?: number; castTime?: number; radius?: number; arc?: number };
}

/**
 * Collect all "always-on" procs from the build
 * These are Global and Proc120s enhancements slotted in Auto or active Toggle powers
 */
function collectAlwaysOnProcs(build: Build): SlottedProc[] {
  const procs: SlottedProc[] = [];

  const processPower = (power: PowerForProcScan) => {
    if (!power.slots) return;

    const powerType = power.powerType?.toLowerCase() || '';
    const isAlwaysActive = powerType === 'auto' || (powerType === 'toggle' && power.isActive);

    for (const slot of power.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;
      if (!ioSlot.isProc) continue;

      // Look up proc data
      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData) continue;

      // Only include if it's an always-on proc type
      if (!isProcAlwaysOn(procData)) continue;

      // For Global procs, they're always active regardless of power type
      // For Proc120s, they need to be in an Auto or active Toggle power
      if (procData.type === 'Global' || isAlwaysActive) {
        procs.push({
          procName: ioSlot.name,
          setName: ioSlot.setName,
          powerName: power.name,
          powerType: powerType,
          isActive: true,
        });
      }
    }
  };

  // Process all power categories
  for (const power of build.primary?.powers || []) {
    processPower(power);
  }
  for (const power of build.secondary?.powers || []) {
    processPower(power);
  }
  for (const pool of build.pools || []) {
    for (const power of pool.powers) {
      processPower(power);
    }
  }
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      processPower(power);
    }
  }
  for (const power of build.inherents || []) {
    processPower(power);
  }

  return procs;
}

/**
 * Helper to apply a single proc effect category to global bonuses
 */
function applySingleProcEffect(
  category: string,
  value: number | undefined,
  effectType: string | undefined,
  sourceName: string,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>
): void {
  if (value === undefined) return;
  if (isCalcDebugEnabled()) {
    debugFormula(`${sourceName}: ${category}${effectType ? ` (${effectType})` : ''} +${formatDebugNum(value)}%`);
  }

  switch (category) {
    case 'Recovery':
      global.recovery += value;
      addToBreakdown(breakdown, 'recovery', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'Regeneration':
      global.regeneration += value;
      addToBreakdown(breakdown, 'regeneration', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'Endurance':
      // Endurance procs grant a % of max end - treat as recovery boost for calculations
      // Note: This is a one-time grant when the proc fires, not a sustained buff
      // For PPM procs like Performance Shifter, this doesn't apply to steady-state calculations
      // But for Panacea's secondary effect in the combined parsing, we include it for display
      global.recovery += value;
      addToBreakdown(breakdown, 'recovery', {
        name: `${sourceName} (+End)`,
        value,
        type: 'proc',
      });
      break;

    case 'Heal':
      // Heal procs grant a % of max HP per proc — treat as effective regeneration
      // For always-on procs (Proc120s), the heal fires every 10s, so it's a sustained regen contribution
      global.regeneration += value;
      addToBreakdown(breakdown, 'regeneration', {
        name: `${sourceName} (+HP)`,
        value,
        type: 'proc',
      });
      break;

    case 'MaxHP':
      global.maxHP += value;
      addToBreakdown(breakdown, 'maxHP', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'Defense':
      // Apply to all defense types if effect type is "All"
      if (effectType?.toLowerCase() === 'all') {
        const defTypes: (keyof GlobalBonuses)[] = [
          'defMelee', 'defRanged', 'defAoE',
          'defSmashing', 'defLethal', 'defFire', 'defCold',
          'defEnergy', 'defNegative', 'defPsionic', 'defToxic'
        ];
        for (const defType of defTypes) {
          global[defType] += value;
          addToBreakdown(breakdown, defType as string, {
            name: sourceName,
            value,
            type: 'proc',
          });
        }
      }
      break;

    case 'Resistance': {
      const resLower = effectType?.toLowerCase() || '';
      if (resLower === 'all') {
        const resTypes: (keyof GlobalBonuses)[] = [
          'resSmashing', 'resLethal', 'resFire', 'resCold',
          'resEnergy', 'resNegative', 'resPsionic', 'resToxic'
        ];
        for (const resType of resTypes) {
          global[resType] += value;
          addToBreakdown(breakdown, resType as string, {
            name: sourceName,
            value,
            type: 'proc',
          });
        }
      } else {
        // Specific resistance type (e.g., "Psionic", "Fire")
        const specificResMap: Record<string, keyof GlobalBonuses> = {
          smashing: 'resSmashing', lethal: 'resLethal',
          fire: 'resFire', cold: 'resCold',
          energy: 'resEnergy', negative: 'resNegative',
          psionic: 'resPsionic', toxic: 'resToxic',
        };
        const resKey = specificResMap[resLower];
        if (resKey) {
          global[resKey] += value;
          addToBreakdown(breakdown, resKey as string, {
            name: sourceName,
            value,
            type: 'proc',
          });
        }
      }
      break;
    }

    case 'ToHit':
      global.toHit += value;
      addToBreakdown(breakdown, 'toHit', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'Recharge':
      global.recharge += value;
      addToBreakdown(breakdown, 'recharge', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'RunSpeed':
      global.runSpeed += value;
      addToBreakdown(breakdown, 'runSpeed', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'MezResist':
      global.mezResist += value;
      addToBreakdown(breakdown, 'mezResist', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'SlowResistance':
      global.debuffResistSlow += value;
      addToBreakdown(breakdown, 'debuffResistSlow', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'RechargeResistance':
      global.debuffResistRecharge += value;
      addToBreakdown(breakdown, 'debuffResistRecharge', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'KnockbackProtection':
      global.protKnockback += value;
      addToBreakdown(breakdown, 'protKnockback', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    // Other categories (Damage, Control, Debuff, etc.) are not "always-on" stats
    default:
      break;
  }
}

/**
 * Maps proc effect categories to the stat key used in Rule of 5 tracking.
 * Null means the category does not contribute a trackable stat bonus.
 */
const PROC_CATEGORY_TO_STAT: Record<string, string | null> = {
  Recovery:          'recovery',
  Regeneration:      'regeneration',
  Heal:              'regeneration', // Heal procs contribute to effective regen rate
  Endurance:         'recovery',     // Treated as recovery in calculations
  Recharge:          'recharge',
  RunSpeed:          'runspeed',
};

/** Maps proc effect categories to procSettings keys */
const PROC_CATEGORY_TO_SETTING: Record<string, keyof ProcSettings> = {
  Recovery: 'recovery',
  Endurance: 'recovery',
  Regeneration: 'regeneration',
  Heal: 'regeneration',
  Recharge: 'recharge',
  ToHit: 'toHit',
  Defense: 'defense',
  Resistance: 'resistance',
  BuildUp: 'buildUp',
  RunSpeed: 'movement',
  KnockbackProtection: 'movement',
  MezResist: 'movement',
  SlowResistance: 'movement',
  RechargeResistance: 'movement',
};

/** Check if a proc category is enabled in procSettings */
function isProcCategoryEnabled(category: string, procSettings?: ProcSettings): boolean {
  if (!procSettings) return true; // All enabled by default
  const settingKey = PROC_CATEGORY_TO_SETTING[category];
  if (!settingKey) return true; // Unknown categories are always enabled
  return procSettings[settingKey];
}

/**
 * Apply bonuses from always-on procs (Global and Proc120s in Auto/Toggle powers).
 * Rule of 5 is enforced by sharing the same BonusTracking as set bonuses.
 */
function applyProcBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  procSettings?: ProcSettings,
): void {
  // Procs use their own Rule of 5 tracking, separate from set bonuses.
  // In CoH, unique IO procs (e.g., LotG +Recharge) and set bonuses have independent stacking limits.
  const tracking = createBonusTracking();
  const procs = collectAlwaysOnProcs(build);

  for (const proc of procs) {
    const procData = findProcData(proc.procName, proc.setName);
    if (!procData) {
      if (isCalcDebugEnabled()) {
        console.warn(`[proc] No proc data found for "${proc.procName}" (set: ${proc.setName})`);
      }
      continue;
    }

    const effect = parseProcEffect(procData.mechanics);
    const sourceName = `${proc.setName}: ${proc.procName}`;

    // Apply primary effect — check category filter and Rule of 5
    if (effect.value !== undefined && isProcCategoryEnabled(effect.category, procSettings)) {
      const stat = effect.category ? PROC_CATEGORY_TO_STAT[effect.category] : undefined;
      const allowed = stat === undefined
        ? true  // No stat mapping: not subject to Rule of 5 (e.g., KB protection)
        : stat === null
          ? false // Explicitly excluded
          : trackBonus(tracking, stat, effect.value, sourceName);

      if (allowed) {
        applySingleProcEffect(
          effect.category,
          effect.value,
          effect.effectType,
          sourceName,
          global,
          breakdown
        );
      } else if (stat) {
        // Rule of 5 rejected — add a capped entry so it appears in the tooltip
        addToBreakdown(breakdown, stat, {
          name: sourceName,
          value: effect.value,
          type: 'proc',
          capped: true,
        });
      }
    }

    // Apply secondary effect if present — check category filter and Rule of 5
    if (effect.secondaryCategory && effect.secondaryValue !== undefined && isProcCategoryEnabled(effect.secondaryCategory, procSettings)) {
      const stat = PROC_CATEGORY_TO_STAT[effect.secondaryCategory];
      const allowed = stat === undefined
        ? true
        : stat === null
          ? false
          : trackBonus(tracking, stat, effect.secondaryValue, sourceName);

      if (allowed) {
        applySingleProcEffect(
          effect.secondaryCategory,
          effect.secondaryValue,
          effect.secondaryEffectType,
          sourceName,
          global,
          breakdown
        );
      } else if (stat) {
        // Rule of 5 rejected — add a capped entry so it appears in the tooltip
        addToBreakdown(breakdown, stat, {
          name: sourceName,
          value: effect.secondaryValue,
          type: 'proc',
          capped: true,
        });
      }
    }
  }

  // Also collect PPM procs from Auto/Toggle powers and calculate their effective contribution
  applyPPMProcBonuses(build, global, breakdown, procSettings);
}

/**
 * Apply bonuses from PPM-based procs in Auto/Toggle powers
 * These procs fire with a calculable frequency, contributing a rate-based bonus
 */
function applyPPMProcBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  procSettings?: ProcSettings,
): void {
  // BASE_RECOVERY_RATE imported from enhancement-values.ts

  const processPower = (power: PowerForProcScan) => {
    if (!power.slots) return;

    const powerType = power.powerType?.toLowerCase() || '';
    const isAutoOrToggle = powerType === 'auto' || powerType === 'toggle';
    const isActive = powerType === 'auto' || (powerType === 'toggle' && power.isActive);

    // Only process active Auto/Toggle powers for PPM procs
    if (!isAutoOrToggle || !isActive) return;

    for (const slot of power.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;
      if (!ioSlot.isProc) continue;

      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData) continue;

      // Skip if not a PPM proc (Global and Proc120s are handled elsewhere)
      if (procData.type !== 'Proc' || procData.ppm === null) continue;

      const effect = parseProcEffect(procData.mechanics);
      const procsPerMin = calculateAutoToggleProcsPerMinute(procData.ppm);
      const sourceName = `${procData.setName}: ${ioSlot.name} (PPM)`;

      // Helper to apply a single PPM effect contribution
      const applyPPMEffect = (category: string | undefined, value: number | undefined, suffix?: string) => {
        if (!category || value === undefined) return;
        if (!isProcCategoryEnabled(category, procSettings)) return;
        const label = suffix ? `${sourceName} (${suffix})` : sourceName;

        switch (category) {
          case 'Endurance': {
            // Endurance proc: X% of max end per proc
            // Convert to recovery equivalent: (value% × procsPerMin) / 60 / BASE_RECOVERY_RATE × 100
            const endPerSec = (value * procsPerMin) / 60;
            const recoveryEquivalent = (endPerSec / BASE_RECOVERY_RATE) * 100;
            global.recovery += recoveryEquivalent;
            addToBreakdown(breakdown, 'recovery', { name: label, value: recoveryEquivalent, type: 'proc' });
            break;
          }
          case 'Heal': {
            // PPM heal procs (e.g. Panacea) grant a chunk of HP on each proc fire.
            // The game does NOT count these as steady-state regeneration in Combat Attributes.
            // Only percentage-based regen buffs (Proc120s like Numina's) contribute to regen rate.
            // Skip adding to global.regeneration to match game behavior.
            break;
          }
          case 'Recovery': {
            const recoveryVal = (value * procsPerMin) / 60;
            const recoveryPct = (recoveryVal / BASE_RECOVERY_RATE) * 100;
            global.recovery += recoveryPct;
            addToBreakdown(breakdown, 'recovery', { name: label, value: recoveryPct, type: 'proc' });
            break;
          }
          case 'Regeneration': {
            const regenVal = (value * procsPerMin) / 60;
            const regenPct = (regenVal / BASE_REGEN_RATE) * 100;
            global.regeneration += regenPct;
            addToBreakdown(breakdown, 'regeneration', { name: label, value: regenPct, type: 'proc' });
            break;
          }
          // Other PPM categories (Damage, Control, etc.) don't contribute to dashboard stats
        }
      };

      // Apply primary effect
      applyPPMEffect(effect.category, effect.value);

      // Apply secondary effect (e.g., Panacea's +HP primary + +End secondary)
      applyPPMEffect(effect.secondaryCategory, effect.secondaryValue, effect.secondaryCategory);
    }
  };

  // Process all power categories
  for (const power of build.primary?.powers || []) {
    processPower(power);
  }
  for (const power of build.secondary?.powers || []) {
    processPower(power);
  }
  for (const pool of build.pools || []) {
    for (const power of pool.powers) {
      processPower(power);
    }
  }
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      processPower(power);
    }
  }
  for (const power of build.inherents || []) {
    processPower(power);
  }
}

// ============================================
// BUILD UP PROC PROCESSING
// ============================================

/**
 * Apply average contributions from Build Up procs (Decimation, Gaussian's) in click powers.
 * These are PPM-based procs that grant a temporary +Damage and +ToHit buff.
 * We calculate the expected uptime across all click powers and add the average contribution.
 */
function applyBuildUpProcBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
): void {
  // Collect all click powers that have Build Up procs
  const buildUpProcs: { procName: string; setName: string; ppm: number; damage: number; toHit: number; duration: number; powerName: string; baseRecharge: number; castTime: number; radius: number; arcDegrees: number }[] = [];

  const processPower = (power: PowerForProcScan) => {
    if (!power.slots) return;
    const powerType = power.powerType?.toLowerCase() || '';
    // Build Up procs only fire in click powers (not auto/toggle)
    if (powerType === 'auto' || powerType === 'toggle') return;
    if (!power.isActive) return;

    const baseRecharge = power.stats?.recharge || 4;
    const castTime = power.stats?.castTime || 1;
    const radius = power.stats?.radius || 0;
    const arcDegrees = radius > 0 ? (arcToDegrees(power.stats?.arc) || 360) : 360;

    for (const slot of power.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;
      if (!ioSlot.isProc) continue;

      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData || procData.type !== 'Proc' || procData.ppm === null) continue;

      const effect = parseProcEffect(procData.mechanics);
      if (effect.category !== 'BuildUp') continue;

      buildUpProcs.push({
        procName: ioSlot.name,
        setName: procData.setName,
        ppm: procData.ppm,
        damage: effect.value || 0,
        toHit: effect.secondaryValue || 0,
        duration: effect.duration || 10,
        powerName: power.name,
        baseRecharge,
        castTime,
        radius,
        arcDegrees,
      });
    }
  };

  // Process all power categories
  for (const power of build.primary?.powers || []) processPower(power);
  for (const power of build.secondary?.powers || []) processPower(power);
  for (const pool of build.pools || []) {
    for (const power of pool.powers) processPower(power);
  }
  if (build.epicPool) {
    for (const power of build.epicPool.powers) processPower(power);
  }
  for (const power of build.inherents || []) processPower(power);

  if (buildUpProcs.length === 0) return;

  // For each Build Up proc, calculate the expected uptime
  // Build Up procs are unique — only one instance can be active at a time
  // We calculate the average contribution across all host powers
  // Simplified model: highest single-proc uptime (since buff doesn't stack with itself)
  let bestDamageContrib = 0;
  let bestToHitContrib = 0;
  let bestSourceName = '';

  for (const proc of buildUpProcs) {
    const procChance = calculateProcChance(proc.ppm, proc.baseRecharge, proc.castTime, proc.radius, proc.arcDegrees);
    // Expected uptime: assume power fires on recharge. Rough cycle = recharge + castTime.
    // Average buff uptime ≈ procChance × min(duration / cycleTime, 1)
    // For a rough estimate, use: avgDamage = procChance × damageValue
    // This assumes the buff duration covers most of the next cycle
    const avgDamage = procChance * proc.damage;
    const avgToHit = procChance * proc.toHit;
    const sourceName = `${proc.setName}: ${proc.procName} (in ${proc.powerName})`;

    if (avgDamage > bestDamageContrib) {
      bestDamageContrib = avgDamage;
      bestToHitContrib = avgToHit;
      bestSourceName = sourceName;
    }
  }

  // Apply the best single Build Up proc contribution
  if (bestDamageContrib > 0) {
    global.damage += bestDamageContrib;
    addToBreakdown(breakdown, 'damage', {
      name: bestSourceName,
      value: bestDamageContrib,
      type: 'proc',
    });
  }
  if (bestToHitContrib > 0) {
    global.toHit += bestToHitContrib;
    addToBreakdown(breakdown, 'toHit', {
      name: bestSourceName,
      value: bestToHitContrib,
      type: 'proc',
    });
  }
}

// ============================================
// ACCOLADE PROCESSING
// ============================================

function applyAccoladeBonuses(
  accolades: Accolade[],
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>
): void {
  for (const accolade of accolades) {
    for (const bonus of accolade.bonuses) {
      // Map accolade stat names to our global bonus property names
      const stat = bonus.stat.toLowerCase();

      if (stat === 'maxhp') {
        // HP bonuses from accolades are percentages
        global.maxHP += bonus.value;
        addToBreakdown(breakdown, 'maxHP', {
          name: accolade.name,
          value: bonus.value,
          type: 'accolade',
        });
        if (isCalcDebugEnabled()) debugAccolade(accolade.name, 'maxHP', bonus.value);
      } else if (stat === 'maxendurance') {
        // Endurance bonuses from accolades are flat values
        global.maxEndurance += bonus.value;
        addToBreakdown(breakdown, 'maxend', {
          name: accolade.name,
          value: bonus.value,
          type: 'accolade',
        });
        if (isCalcDebugEnabled()) debugAccolade(accolade.name, 'maxEndurance', bonus.value);
      }
    }
  }
}

// ============================================
// INCARNATE PROCESSING
// ============================================

/**
 * Extract Alpha incarnate effects as enhancement bonuses
 * These bonuses apply to ALL powers that accept the corresponding enhancement type
 * Returns a map of enhancement aspect to bonus value (as decimal, e.g., 0.33 = 33%)
 */
export function getAlphaEnhancementBonuses(
  incarnates: IncarnateBuildState | undefined,
  incarnateActive: IncarnateActiveState | undefined
): EnhancementBonuses {
  if (!incarnates?.alpha) return {};

  // Check if alpha is active
  const active = incarnateActive || { alpha: true, destiny: true, hybrid: true, interface: true, judgement: true, lore: true };
  if (!active.alpha) return {};

  const alphaEffects = getAlphaEffects(incarnates.alpha.powerId);
  if (!alphaEffects) return {};

  // Convert AlphaEffects to EnhancementBonuses format
  const bonuses: EnhancementBonuses = {};

  // Map alpha effect keys to enhancement bonus keys
  if (alphaEffects.damage !== undefined) bonuses.damage = alphaEffects.damage;
  if (alphaEffects.accuracy !== undefined) bonuses.accuracy = alphaEffects.accuracy;
  if (alphaEffects.recharge !== undefined) bonuses.recharge = alphaEffects.recharge;
  if (alphaEffects.enduranceReduction !== undefined) bonuses.endurance = alphaEffects.enduranceReduction;
  if (alphaEffects.enduranceModification !== undefined) bonuses.enduranceModification = alphaEffects.enduranceModification;
  if (alphaEffects.range !== undefined) bonuses.range = alphaEffects.range;
  if (alphaEffects.heal !== undefined) bonuses.heal = alphaEffects.heal;
  if (alphaEffects.defense !== undefined) bonuses.defense = alphaEffects.defense;
  if (alphaEffects.resistance !== undefined) bonuses.resistance = alphaEffects.resistance;
  if (alphaEffects.hold !== undefined) bonuses.hold = alphaEffects.hold;
  if (alphaEffects.stun !== undefined) bonuses.stun = alphaEffects.stun;
  if (alphaEffects.immobilize !== undefined) bonuses.immobilize = alphaEffects.immobilize;
  if (alphaEffects.sleep !== undefined) bonuses.sleep = alphaEffects.sleep;
  if (alphaEffects.fear !== undefined) bonuses.fear = alphaEffects.fear;
  if (alphaEffects.confuse !== undefined) bonuses.confuse = alphaEffects.confuse;
  if (alphaEffects.slow !== undefined) bonuses.slow = alphaEffects.slow;
  if (alphaEffects.toHitDebuff !== undefined) bonuses.tohitDebuff = alphaEffects.toHitDebuff;
  if (alphaEffects.defenseDebuff !== undefined) bonuses.defenseDebuff = alphaEffects.defenseDebuff;
  if (alphaEffects.toHitBuff !== undefined) bonuses.tohit = alphaEffects.toHitBuff;
  if (alphaEffects.taunt !== undefined) bonuses.taunt = alphaEffects.taunt;
  if (alphaEffects.runSpeed !== undefined) bonuses.runSpeed = alphaEffects.runSpeed;
  if (alphaEffects.jumpSpeed !== undefined) bonuses.jumpSpeed = alphaEffects.jumpSpeed;
  if (alphaEffects.flySpeed !== undefined) bonuses.flySpeed = alphaEffects.flySpeed;
  if (alphaEffects.absorb !== undefined) bonuses.absorb = alphaEffects.absorb;

  return bonuses;
}

/**
 * Apply a block of Hybrid stat bonuses (passive, frontLoaded, or perTarget) to global bonuses.
 * Stat keys use GlobalBonuses field names (e.g. 'regeneration', 'resSmashing', 'defMelee').
 * Special keys: 'statusResistance' applies to all mez resist types, 'enduranceDiscount' applies to end discount.
 */
function applyHybridStatBlock(
  stats: Record<string, number>,
  sourceName: string,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
): void {
  for (const [stat, decimal] of Object.entries(stats)) {
    // Status resistance from Control passive applies to all mez types
    if (stat === 'statusResistance') {
      const value = decimal * 100;
      const mezTypes: (keyof GlobalBonuses)[] = [
        'mezResistHold', 'mezResistStun', 'mezResistImmobilize',
        'mezResistSleep', 'mezResistConfuse', 'mezResistFear',
      ];
      for (const mezKey of mezTypes) {
        global[mezKey] += value;
        addToBreakdown(breakdown, mezKey, { name: sourceName, value, type: 'incarnate' });
      }
      continue;
    }

    // Mez protection uses raw magnitude (not percentage)
    if (stat.startsWith('prot')) {
      const key = stat as keyof GlobalBonuses;
      if (key in global) {
        global[key] += decimal; // Already magnitude, not percentage
        addToBreakdown(breakdown, key, { name: sourceName, value: decimal, type: 'incarnate' });
      }
      continue;
    }

    // All other stats: decimal → percentage (× 100)
    const value = decimal * 100;

    // Handle "All" defense/resistance keys by expanding to individual types
    if (stat === 'defenseAll') {
      const defKeys: (keyof GlobalBonuses)[] = [
        'defMelee', 'defRanged', 'defAoE',
        'defSmashing', 'defLethal', 'defFire', 'defCold',
        'defEnergy', 'defNegative', 'defPsionic', 'defToxic',
      ];
      for (const k of defKeys) {
        global[k] += value;
        addToBreakdown(breakdown, k, { name: sourceName, value, type: 'incarnate' });
      }
      continue;
    }
    if (stat === 'resistanceAll') {
      const resKeys: (keyof GlobalBonuses)[] = [
        'resSmashing', 'resLethal', 'resFire', 'resCold',
        'resEnergy', 'resNegative', 'resPsionic', 'resToxic',
      ];
      for (const k of resKeys) {
        global[k] += value;
        addToBreakdown(breakdown, k, { name: sourceName, value, type: 'incarnate' });
      }
      continue;
    }

    const key = stat as keyof GlobalBonuses;
    if (key in global) {
      global[key] += value;
      addToBreakdown(breakdown, key, { name: sourceName, value, type: 'incarnate' });
    }
  }
}

/**
 * Apply bonuses from incarnate powers
 * Alpha provides enhancement bonuses, Destiny/Hybrid provide direct stat bonuses
 * Interface is proc-based and doesn't provide direct stats
 */
function applyIncarnateBonuses(
  incarnates: IncarnateBuildState | undefined,
  incarnateActive: IncarnateActiveState | undefined,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  levelShiftActive = true,
): void {
  if (!incarnates) return;
  const _debugBefore = isCalcDebugEnabled() ? { ...global } : null;

  // Default to all active if no active state provided
  const active = incarnateActive || {
    alpha: true,
    destiny: true,
    hybrid: true,
    interface: true,
    judgement: true,
    lore: true,
  };

  // Alpha - Enhancement bonuses are handled separately via getAlphaEnhancementBonuses()
  // They are applied in applyActivePowerBonuses() to boost power effectiveness
  // The dashboard doesn't show enhancement % directly, but the effect shows in toggle power stats

  // Destiny - Direct stat bonuses (defense, resistance, regen, recovery, etc.)
  // Note: These are initial/peak values since effects diminish over time
  if (incarnates.destiny && active.destiny) {
    const destinyEffects = getDestinyEffects(incarnates.destiny.powerId);
    if (destinyEffects) {
      const powerName = incarnates.destiny.displayName;

      // Defense All
      if (destinyEffects.defenseAll !== undefined) {
        const value = destinyEffects.defenseAll * 100;
        const defKeys: (keyof GlobalBonuses)[] = [
          'defMelee', 'defRanged', 'defAoE',
          'defSmashing', 'defLethal', 'defFire', 'defCold',
          'defEnergy', 'defNegative', 'defPsionic', 'defToxic',
        ];
        for (const key of defKeys) {
          global[key] += value;
          addToBreakdown(breakdown, key, { name: powerName, value, type: 'incarnate' });
        }
      }

      // Resistance All
      if (destinyEffects.resistanceAll !== undefined) {
        const value = destinyEffects.resistanceAll * 100;
        const resKeys: (keyof GlobalBonuses)[] = [
          'resSmashing', 'resLethal', 'resFire', 'resCold',
          'resEnergy', 'resNegative', 'resPsionic', 'resToxic',
        ];
        for (const key of resKeys) {
          global[key] += value;
          addToBreakdown(breakdown, key, { name: powerName, value, type: 'incarnate' });
        }
      }

      // Regeneration
      if (destinyEffects.regeneration !== undefined) {
        const value = destinyEffects.regeneration * 100;
        global.regeneration += value;
        addToBreakdown(breakdown, 'regeneration', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Recovery
      if (destinyEffects.recovery !== undefined) {
        const value = destinyEffects.recovery * 100;
        global.recovery += value;
        addToBreakdown(breakdown, 'recovery', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Damage
      if (destinyEffects.damage !== undefined) {
        const value = destinyEffects.damage * 100;
        global.damage += value;
        addToBreakdown(breakdown, 'damage', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // ToHit
      if (destinyEffects.toHit !== undefined) {
        const value = destinyEffects.toHit * 100;
        global.toHit += value;
        addToBreakdown(breakdown, 'toHit', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Recharge
      if (destinyEffects.recharge !== undefined) {
        const value = destinyEffects.recharge * 100;
        global.recharge += value;
        addToBreakdown(breakdown, 'recharge', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Max HP
      if (destinyEffects.maxHP !== undefined) {
        const value = destinyEffects.maxHP * 100;
        global.maxHP += value;
        addToBreakdown(breakdown, 'maxHP', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Max Endurance
      if (destinyEffects.maxEndurance !== undefined) {
        const value = destinyEffects.maxEndurance * 100;
        global.maxEndurance += value;
        addToBreakdown(breakdown, 'maxEndurance', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }
    }
  }

  // Hybrid — three-layer model: passive (always-on), frontLoaded (toggle baseline), perTarget (future slider)
  if (incarnates.hybrid) {
    const hybridEffects = getHybridEffects(incarnates.hybrid.powerId);
    if (hybridEffects) {
      const powerName = incarnates.hybrid.displayName;

      // Layer 1: Passive bonuses — always-on just by equipping
      applyHybridStatBlock(hybridEffects.passive, `${powerName} (passive)`, global, breakdown);

      // Layer 2: Front-loaded bonuses — active when toggle is on, no enemies required
      if (active.hybrid) {
        applyHybridStatBlock(hybridEffects.frontLoaded, powerName, global, breakdown);
      }

      // Layer 3: Per-target bonuses — not applied yet (needs slider infrastructure)
      // When slider is added: applyHybridStatBlock(scaled perTarget, `${powerName} (per-target)`, ...)
    }
  }

  // Interface - These are proc effects that debuff enemies, not player stats
  // We don't add them to global bonuses, but they could be displayed in tooltips
  //

  // Level Shift from incarnate slots (Alpha, Destiny, and Lore T3+)
  // Controlled by the independent levelShiftActive flag, NOT by per-slot stat toggles
  if (levelShiftActive) {
    if (incarnates.alpha) {
      const alphaEffects = getAlphaEffects(incarnates.alpha.powerId);
      if (alphaEffects?.levelShift) {
        global.levelShift += alphaEffects.levelShift;
        addToBreakdown(breakdown, 'levelShift', {
          name: incarnates.alpha.displayName,
          value: alphaEffects.levelShift,
          type: 'incarnate',
        });
      }
    }
    if (incarnates.destiny) {
      const destinyEffects = getDestinyEffects(incarnates.destiny.powerId);
      if (destinyEffects?.levelShift) {
        global.levelShift += destinyEffects.levelShift;
        addToBreakdown(breakdown, 'levelShift', {
          name: incarnates.destiny.displayName,
          value: destinyEffects.levelShift,
          type: 'incarnate',
        });
      }
    }
    if (incarnates.lore) {
      const loreEffects = getLoreEffects(incarnates.lore.powerId);
      if (loreEffects?.levelShift) {
        global.levelShift += loreEffects.levelShift;
        addToBreakdown(breakdown, 'levelShift', {
          name: incarnates.lore.displayName,
          value: loreEffects.levelShift,
          type: 'incarnate',
        });
      }
    }
  }

  // Debug: log incarnate diff
  if (_debugBefore && isCalcDebugEnabled()) {
    for (const key of Object.keys(global) as (keyof GlobalBonuses)[]) {
      const delta = global[key] - _debugBefore[key];
      if (Math.abs(delta) > 0.0001) {
        debugFormula(`${key}: ${delta > 0 ? '+' : ''}${formatDebugNum(delta)}`);
      }
    }
  }
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
  stats.jumpspeed = global.jumpSpeed;

  // Debuff Resistance
  stats.debuffResistSlow = global.debuffResistSlow;
  stats.debuffResistDefense = global.debuffResistDefense;
  stats.debuffResistRecharge = global.debuffResistRecharge;
  stats.debuffResistEndurance = global.debuffResistEndurance;
  stats.debuffResistRecovery = global.debuffResistRecovery;
  stats.debuffResistToHit = global.debuffResistToHit;
  stats.debuffResistRegeneration = global.debuffResistRegeneration;
  stats.debuffResistPerception = global.debuffResistPerception;

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

  // Stored powers carry only the user's selections (slots, isActive, etc.).
  // Enrich with the current powerset definition so downstream filters can
  // see targetType/powerType/effectArea — without these the ally-only
  // filter in applyActivePowerBonuses sees undefined targetType and lets
  // ally buffs (Speed Boost, Fortitude, Grant Invisibility, etc.) bleed
  // into the caster's totals.
  const enrich = (
    power: { internalName?: string; isActive?: boolean; slots?: unknown },
    def?: { targetType?: string; powerType?: string; effectArea?: string; effects?: unknown },
  ): PowerWithToggle => {
    if (!def) return power as unknown as PowerWithToggle;
    return {
      ...power,
      // Definition wins for static metadata — stored copy may be missing or stale.
      targetType: def.targetType,
      powerType: def.powerType,
      effectArea: def.effectArea,
      effects: def.effects ?? (power as { effects?: unknown }).effects,
    } as unknown as PowerWithToggle;
  };

  const primaryDef = build.primary.id ? getPowerset(build.primary.id) : undefined;
  for (const power of build.primary.powers) {
    powers.push(enrich(power, primaryDef?.powers.find((p) => p.internalName === power.internalName)));
  }

  const secondaryDef = build.secondary.id ? getPowerset(build.secondary.id) : undefined;
  for (const power of build.secondary.powers) {
    powers.push(enrich(power, secondaryDef?.powers.find((p) => p.internalName === power.internalName)));
  }

  for (const pool of build.pools) {
    const poolDef = getPowerPool(pool.id);
    for (const power of pool.powers) {
      powers.push(enrich(power, poolDef?.powers.find((p) => p.internalName === power.internalName)));
    }
  }

  if (build.epicPool) {
    const epicDef = getEpicPool(build.epicPool.id);
    for (const power of build.epicPool.powers) {
      powers.push(enrich(power, epicDef?.powers.find((p) => p.internalName === power.internalName)));
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
    inherents: build.inherents,
  };
}

export interface CalculationOptions {
  /** Per-category proc settings (default: all enabled) */
  procSettings?: ProcSettings;
  /** Per-target slider values keyed by power name (0 = inactive, 1+ = targets hit) */
  targetsHitValues?: Record<string, number>;
  /** Exemplar level for enhancement scaling (undefined = no scaling) */
  exemplarLevel?: number;
  /** Target enemy level offset for hit chance calculation (e.g. +3 = enemy is 3 levels above) */
  targetLevelOffset?: number;
  /** Vigilance team size for Defenders (0 = solo, 1+ = teammates) */
  vigilanceTeamSize?: number;
  /** Fury level for Brutes (0-100) */
  furyLevel?: number;
  /** Whether incarnate level shifts are applied (default: true, independent from per-slot toggles) */
  incarnateLevelShiftActive?: boolean;
  /** Combat mode: suppress defenseBuffSuppressible from stealth/travel powers */
  combatMode?: boolean;
}

/**
 * Main calculation function - calculates all character stats
 * @param build - The current build state
 * @param exemplarMode - When true, respects build level for set bonus suppression.
 *                       When false (default), always calculates as if at level 50.
 * @param incarnateActive - Which incarnate slots are active for stat calculations
 * @param options - Additional calculation options
 */
export function calculateCharacterTotals(
  build: Build,
  exemplarMode = false,
  incarnateActive?: IncarnateActiveState,
  options?: CalculationOptions
): CharacterCalculationResult {
  const breakdown = new Map<string, DashboardStatBreakdown>();
  const globalBonuses = createEmptyGlobalBonuses();
  const _debug = isCalcDebugEnabled();

  // Step 1: Calculate set bonuses with Rule of 5
  // effectiveLevel drives HP, fitness, and toggle scaling — always use build.level
  // Set bonus suppression only applies in exemplar mode (don't suppress at low build levels)
  const exemplarLevel = options?.exemplarLevel;
  const effectiveLevel = exemplarMode ? (exemplarLevel ?? build.level) : build.level;

  // Debug: build context
  if (_debug) {
    debugBuildContext(
      build.archetype?.id || 'unknown',
      build.level,
      effectiveLevel,
      exemplarLevel,
      {
        exemplarMode,
        combatMode: options?.combatMode,
        targetLevelOffset: options?.targetLevelOffset,
        vigilanceTeamSize: options?.vigilanceTeamSize,
        furyLevel: options?.furyLevel,
        incarnateLevelShiftActive: options?.incarnateLevelShiftActive,
      }
    );
  }

  const buildPowers = buildToBuildPowers(build);
  const { bonuses: setBonusAggregated, tracking } = calculateSetBonuses(
    buildPowers,
    getIOSet,
    exemplarMode ? effectiveLevel : undefined,
    exemplarMode ? effectiveLevel : 50
  );


  // Step 2: Apply set bonuses to global bonuses
  applySetBonusesToGlobal(setBonusAggregated, globalBonuses);

  // Debug: set bonus results
  if (_debug) {
    const trackingStats: { stat: string; count: number; capped: number }[] = [];
    for (const stat of Object.keys(setBonusAggregated)) {
      const items = getStatBreakdown(tracking, stat);
      let count = 0;
      let capped = 0;
      for (const item of items) {
        count += item.sources.length;
        capped += item.rejectedSources.length;
      }
      if (count > 0 || capped > 0) trackingStats.push({ stat, count, capped });
    }
    debugSetBonuses(setBonusAggregated, trackingStats);
  }

  // Step 3: Build detailed breakdown from set bonus tracking
  for (const stat of Object.keys(setBonusAggregated)) {
    const statBreakdownItems = getStatBreakdown(tracking, stat);
    if (statBreakdownItems.length > 0) {
      const built = buildStatBreakdown(statBreakdownItems);
      // Normalize stat key to match breakdownKey casing (e.g. 'maxhp' → 'maxHP')
      const normalizedStat = stat.toLowerCase().replace(/[^a-z]/g, '');
      const breakdownStat = STAT_TO_GLOBAL[normalizedStat] || stat;
      // Merge into existing breakdown if there are other sources
      const existing = breakdown.get(breakdownStat);
      if (existing) {
        existing.sources.push(...built.sources);
        existing.total += built.total;
        existing.cappedSources += built.cappedSources;
      } else {
        breakdown.set(breakdownStat, built);
      }
    }
  }

  // Step 4: Collect all powers
  const allPowers = collectAllPowers(build);

  // Step 5: Get Alpha incarnate enhancement bonuses (apply to all powers including fitness)
  const alphaBonuses = getAlphaEnhancementBonuses(build.incarnates, incarnateActive);
  if (_debug) debugAlphaBonuses(alphaBonuses);

  // Step 6: Apply inherent power bonuses (Fitness powers, with Alpha bonuses)
  if (_debug) debugGroup('Step 6: Fitness Powers');
  applyFitnessPowerBonuses(build, globalBonuses, breakdown, effectiveLevel, alphaBonuses, exemplarLevel);
  if (_debug) debugGroupEnd();

  // Step 7: Apply active toggle power bonuses (with enhancement multipliers + Alpha bonuses)
  if (_debug) debugGroup('Step 7: Active Power Bonuses');
  applyActivePowerBonuses(allPowers, globalBonuses, breakdown, effectiveLevel, build.archetype.id || '', alphaBonuses, options?.targetsHitValues ?? {}, exemplarLevel, options?.combatMode);
  if (_debug) debugGroupEnd();

  // Step 7.5: Apply always-on proc bonuses (Global and Proc120s in Auto/Toggle powers)
  // Procs have their own Rule of 5 tracking, separate from set bonuses
  const procSettings = options?.procSettings;
  const anyProcEnabled = !procSettings || Object.values(procSettings).some(v => v);
  if (_debug) debugGroup('Step 7.5-7.6: Proc Bonuses');
  if (anyProcEnabled) {
    applyProcBonuses(build, globalBonuses, breakdown, procSettings);
  }

  // Step 7.6: Apply Build Up proc average contributions (PPM click procs)
  if (!procSettings || procSettings.buildUp) {
    applyBuildUpProcBonuses(build, globalBonuses, breakdown);
  }
  if (_debug) debugGroupEnd();

  // Step 8: Apply accolade bonuses
  if (_debug && build.accolades && build.accolades.length > 0) debugGroup('Step 8: Accolades');
  if (build.accolades && build.accolades.length > 0) {
    applyAccoladeBonuses(build.accolades, globalBonuses, breakdown);
  }
  if (_debug && build.accolades && build.accolades.length > 0) debugGroupEnd();

  // Step 9: Apply incarnate bonuses (Destiny, Hybrid - direct stats)
  // Note: Alpha bonuses were already applied in Step 7 as enhancement bonuses
  if (_debug) debugGroup('Step 9: Incarnate Bonuses');
  applyIncarnateBonuses(build.incarnates, incarnateActive, globalBonuses, breakdown, options?.incarnateLevelShiftActive ?? true);
  if (_debug) debugGroupEnd();

  // Step 9.1: Apply archetype inherent damage bonuses (Vigilance, Fury)
  const archetypeId = build.archetype?.id;
  if (archetypeId === 'defender' && options?.vigilanceTeamSize !== undefined) {
    const vigBonus = calculateVigilanceDamageBonus(effectiveLevel, options.vigilanceTeamSize);
    if (vigBonus > 0) {
      const vigValue = vigBonus * 100;
      globalBonuses.damage += vigValue;
      addToBreakdown(breakdown, 'damage', {
        name: 'Vigilance',
        value: vigValue,
        type: 'inherent',
      });
    }
  }
  if (archetypeId === 'brute' && options?.furyLevel !== undefined && options.furyLevel > 0) {
    const furyBonus = calculateFuryDamageBonus(options.furyLevel);
    if (furyBonus > 0) {
      const furyValue = furyBonus * 100;
      globalBonuses.damage += furyValue;
      addToBreakdown(breakdown, 'damage', {
        name: 'Fury',
        value: furyValue,
        type: 'inherent',
      });
    }
  }

  // Step 9.5: Compute hit chance against target level (purple patch)
  const targetOffset = options?.targetLevelOffset ?? 0;
  const effectiveLevelDiff = targetOffset - globalBonuses.levelShift;
  const ppBaseToHit = getBaseToHit(effectiveLevelDiff);
  const finalToHit = Math.min(0.95, Math.max(0.05, ppBaseToHit + globalBonuses.toHit / 100));
  const accuracyMult = 1 + globalBonuses.accuracy / 100;
  globalBonuses.baseToHit = ppBaseToHit;
  globalBonuses.hitChance = Math.min(0.95, Math.max(0.05, finalToHit * accuracyMult));
  globalBonuses.combatModifier = getCombatModifier(effectiveLevelDiff);

  if (_debug) {
    debugHitChance(targetOffset, globalBonuses.levelShift, effectiveLevelDiff, ppBaseToHit, globalBonuses.toHit, globalBonuses.accuracy, globalBonuses.hitChance);
  }

  // Step 10: Convert to character stats format
  const stats = convertToCharacterStats(globalBonuses);

  // Apply endurance discount (e.g., Conserve Power, set bonuses, Cardiac
  // Alpha) to toggle costs. Scale every per-toggle breakdown source by the
  // same factor so the breakdown rows match the displayed total — without
  // this, sources show the slot-enhanced cost ("Enhanced" tier) while the
  // top-line total uses the post-discount cost ("Final" tier), and Hot
  // Feet etc. appear to over-contribute.
  if (globalBonuses.enduranceDiscount > 0) {
    const discountFactor = 1 - globalBonuses.enduranceDiscount / 100;
    globalBonuses.toggleEndCost *= discountFactor;
    const tec = breakdown.get('toggleEndCost');
    if (tec) {
      tec.sources.forEach((s) => { s.value *= discountFactor; });
    }
  }

  // Compute net endurance per second (recovery minus toggle costs)
  // MaxEndurance bonuses are flat values (accolades +5, power effects in absolute points)
  const totalMaxEnd = 100 + globalBonuses.maxEndurance;
  const recoveryEndPerSec = (totalMaxEnd / 60) * (1 + globalBonuses.recovery / 100);
  globalBonuses.netEndPerSec = recoveryEndPerSec - globalBonuses.toggleEndCost;

  if (_debug) {
    debugNetEndurance(totalMaxEnd, globalBonuses.maxEndurance, globalBonuses.recovery, recoveryEndPerSec, globalBonuses.toggleEndCost, globalBonuses.enduranceDiscount, globalBonuses.netEndPerSec);
    debugFinalStats(globalBonuses as unknown as Record<string, number>);
    debugEnd();
  }

  // Update breakdown totals from final values (exclude capped/Rule-of-5 sources)
  for (const [, bd] of breakdown) {
    bd.total = bd.sources.reduce((sum, s) => s.capped ? sum : sum + s.value, 0);
  }

  return {
    stats,
    globalBonuses,
    breakdown,
    setBonuses: setBonusAggregated,
    bonusTracking: tracking,
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
