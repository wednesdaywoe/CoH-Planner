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

import type { Build, Accolade, ConditionalEffect, Enhancement, EnhancementStatType, IncarnateActiveState, IncarnateBuildState, IOSetEnhancement } from '@/types';
import type { ProcSettings } from '@/stores/uiStore';
import { isSelfDirectedEffect } from '@/types';
import { AT_INHERENT_CONDITIONAL_IDS } from '@/utils/conditional-effects';
import { stanceAdjusterOverrides } from '@/data';
import { getIOSet, getAlphaEffects, getDestinyEffects, getDestinyEffectsAtTime, getDestinySustainedFloorTime, getDestinyBoostsAllowed, applyAlphaToDestiny, getHybridEffects, getLoreEffects, getGenesisEffects, findProcData, getProcEffects, isProcAlwaysOn, calculateAutoToggleProcsPerMinute, calculateProcChance, arcToDegrees } from '@/data';
import type { DestinyEffects, GenesisEffects } from '@/data';
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
  combineWithAlphaED,
  filterAlphaByAllowedEnhancements,
  BASE_RECOVERY_RATE,
  BASE_REGEN_RATE,
  type EnhancementBonuses,
} from './enhancement-values';
import { INCARNATE_TIER_REGISTRY } from '@/data/core/incarnate-registry';
import { warnFallback } from '@/utils/fallback-warnings';
import { calculateVigilanceDamageBonus, calculateFuryDamageBonus } from './inherents';
import { getEffectiveLevel, areIncarnatesSuppressed } from './effective-level';
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
  absorb: number;
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
  // Healing Received — Res(Heal) buff (percent). Positive = more healing
  // received (e.g. Incandescence Destiny +50%). Distinct from healOther, which
  // is heal *strength* (boosts heals you cast). Populated by incarnate Destiny.
  healReceived: number;
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
  // +Strength buffs (Power Boost family). Stored as fractions (e.g. 1.229 =
  // +122.9% strength), NOT percentages like the fields above. These are
  // non-ED multipliers applied to the caster's OWN power outputs for the
  // matching aspect (def/tohit/heal/absorb/endmod/movement/mez), additive
  // with enhancement strength. They never touch damage, resistance, or set
  // bonuses, and add nothing on their own ("twice nothing is nothing").
  strengthDefense: number;
  strengthToHit: number;
  strengthHeal: number;
  strengthAbsorb: number;
  strengthEndMod: number;
  strengthMovement: number;
  strengthMez: number;

  // Offensive mez/control duration buffs from IO set bonuses (percent). Applied
  // to the duration of the mez a power inflicts (Immobilize/Hold/Stun/etc.) —
  // mapped to the matching power effect key via GLOBAL_BONUS_ASPECT_MAP.
  immobilizeDuration: number;
  holdDuration: number;
  stunDuration: number;
  sleepDuration: number;
  confuseDuration: number;
  terrorDuration: number;
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
  /** Display name of the power that supplied this source (set bonus / proc), used to highlight powers contributing capped bonuses. */
  powerName?: string;
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
    absorb: 0,
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
    healReceived: 0,
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
    strengthDefense: 0,
    strengthToHit: 0,
    strengthHeal: 0,
    strengthAbsorb: 0,
    strengthEndMod: 0,
    strengthMovement: 0,
    strengthMez: 0,
    immobilizeDuration: 0,
    holdDuration: 0,
    stunDuration: 0,
    sleepDuration: 0,
    confuseDuration: 0,
    terrorDuration: 0,
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

  // Offensive mez/control duration (normalized keys are lowercased+alpha-only)
  immobilizeduration: 'immobilizeDuration',
  holdduration: 'holdDuration',
  stunduration: 'stunDuration',
  sleepduration: 'sleepDuration',
  confuseduration: 'confuseDuration',
  terrorduration: 'terrorDuration',

  // Mez Protection (from IO set bonuses — value is stored as %, divide by 100 for mag)
  kbprotection: 'protKnockback',

  // Debuff Resistance (from IO set bonuses)
  debuffresistrecharge: 'debuffResistRecharge',
  debuffresistslow: 'debuffResistSlow',

  // Knockback Resistance (from IO set bonuses)
  kbresistance: 'mezResistKnockback',

  // Perception radius buff (from IO set bonuses — Rectified Reticle), same
  // % global as in-power +Perception buffs.
  perceptionradius: 'perceptionRadius',
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
    for (const tracked of item.sources) {
      sources.push({
        name: tracked.name,
        value: item.value,
        type: 'set-bonus',
        capped: false,
        powerName: tracked.powerName,
      });
    }

    // Rejected sources (6th+) — these exceeded the Rule of 5 and are NOT counted
    for (const tracked of item.rejectedSources) {
      sources.push({
        name: tracked.name,
        value: item.value,
        type: 'set-bonus',
        capped: true,
        powerName: tracked.powerName,
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
 * Adjust a scaled effect for per-target stacking. The `scale` field on a
 * perTarget-flagged effect stores the value at N=1 (base + 1 × per-target
 * contribution); each additional target adds `perTarget` to it.
 *
 * Semantics with respect to the targets-hit slider:
 *   - N undefined → no slider yet; return the original (1-target value).
 *   - N = 0       → power whiffed; the buff doesn't fire. Return scale 0.
 *   - N = 1       → original value.
 *   - N ≥ 2       → scale + perTarget × (N − 1).
 *
 * Effects without `perTarget` metadata (always-on buffs) are unaffected
 * by the slider regardless of N.
 */
function adjustForPerTarget(value: ScalarOrScaled, targetsHit?: number): ScalarOrScaled {
  if (typeof value !== 'object' || value === null) return value;
  const obj = value as { scale: number; table?: string; perTarget?: number };
  if (!obj.perTarget) return value;
  if (targetsHit === undefined) return value;
  if (targetsHit <= 0) return { ...value, scale: 0 };
  if (targetsHit === 1) return value;
  return { ...value, scale: value.scale + obj.perTarget * (targetsHit - 1) };
}

/**
 * Combined stacking adjustment: applies perTarget AoE math (existing
 * behavior) OR `stacksLinear` self-stack multiplication for powers like
 * Psychokinetic Barrier's debuff resistance — never both.
 *
 * Soul Drain et al. carry both `perTarget` (from AoE per-target detection)
 * AND a `stacksLinear` entry (from self-stack detection, since each per-
 * target tick applies to Self with a stack_limit). They're two views of
 * the same mechanic; running both produced N² scaling.
 */
function adjustForStacking(
  value: ScalarOrScaled,
  targetsHit: number | undefined,
  stacksLinear: readonly string[] | undefined,
  effectKey: string,
  maxStacks?: number,
  stackCaps?: Record<string, number>,
): ScalarOrScaled {
  const hasPerTarget = typeof value === 'object' && value !== null && 'perTarget' in value && !!(value as { perTarget?: number }).perTarget;
  if (hasPerTarget) {
    // perTarget already drives the scaling; do not also multiply by N.
    return adjustForPerTarget(value, targetsHit);
  }
  // For stacksLinear effects (self-stacking from repeated casts, e.g. Siphon
  // Speed's +Recharge), the targets-hit slider doubles as a stack-count
  // slider. Mirror adjustForPerTarget semantics so the two views behave the
  // same: explicit 0 = power whiffed / no stacks active (scale 0);
  // undefined = no slider input → default to 1 stack (return as-is).
  if (targetsHit === 0 && stacksLinear?.includes(effectKey)) {
    if (typeof value === 'object' && value !== null) {
      return { ...value, scale: 0 };
    }
    return 0;
  }
  if (!targetsHit || targetsHit <= 1) return value;
  if (!stacksLinear || !stacksLinear.includes(effectKey)) return value;
  if (typeof value !== 'object' || value === null) return value;
  // Cap stack count at this effect's own limit. Powers whose stacksLinear
  // effects diverge (Psychokinetic Barrier: absorb cap 2, debuff-res cap 3)
  // carry a per-effect `stackCaps`; fall back to the power-wide `maxStacks`
  // (e.g. Siphon Speed maxStacks=2; a slider at 3 must still cap at 2×).
  const cap = stackCaps?.[effectKey] ?? maxStacks;
  const cappedStacks = cap && cap > 0 ? Math.min(targetsHit, cap) : targetsHit;
  const obj = value as { scale: number };
  return { ...value, scale: obj.scale * cappedStacks };
}

interface ActivePowerEffect {
  tohitBuff?: number;
  tohitBuffUnenhanced?: ScalarOrScaled;
  accuracyBuff?: number;
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
  // IgnoreStrength run-speed template (e.g. Sprint's second RunningSpeed effect):
  // contributes to totals but is NOT boosted by slotted Run Speed enhancements.
  // Mirrors the tohitBuffUnenhanced / regenBuffUnenhanced convention.
  runSpeedUnenhanced?: ScalarOrScaled;
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
  recoveryBuffUnenhanced?: ScalarOrScaled;
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
  knockup?: number | MezScaled;
  // Additional status effects
  repel?: ScalarOrScaled;
  teleport?: ScalarOrScaled;
  taunt?: number | MezScaled;
  placate?: number | MezScaled;
  // Stealth
  stealth?: {
    stealthPvE?: ScalarOrScaled;
    stealthPvP?: ScalarOrScaled;
    /** Binary stealth-stacking group (`stack_key`); non-null = suppress group
     *  (max-wins), null/absent = additive. See resolveStealthRadius. */
    stackKey?: string | null;
  };
  // Perception
  perceptionBuff?: ScalarOrScaled;
  // Range buff (Boost Range, Aim's +Range, …). A caster +Range self-buff; the
  // same field on Foe-targeted attacks is the per-power Fast Snipe range bump,
  // which is NOT aggregated here (see applyActivePowerBonuses).
  rangeBuff?: ScalarOrScaled;
  // Endurance cost per second (for toggles)
  enduranceCost?: number;
  // Endurance discount (e.g., Conserve Power — reduces end costs by a percentage)
  enduranceDiscount?: ScalarOrScaled;
  // Self-debuffs (e.g., Granite Armor) — applied per-value when the debuff is
  // self-directed (toWho:'Self'). Most powers with these fields target enemies.
  tohitDebuff?: ScalarOrScaled;
  slow?: ScalarOrScaled | Record<string, ScalarOrScaled>;
  movement?: Record<string, ScalarOrScaled>;
  rechargeDebuff?: ScalarOrScaled;
  damageDebuff?: ScalarOrScaled;
  /** Linear self-stacking metadata — see PowerEffects.stacksLinear */
  stacksLinear?: readonly string[];
  maxStacks?: number;
  /** Per-effect stack caps — see PowerEffects.stackCaps */
  stackCaps?: Record<string, number>;
  /** +Strength self-buff container (Power Boost family) — keyed by aspect
   *  (defense/melee/.../tohit/heal/absorb/endurance/movement/mez). Each entry
   *  is a Strength-aspect multiplier on the caster's own matching output. */
  specialBuff?: Record<string, ScalarOrScaled>;
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
  /** Used by `combineWithAlphaED` to gate Alpha bonuses by what the power
   * actually accepts as enhancements. See enhancement-values.ts. */
  allowedEnhancements?: EnhancementStatType[];
  /** Mode-/state-gated contributions (Bio Armor adaptation modes, Hide, …)
   *  carried from the powerset definition. The active ones are expanded into
   *  synthetic active-power contributions by `expandActiveConditionals`. */
  conditionalEffects?: ConditionalEffect[];
  /** Selected stance sub-power for parents with mutually exclusive stances
   *  (Bio Armor Adaptation, Staff Mastery) — the single source of truth for
   *  which stance is active. Carried through from the stored power. */
  activeSubPower?: string;
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
 * Sum per-second endurance cost from active toggles using the canonical CoH
 * divisor formula:
 *
 *     actualCost = baseEndPerSec / (1 + slotEndRdx + globalEndDisc/100)
 *
 * Runs AFTER all global EndDisc sources have been aggregated (set bonuses,
 * active-power discounts like Conserve Power, Hybrid Support T4) so the
 * divisor sees the full sum in one shot. This replaces the older two-step
 * pattern (per-toggle cost using only slot enhancement, then a post-hoc
 * `cost *= (1 - global/100)` rescale), which used the wrong linear formula
 * and silently dropped any discount sources that hadn't been aggregated yet.
 */
function applyToggleEndCosts(
  powers: PowerWithToggle[],
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  buildLevel: number,
  alphaBonuses: EnhancementBonuses = {},
  alphaEdBypassRatio: number = 0,
  exemplarLevel?: number,
): void {
  const globalEndDiscDecimal = (global.endurance || 0) / 100;
  for (const power of powers) {
    if (power.powerType?.toLowerCase() !== 'toggle' || !power.isActive) continue;
    if (power.targetType && ALLY_ONLY_TARGET_TYPES.has(power.targetType.toLowerCase())) continue;

    let baseEndPerSec = 0;
    if (power.effects?.enduranceCost) {
      baseEndPerSec = power.effects.enduranceCost;
    } else if (power.stats?.endurance) {
      const activatePeriod = power.stats.activatePeriod ?? 0.5;
      baseEndPerSec = activatePeriod > 0 ? power.stats.endurance / activatePeriod : 0;
    }
    if (baseEndPerSec <= 0) continue;

    let enhBonuses: EnhancementBonuses;
    if (power.slots && power.slots.length > 0) {
      enhBonuses = combineWithAlphaED(
        { name: power.name, slots: power.slots, allowedEnhancements: power.allowedEnhancements },
        buildLevel,
        getIOSet,
        alphaBonuses,
        alphaEdBypassRatio,
        exemplarLevel
      );
    } else {
      enhBonuses = filterAlphaByAllowedEnhancements(alphaBonuses, power.allowedEnhancements);
    }
    const slotEndRdx = enhBonuses.endurance || 0;

    const divisor = 1 + slotEndRdx + globalEndDiscDecimal;
    const actualCost = baseEndPerSec / divisor;
    global.toggleEndCost += actualCost;
    addToBreakdown(breakdown, 'toggleEndCost', {
      name: power.name,
      value: actualCost,
      type: 'active-power',
    });
  }
}

/**
 * Apply bonuses from active toggle powers
 * Enhancement bonuses are now factored in to boost the base power values
 * Alpha incarnate bonuses are added to the enhancement bonuses for applicable aspects
 */
/**
 * Accumulated +Strength self-buffs (Power Boost family), as FRACTIONS
 * (e.g. 0.5 = +50% strength). Applied as a non-ED additive term in the
 * per-power enhancement multiplier for the matching aspect.
 */
export interface StrengthBuffs {
  defense: number;
  toHit: number;
  heal: number;
  absorb: number;
  endMod: number;
  movement: number;
  mez: number;
}

function emptyStrengthBuffs(): StrengthBuffs {
  return { defense: 0, toHit: 0, heal: 0, absorb: 0, endMod: 0, movement: 0, mez: 0 };
}

/** specialBuff keys representing defense strength (all positions + all types + Base_Defense). */
const STRENGTH_DEFENSE_KEYS = new Set([
  'defense', 'melee', 'ranged', 'aoe',
  'smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic',
]);
/** specialBuff keys representing mez strength (boosts both magnitude and duration). */
const STRENGTH_MEZ_KEYS = new Set([
  'hold', 'stun', 'sleep', 'confuse', 'fear', 'immobilize',
]);

/**
 * Collect active +Strength self-buffs (Power Boost, Power Build Up, Power Up,
 * Bass Boost, Gather Shadows, Adrenal Booster, …) from the build's active
 * powers. Each `specialBuff` entry is a Strength-aspect buff that multiplies
 * the caster's OWN matching power output — non-ED, additive with enhancement
 * strength, and it adds nothing on its own ("twice nothing is nothing").
 *
 * Within one power the defense (and mez) sub-keys are uniform — the binary
 * simply enumerates every defense/mez attribute — so we take the
 * representative (max) per power rather than summing the ~12 defense keys.
 * Across multiple active strength powers (and self-stacks via maxStacks /
 * stacksLinear) the fractions add. Returns fractions per aspect.
 */
export function collectStrengthBuffs(
  powers: PowerWithToggle[],
  archetypeId: string,
  buildLevel: number,
  targetsHitValues: Record<string, number> = {},
): StrengthBuffs {
  const sb = emptyStrengthBuffs();
  for (const power of powers) {
    const isAuto = power.powerType?.toLowerCase() === 'auto';
    if (!(isAuto || power.isActive)) continue;
    // A +Strength self-buff is, by definition, self-targeted. Legacy data for
    // foe -Special debuffs (Benumb, Weaken, Time Stop) stores the magnitude as
    // a positive `specialBuff` on a Foe-targeted power; without this gate they
    // would be counted as a caster strength buff. (Regenerated powers route
    // foe -Special to `specialDebuff` instead — see extractEffects.)
    if (power.targetType && power.targetType.toLowerCase() !== 'self') continue;
    const special = power.effects?.specialBuff as Record<string, ScalarOrScaled> | undefined;
    if (!special || typeof special !== 'object') continue;

    const targetsHit = targetsHitValues[power.internalName];
    const stacksLinear = power.effects?.stacksLinear;
    const maxStacks = power.effects?.maxStacks;
    const stackCaps = power.effects?.stackCaps;
    let defMax = 0;
    let mezMax = 0;
    for (const [key, raw] of Object.entries(special)) {
      const adjusted = adjustForStacking(raw, targetsHit, stacksLinear, 'specialBuff', maxStacks, stackCaps);
      const frac = resolveScaledEffect(adjusted, archetypeId, buildLevel);
      if (frac <= 0) continue;
      if (STRENGTH_DEFENSE_KEYS.has(key)) defMax = Math.max(defMax, frac);
      else if (STRENGTH_MEZ_KEYS.has(key)) mezMax = Math.max(mezMax, frac);
      else if (key === 'tohit') sb.toHit += frac;
      else if (key === 'heal') sb.heal += frac;
      else if (key === 'absorb') sb.absorb += frac;
      else if (key === 'endurance') sb.endMod += frac;
      else if (key === 'movement') sb.movement += frac;
    }
    sb.defense += defMax;
    sb.mez += mezMax;
  }
  return sb;
}

/**
 * One stealth-radius contribution, gathered across active powers and procs and
 * resolved together by resolveStealthRadius once every source is known.
 *
 * `stackKey` is the binary stealth-stacking group. Contributions sharing a
 * non-null key mutually suppress — only the largest radius in that key applies
 * (all "NictusFX" today: Stealth, Super Speed, Shinobi-Iri, the cloak toggles).
 * A null key stacks additively (Stalker Hide, IO procs, and Rebirth stealth,
 * whose Parse6 export can't resolve the key — a documented cross-server gap).
 */
interface StealthContribution {
  stackKey: string | null;
  /** PvE radius (feet); 0 if this source has no PvE component. */
  pve: number;
  /** PvP radius (feet); 0 if this source has no PvP component. */
  pvp: number;
  sourceName: string;
  type: 'active-power' | 'proc';
  powerName?: string;
}

/**
 * Commit the gathered stealth contributions to global.stealthRadiusPvE/PvP.
 * Per CoH mechanics each keyed (suppress) group contributes only its largest
 * radius; null-key contributions stack additively; the grand total is the sum.
 * Every contributor is recorded in the breakdown — suppressed (non-winning)
 * keyed entries are flagged `capped` so the tooltip explains why the displayed
 * total isn't the naive sum.
 */
function resolveStealthRadius(
  contribs: StealthContribution[],
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
): void {
  const axes = [
    { axis: 'pve' as const, key: 'stealthRadiusPvE' as const },
    { axis: 'pvp' as const, key: 'stealthRadiusPvP' as const },
  ];
  for (const { axis, key } of axes) {
    // Largest radius per keyed (suppress) group.
    const groupMax = new Map<string, number>();
    for (const c of contribs) {
      const v = c[axis];
      if (v <= 0 || !c.stackKey) continue;
      const cur = groupMax.get(c.stackKey);
      if (cur === undefined || v > cur) groupMax.set(c.stackKey, v);
    }
    let total = 0;
    for (const v of groupMax.values()) total += v;        // one winner per group
    for (const c of contribs) {                            // + additive (null-key)
      const v = c[axis];
      if (v > 0 && !c.stackKey) total += v;
    }
    global[key] = total;
    // Breakdown: list every contributor; mark suppressed keyed losers capped.
    for (const c of contribs) {
      const v = c[axis];
      if (v <= 0) continue;
      const suppressed = !!c.stackKey && v < (groupMax.get(c.stackKey) ?? 0);
      addToBreakdown(breakdown, key, {
        name: c.sourceName,
        value: v,
        type: c.type,
        powerName: c.powerName,
        ...(suppressed ? { capped: true } : {}),
      });
    }
  }
}

function applyActivePowerBonuses(
  powers: PowerWithToggle[],
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  buildLevel: number,
  archetypeId: string,
  alphaBonuses: EnhancementBonuses = {},
  alphaEdBypassRatio: number = 0,
  targetsHitValues: Record<string, number> = {},
  exemplarLevel?: number,
  combatMode?: boolean,
  strengthBuffs: StrengthBuffs = emptyStrengthBuffs(),
  stealthContribs: StealthContribution[] = []
): void {
  for (const power of powers) {
    // Auto powers are always active; others require explicit isActive toggle
    const isAuto = power.powerType?.toLowerCase() === 'auto';
    if (!(isAuto || power.isActive)) continue;

    // Skip ally-only buffs — the caster does not benefit from these
    // (e.g. Speed Boost, Fortitude — "you cannot use this power on yourself")
    if (power.targetType && ALLY_ONLY_TARGET_TYPES.has(power.targetType.toLowerCase())) continue;

    // Calculate enhancement bonuses for this power. The Alpha slot's
    // tier-specific ED-bypass mechanic only meaningfully changes the result
    // when both slotted IOs *and* alpha buff the same aspect — in that case
    // a naive post-ED add overstates enhancement (the slotted portion is
    // already at the ED cap, and alpha's full value lands on top instead
    // of being partially diminished). combineWithAlphaED splits alpha into
    // an ED-subject portion that joins the raw IO total before ED and a
    // bypass portion that lands after.
    let enhBonuses: EnhancementBonuses;
    if (power.slots && power.slots.length > 0) {
      enhBonuses = combineWithAlphaED(
        { name: power.name, slots: power.slots, allowedEnhancements: power.allowedEnhancements },
        buildLevel,
        getIOSet,
        alphaBonuses,
        alphaEdBypassRatio,
        exemplarLevel
      );
    } else {
      // No slots → only Alpha contributes. Same gate as combineWithAlphaED
      // applies: don't apply Alpha bonuses for aspects the power doesn't
      // accept. Without this filter, e.g. Tactical Training: Assault
      // (allowedEnhancements: EndRdx + Recharge only) would still receive
      // Alpha Intuition's +33% Damage, inflating the displayed +Damage
      // toggle bonus.
      enhBonuses = filterAlphaByAllowedEnhancements(alphaBonuses, power.allowedEnhancements);
    }

    // Toggle endurance cost calc is now handled by applyToggleEndCosts, which
    // runs after all global EndDisc sources (set bonuses, active powers,
    // incarnates) have been aggregated — so the divisor formula sees the
    // complete picture in one pass instead of needing a post-hoc rescale.

    if (!power.effects) continue;

    const effects = power.effects;
    const _debugEnabled = isCalcDebugEnabled();
    // Snapshot global bonuses before this power for diff logging
    const _debugBefore = _debugEnabled ? { ...global } : null;

    // ToHit buff (stored as decimal, convert to percentage)
    // Enhanced by ToHit enhancements
    if (effects.tohitBuff !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.tohit || 0) + strengthBuffs.toHit;
      const adjustedBuff = adjustForStacking(effects.tohitBuff as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'tohitBuff', effects.maxStacks, effects.stackCaps);
      const value = resolveScaledEffect(adjustedBuff, archetypeId, buildLevel) * 100 * enhMultiplier;
      global.toHit += value;
      addToBreakdown(breakdown, 'toHit', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // ToHit buff that ignores strength (IgnoreStrength) — NOT boosted by ToHit
    // enh or global +ToHit (e.g. Bio Armor Environmental Adaptation's +ToHit).
    if (effects.tohitBuffUnenhanced !== undefined) {
      const adjusted = adjustForStacking(effects.tohitBuffUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'tohitBuffUnenhanced', effects.maxStacks, effects.stackCaps);
      const value = resolveScaledEffect(adjusted, archetypeId, buildLevel) * 100;
      global.toHit += value;
      addToBreakdown(breakdown, 'toHit', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Accuracy buff (a flat +Accuracy self-buff like Focused Accuracy, stored as
    // a decimal). Additive into global.accuracy alongside set bonuses. Not
    // enhanced — accuracy enhancements boost attack-roll accuracy, not the
    // buff power's own +Accuracy (these powers don't slot accuracy-buff enh).
    if (effects.accuracyBuff !== undefined) {
      const adjustedBuff = adjustForStacking(effects.accuracyBuff as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'accuracyBuff', effects.maxStacks, effects.stackCaps);
      const value = resolveScaledEffect(adjustedBuff, archetypeId, buildLevel) * 100;
      global.accuracy += value;
      addToBreakdown(breakdown, 'accuracy', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Damage buff (e.g. Assault, Build Up, Fulcrum Shift).
    // NOT enhanced: a +Damage buff is a fixed buff to the target's Damage
    // strength — Damage enhancements and global +Damage raise the OUTPUT of
    // attack powers, not the magnitude of a buff, and no "Damage Buff"
    // enhancement exists in CoH. (Same as accuracyBuff / tohitBuffUnenhanced.)
    if (effects.damageBuff !== undefined) {
      const adjustedBuff = adjustForStacking(effects.damageBuff as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'damageBuff', effects.maxStacks, effects.stackCaps);
      const value = resolveScaledEffect(adjustedBuff, archetypeId, buildLevel) * 100;
      global.damage += value;
      addToBreakdown(breakdown, 'damage', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Damage debuff (self-penalty, e.g. Granite Armor -30% damage)
    // Only applied when the value is self-directed (toWho:'Self') — most
    // damageDebuff effects target enemies. Unenhanceable — self-debuffs are not
    // boosted by slotted enhancements.
    // Skip crash debuffs: if a power also has damageBuff, the debuff is a crash effect
    // (e.g., Rage: 120s buff + 10s crash) and should not count as sustained damage
    if (isSelfDirectedEffect(effects.damageDebuff) && effects.damageBuff === undefined) {
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
      const enhMultiplier = 1 + (enhBonuses.defense || enhBonuses.defenseBuff || 0) + strengthBuffs.defense;
      for (const [type, value] of Object.entries(defenseEffects)) {
        const adjustedDef = adjustForStacking(value, targetsHitValues[power.internalName], effects.stacksLinear, 'defenseBuff', effects.maxStacks, effects.stackCaps);
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
      const enhMultiplier = 1 + (enhBonuses.defense || enhBonuses.defenseBuff || 0) + strengthBuffs.defense;
      for (const [type, value] of Object.entries(effects.defenseBuffSuppressible)) {
        const adjustedDef = adjustForStacking(value, targetsHitValues[power.internalName], effects.stacksLinear, 'defenseBuff', effects.maxStacks, effects.stackCaps);
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
        const adjustedRes = adjustForStacking(value, targetsHitValues[power.internalName], effects.stacksLinear, 'resistance', effects.maxStacks, effects.stackCaps);
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
          effects.maxStacks,
          effects.stackCaps,
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

    // Movement (top-level scalar form). Stack-aware. All movement attribs —
    // speed AND jump height — scale by their AT table; see resolveMovementPercent.
    // Enhanced by slotted Run/Fly/Jump enhancements (and Alpha), mirroring the
    // fitness-inherent path: resolved percent * (1 + enhBonuses[aspect]). The
    // enhBonuses object is already filtered to aspects the power accepts, so a
    // non-enhanceable movement power simply sees a 1.0 multiplier.
    if (effects.runSpeed !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.run || 0);
      const adjusted = adjustForStacking(effects.runSpeed as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'runSpeed', effects.maxStacks, effects.stackCaps);
      const value = resolveMovementPercent(adjusted, 'runSpeed', archetypeId, buildLevel) * enhMultiplier;
      global.runSpeed += value;
      addToBreakdown(breakdown, 'runSpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Unenhanceable run-speed template (IgnoreStrength) — e.g. Sprint's second
    // RunningSpeed effect. Contributes flat, NO enhancement multiplier.
    if (effects.runSpeedUnenhanced !== undefined) {
      const adjusted = adjustForStacking(effects.runSpeedUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'runSpeedUnenhanced', effects.maxStacks, effects.stackCaps);
      const value = resolveMovementPercent(adjusted, 'runSpeed', archetypeId, buildLevel);
      global.runSpeed += value;
      addToBreakdown(breakdown, 'runSpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.flySpeed !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.fly || 0);
      const adjusted = adjustForStacking(effects.flySpeed as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'flySpeed', effects.maxStacks, effects.stackCaps);
      const value = resolveMovementPercent(adjusted, 'flySpeed', archetypeId, buildLevel) * enhMultiplier;
      global.flySpeed += value;
      addToBreakdown(breakdown, 'flySpeed', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.jumpHeight !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.jump || 0);
      const adjusted = adjustForStacking(effects.jumpHeight as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'jumpHeight', effects.maxStacks, effects.stackCaps);
      const value = resolveMovementPercent(adjusted, 'jumpHeight', archetypeId, buildLevel) * enhMultiplier;
      global.jumpHeight += value;
      addToBreakdown(breakdown, 'jumpHeight', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    if (effects.jumpSpeed !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.jump || 0);
      const adjusted = adjustForStacking(effects.jumpSpeed as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'jumpSpeed', effects.maxStacks, effects.stackCaps);
      const value = resolveMovementPercent(adjusted, 'jumpSpeed', archetypeId, buildLevel) * enhMultiplier;
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
      // Enhancement aspect per global movement key (runSpeed→run, fly→fly,
      // jump→jump). Same enhBonuses-multiplier treatment as the scalar path.
      const movementAspectMap: Record<string, keyof EnhancementBonuses> = {
        runSpeed: 'run',
        flySpeed: 'fly',
        jumpHeight: 'jump',
        jumpSpeed: 'jump',
      };
      for (const [type, val] of Object.entries(effects.movement)) {
        const key = movementKeyMap[type];
        if (key && key in global) {
          // Stack-aware: stacksLinear uses the bare effect key (e.g. 'runSpeed'),
          // matching what classifyTemplateForStacking produces.
          const enhMultiplier = 1 + (enhBonuses[movementAspectMap[key]] || 0);
          const adjusted = adjustForStacking(val as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, type, effects.maxStacks, effects.stackCaps);
          const value = resolveMovementPercent(adjusted, key, archetypeId, buildLevel) * enhMultiplier;
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
    // Applied PER ENTRY when that entry is self-directed (toWho:'Self') — most
    // slow effects target enemies, and a foe slow can sit in the same `slow` map
    // as a self slow (Rebirth Granite: self -Run + foe -JumpHeight). Gating
    // per-entry keeps the foe half off the caster. Unenhanceable.
    if (effects.slow && typeof effects.slow === 'object') {
      const slowKeyMap: Record<string, keyof GlobalBonuses> = {
        runSpeed: 'runSpeed',
        flySpeed: 'flySpeed',
        fly: 'flySpeed',
        jumpHeight: 'jumpHeight',
        jumpSpeed: 'jumpSpeed',
      };
      for (const [type, val] of Object.entries(effects.slow)) {
        if (!isSelfDirectedEffect(val)) continue;
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
      const adjusted = adjustForStacking(effects.rechargeBuff, targetsHitValues[power.internalName], effects.stacksLinear, 'rechargeBuff', effects.maxStacks, effects.stackCaps);
      const value = extractScaleValue(adjusted) * 100;
      global.recharge += value;
      addToBreakdown(breakdown, 'recharge', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Recharge debuff (self-penalty, e.g. Granite Armor -65% recharge)
    // Only applied when the value is self-directed (toWho:'Self') — most
    // rechargeDebuff effects target enemies. Unenhanceable.
    if (isSelfDirectedEffect(effects.rechargeDebuff)) {
      const value = resolveScaledEffect(effects.rechargeDebuff as ScalarOrScaled, archetypeId, buildLevel) * -100;
      global.recharge += value;
      addToBreakdown(breakdown, 'recharge', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Regeneration buff
    // Enhanced by Healing enhancements (slotted) AND by +Healing Strength
    // set bonuses (Numina 4pc, Panacea 6pc, Miracle 4pc, etc.). HC's
    // heal-strength buffs increase the heal_enh multiplier applied to
    // regen-producing powers, post-ED. The `global.healOther` accumulator
    // is populated by set-bonuses.ts from `healing_strength` bonuses; we
    // read it here so it actually contributes to per-power regen.
    // Skip Res_Boolean tables — those are regen debuff resistance, not regen buffs
    if (effects.regenBuff !== undefined) {
      const regenVal = effects.regenBuff as ScalarOrScaled;
      const regenTable = (typeof regenVal === 'object' && regenVal !== null && 'table' in regenVal)
        ? (regenVal as { table?: string }).table ?? ''
        : '';
      if (!regenTable.toLowerCase().includes('res_boolean')) {
        const enhMultiplier = 1 + (enhBonuses.heal || 0) + ((global.healOther || 0) / 100);
        const adjustedRegen = adjustForStacking(regenVal, targetsHitValues[power.internalName], effects.stacksLinear, 'regenBuff', effects.maxStacks, effects.stackCaps);
        const value = resolveScaledEffect(adjustedRegen, archetypeId, buildLevel) * 100 * enhMultiplier;
        // If the power also has an unenhanced portion, combine into one breakdown entry
        const adjustedRegenUnenh = effects.regenBuffUnenhanced !== undefined
          ? adjustForStacking(effects.regenBuffUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'regenBuffUnenhanced', effects.maxStacks, effects.stackCaps)
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
      const adjustedUnenhOnly = adjustForStacking(effects.regenBuffUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'regenBuffUnenhanced', effects.maxStacks, effects.stackCaps);
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
        const adjustedRecovery = adjustForStacking(recBuff, targetsHitValues[power.internalName], effects.stacksLinear, 'recoveryBuff', effects.maxStacks, effects.stackCaps);
        const value = resolveScaledEffect(adjustedRecovery, archetypeId, buildLevel) * 100 * enhMultiplier;
        global.recovery += value;
        addToBreakdown(breakdown, 'recovery', {
          name: power.name,
          value,
          type: 'active-power',
        });
      }
    }

    // Recovery buff that ignores strength (IgnoreStrength) — NOT boosted by End
    // Mod enh or global +recovery (e.g. Bio Armor adaptation's ride-along recovery).
    if (effects.recoveryBuffUnenhanced !== undefined) {
      const adjusted = adjustForStacking(effects.recoveryBuffUnenhanced as ScalarOrScaled, targetsHitValues[power.internalName], effects.stacksLinear, 'recoveryBuffUnenhanced', effects.maxStacks, effects.stackCaps);
      const value = resolveScaledEffect(adjusted, archetypeId, buildLevel) * 100;
      global.recovery += value;
      addToBreakdown(breakdown, 'recovery', {
        name: power.name,
        value,
        type: 'active-power',
      });
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
    // Routed to global.endurance (canonical EndDisc accumulator) so toggle cost
    // and the dashboard "End Disc" stat see a single unified sum.
    if (effects.enduranceDiscount !== undefined) {
      const discount = resolveScaledEffect(effects.enduranceDiscount, archetypeId, buildLevel) * 100;
      if (discount > 0) {
        global.endurance += discount;
        addToBreakdown(breakdown, 'endurance', {
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
      // Knockback and Knockup map to the same protKnockback stat and must be
      // counted once per power, not summed (see the mezProtTypes note below).
      let kbProtFromObj = 0;
      for (const [type, mag] of Object.entries(effects.protection)) {
        const key = protMapping[type.toLowerCase()];
        if (!key || !(key in global)) continue;
        if (key === 'protKnockback') {
          kbProtFromObj = Math.max(kbProtFromObj, mag);
        } else {
          global[key] += mag;
          addToBreakdown(breakdown, key, {
            name: power.name,
            value: mag,
            type: 'active-power',
          });
        }
      }
      if (kbProtFromObj > 0) {
        global.protKnockback += kbProtFromObj;
        addToBreakdown(breakdown, 'protKnockback', {
          name: power.name,
          value: kbProtFromObj,
          type: 'active-power',
        });
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
      // Knockup is mechanically the same as knockback for protection purposes
      // — powers like Evasive Maneuvers list `kKnockup kKnockback` together in
      // the .powers source and the bin emits separate `knockup`/`knockback`
      // templates with the same scale. Both feed the same protKnockback stat.
      { field: 'knockup', key: 'protKnockback' },
    ];

    // Knockback and Knockup protection are the SAME physical stat in CoH: a
    // single power grants both at an equal magnitude, and the bin emits paired
    // Knockup/Knockback templates with identical scale (see the {field:'knockup'}
    // entry above). Summing them via `+=` would DOUBLE this power's KB protection
    // (e.g. Bo Ryaku showing ~14 instead of ~7, Unyielding ~20 instead of ~10).
    // Accumulate the pair's contribution into a single per-power value (take the
    // max — they are always equal) and add it once after the loop. Different
    // powers still stack because each power runs this block separately.
    let kbProtFromThisPower = 0;
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
      const isKbSelfProt = (field === 'knockback' || field === 'knockup') &&
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
          if (key === 'protKnockback') {
            // Fold the Knockback/Knockup pair into one contribution (see note above).
            kbProtFromThisPower = Math.max(kbProtFromThisPower, mag);
          } else {
            global[key] += mag;
            addToBreakdown(breakdown, key, {
              name: power.name,
              value: mag,
              type: 'active-power',
            });
          }
        }
      }
    }
    if (kbProtFromThisPower > 0) {
      global.protKnockback += kbProtFromThisPower;
      addToBreakdown(breakdown, 'protKnockback', {
        name: power.name,
        value: kbProtFromThisPower,
        type: 'active-power',
      });
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

    // Stealth Radius — only COLLECTED here; the grouped max+sum is committed to
    // global.stealthRadius* by resolveStealthRadius once procs are gathered too.
    // Powers in a shared suppress group (binary stack_key, e.g. "NictusFX":
    // Stealth, Super Speed, Shinobi-Iri, the cloak toggles) don't stack — only
    // the largest applies; everything else stacks additively. That's why a
    // Stealth IO (its own group) lands on top of a stealth power toward the
    // invisibility cap, while Super Speed + pool Stealth (same group) don't add.
    if (effects.stealth) {
      const pve = effects.stealth.stealthPvE !== undefined
        ? resolveScaledEffect(effects.stealth.stealthPvE, archetypeId, buildLevel) : 0;
      const pvp = effects.stealth.stealthPvP !== undefined
        ? resolveScaledEffect(effects.stealth.stealthPvP, archetypeId, buildLevel) : 0;
      if (pve > 0 || pvp > 0) {
        stealthContribs.push({
          stackKey: effects.stealth.stackKey ?? null,
          pve,
          pvp,
          sourceName: power.name,
          type: 'active-power',
        });
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

    // Range Buff (Boost Range, Aim's +Range, …) → global +Range.
    // Only aggregate Self-targeted buffs: the same `rangeBuff` field on a
    // Foe-targeted attack (Blazing Bolt, Moonbeam, every snipe) is the per-power
    // Fast Snipe range bump — gated on a ≥22% ToHit buff in game — not a
    // persistent caster buff, so it must not feed the character's Range total.
    // This mirrors the shouldShowToggle exclusion in power-row-utils.
    if (effects.rangeBuff !== undefined && power.targetType?.toLowerCase() === 'self') {
      const adjusted = adjustForStacking(effects.rangeBuff, targetsHitValues[power.internalName], effects.stacksLinear, 'rangeBuff', effects.maxStacks, effects.stackCaps);
      const val = resolveScaledEffect(adjusted, archetypeId, buildLevel) * 100;
      if (val > 0) {
        global.range += val;
        addToBreakdown(breakdown, 'range', {
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
  // Fallback: use a default multiplier of 0.10 for resistance/defense tables.
  // Deduped per (table, archetype) so a recurring miss (e.g. Melee_Buff_Dmg on
  // damage buffs, which has no AT table) logs once instead of flooding on every
  // recalc.
  if (effect.table) {
    warnFallback('resolveScaledEffect', `AT table "${effect.table}" not found for "${archetypeId}" — using fallback 0.10`);
  }
  return effect.scale * 0.10;
}

/**
 * Resolve a movement effect to its displayed percentage (the value added to
 * global.runSpeed/flySpeed/jumpSpeed/jumpHeight).
 *
 * ALL movement attribs — run/fly/jump SPEED *and* jump HEIGHT — scale by their
 * AT modifier table, like every other buff: `scale × AT-table × 100`. E.g.
 * Super Speed `RunningSpeed 1.0 × Melee_SpeedRunning` (3.5 @50) = +350%; Ninja
 * Run jumpHeight `0.25 × Melee_Leap` (27.8 @50) = +695%. The bare-scale reading
 * (×100, no table) gave absurdly slow travel powers (Super Speed ≈ 28 mph) and
 * an order-of-magnitude-too-small jump height (Ninja Run +25% → ~5 ft vs the
 * in-game ~25-30 ft onto a rooftop ledge — Redlynne, Rebirth, 2026-06-16).
 *
 * Jump height was previously special-cased to bare scale, which collapsed a
 * deliberate bin distinction: Ninja Run / Beast Run use the BIG `Melee_Leap`
 * table (27.8) while Sprint / the prestige sprints use flat `Melee_Ones` (1.0,
 * → +10% either way). That table choice is only meaningful if the table is
 * applied — so jump height is table-aware too. Verified vs Rebirth/HC
 * `powers.bin`: Ninja Run `0.25×27.8` → +695%, Hurdle `0.06×27.8` → +167%,
 * Sprint `0.1×Melee_Ones` → +10%.
 */
function resolveMovementPercent(
  effect: ScalarOrScaled | undefined,
  _movementKey: string,
  archetypeId: string,
  level: number,
): number {
  return resolveScaledEffect(effect, archetypeId, level) * 100;
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
 *
 * Movement stats (runSpeed, flySpeed, jumpSpeed, jumpHeight) are resolved at
 * runtime through their AT table — Swift's RunningSpeed is `scale 0.1 ×
 * Melee_SpeedRunning` (3.5 at L50) = +35%, not the bare +10%; Hurdle's jumpHeight
 * is `0.06 × Melee_Leap` (27.8) = +167% — so the `value` below is only a fallback
 * (see the FITNESS_MOVEMENT_STATS branch in applyFitnessPowerBonuses). The
 * Melee_Ones buffs (regen, recovery) equal scale × 100, so their `value` is
 * authoritative.
 *
 *   Swift:   runSpeed  { scale: 0.1,  table: 'Melee_SpeedRunning' } → table-resolved (~35% @50)
 *            flySpeed  { scale: 0.1,  table: 'Melee_SpeedFlying' }  → table-resolved (~14% @50)
 *   Hurdle:  jumpHeight { scale: 0.06, table: 'Melee_Leap' }        → table-resolved (~167% @50)
 *   Health:  regenBuff  { scale: 0.4,  table: 'Melee_Ones' }        → 40%
 *   Stamina: recoveryBuff { scale: 0.25, table: 'Melee_Ones' }      → 25%
 */
interface FitnessEffect {
  stat: keyof GlobalBonuses;
  value: number;
  enhancementType: string;
}

/** Fitness stats whose `value` is a fallback — resolved via AT table at runtime. */
const FITNESS_MOVEMENT_STATS = new Set<keyof GlobalBonuses>(['runSpeed', 'flySpeed', 'jumpSpeed', 'jumpHeight']);

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
  alphaEdBypassRatio: number = 0,
  exemplarLevel?: number
): void {
  const fitnessPowers = (build.inherents || []).filter(
    (p) => p.inherentCategory === 'fitness'
  );

  for (const power of fitnessPowers) {
    const effects = FITNESS_POWER_EFFECTS[power.internalName];
    if (!effects) continue;

    // Calculate enhancement bonus for this power (see comment on
    // applyActivePowerBonuses for why we use combineWithAlphaED here).
    const enhBonuses = combineWithAlphaED(
      power,
      globalIOLevel,
      getIOSet,
      alphaBonuses,
      alphaEdBypassRatio,
      exemplarLevel
    );

    const _fitnessDebugEffects: { stat: string; base: number; enhanced: number; enhBonus: number }[] = [];
    for (const effect of effects) {
      // Get the enhancement multiplier for this effect's type
      const enhMultiplier = 1 + (enhBonuses[effect.enhancementType] || 0);

      // Movement stats resolve through the AT table at the build level (Swift's
      // RunningSpeed scales by Melee_SpeedRunning, etc.) just like active-power
      // movement — see resolveMovementPercent. Non-movement stats (regen,
      // recovery) keep their fixed Melee_Ones value. Falls back to the hardcoded
      // value if the inherent def somehow lacks the effect.
      let baseValue = effect.value;
      if (FITNESS_MOVEMENT_STATS.has(effect.stat)) {
        const movEffect = (power.effects as Record<string, ScalarOrScaled> | undefined)?.[effect.stat];
        if (movEffect !== undefined) {
          baseValue = resolveMovementPercent(movEffect, effect.stat, build.archetype.id || '', globalIOLevel);
        }
      }

      // Calculate final value: base * (1 + enhancement%)
      const finalValue = baseValue * enhMultiplier;

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
  // Primary/secondary powers carry execution stats under `stats`; pool/epic
  // powers carry them under `effects` (transformPoolPower never builds a
  // `stats` object). Both fields are read with stats winning when present.
  stats?: { recharge?: number; castTime?: number; radius?: number; arc?: number };
  effects?: { recharge?: number; castTime?: number; radius?: number; arc?: number };
}

/**
 * Collect all "always-on" procs from the build
 * These are Global and Proc120s enhancements slotted in Auto or active Toggle powers
 */
function collectAlwaysOnProcs(build: Build): SlottedProc[] {
  const procs: SlottedProc[] = [];

  const looksLikeLegacyProcSlot = (slotName: string, procData: NonNullable<ReturnType<typeof findProcData>>): boolean => {
    const slot = (slotName || '').toLowerCase();
    const io = (procData.ioName || '').toLowerCase();
    if (!slot || !io) return false;
    if (slot === io) return true;
    // Legacy extractor names often prepend aspect text, e.g.
    // "Recharge/Resistance Bonus" for ioName "Resistance Bonus".
    if (slot.includes(io)) return true;
    // Placeholder names emitted for unresolved proc pieces.
    if (slot === 'chance' || slot === 'recharge/chance') return true;
    return false;
  };

  const processPower = (power: PowerForProcScan) => {
    if (!power.slots) return;

    const powerType = power.powerType?.toLowerCase() || '';
    const isAlwaysActive = powerType === 'auto' || (powerType === 'toggle' && power.isActive);

    for (const slot of power.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;

      // Look up proc data
      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData) continue;

      // Primary path: explicit proc flag.
      // Legacy safety net: some old extracted pieces shipped with proc:false
      // despite being real always-on globals. Accept only when the slot name
      // still clearly identifies the proc entry to avoid broad false positives.
      if (!ioSlot.isProc && !looksLikeLegacyProcSlot(ioSlot.name, procData)) continue;

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
  valueMax: number | undefined,
  effectType: string | undefined,
  sourceName: string,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  powerName: string | undefined,
  stealthContribs: StealthContribution[]
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
        powerName,
      });
      break;

    case 'Regeneration':
      global.regeneration += value;
      addToBreakdown(breakdown, 'regeneration', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
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
        powerName,
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
        powerName,
      });
      break;

    case 'MaxHP':
      global.maxHP += value;
      addToBreakdown(breakdown, 'maxHP', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'Defense':
      // Apply typed defense when provided; "All" expands to all entries.
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
            powerName,
          });
        }
      } else {
        const specificDefMap: Record<string, keyof GlobalBonuses> = {
          melee: 'defMelee', ranged: 'defRanged', aoe: 'defAoE', area: 'defAoE',
          smashing: 'defSmashing', lethal: 'defLethal', fire: 'defFire', cold: 'defCold',
          energy: 'defEnergy', negative: 'defNegative', psionic: 'defPsionic', toxic: 'defToxic',
        };
        const defKey = specificDefMap[effectType?.toLowerCase() || ''];
        if (defKey) {
          global[defKey] += value;
          addToBreakdown(breakdown, defKey as string, {
            name: sourceName,
            value,
            type: 'proc',
            powerName,
          });
        }
      }
      break;

    case 'Absorb':
      global.absorb += value;
      addToBreakdown(breakdown, 'absorb', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
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
            powerName,
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
            powerName,
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
        powerName,
      });
      break;

    case 'Recharge':
      global.recharge += value;
      addToBreakdown(breakdown, 'recharge', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'RunSpeed':
      global.runSpeed += value;
      addToBreakdown(breakdown, 'runSpeed', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'MezResist':
      global.mezResist += value;
      addToBreakdown(breakdown, 'mezResist', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'SlowResistance':
      global.debuffResistSlow += value;
      addToBreakdown(breakdown, 'debuffResistSlow', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'RechargeResistance':
      global.debuffResistRecharge += value;
      addToBreakdown(breakdown, 'debuffResistRecharge', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'KnockbackProtection':
      global.protKnockback += value;
      addToBreakdown(breakdown, 'protKnockback', {
        name: sourceName,
        value,
        type: 'proc',
        powerName,
      });
      break;

    case 'Stealth': {
      // Stealth IO procs (Celerity, Unbounded Leap, Freebird, …) are their own
      // additive group — they land on top of any stealth power toward the
      // invisibility cap. A stealth ProcEffect carries the PvE radius in `value`
      // and the PvP radius in `valueMax`, but stealth IOs split these across two
      // effects:
      //   { value: 30 }                 → PvE-only  (30 ft)
      //   { value: 300, valueMax: 300 } → PvP-only  (value duplicates valueMax)
      // Guard the PvE side on `value !== valueMax` so the duplicated PvP
      // magnitude never leaks into the PvE radius. Collected with a null
      // stackKey (additive) and resolved by resolveStealthRadius.
      const pvp = valueMax !== undefined ? valueMax : 0;
      const pve = valueMax === undefined ? value : (value !== valueMax ? value : 0);
      stealthContribs.push({
        stackKey: null,
        pve,
        pvp,
        sourceName,
        type: 'proc',
        powerName,
      });
      break;
    }

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
  Absorb:            'absorb',
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
  procSettings: ProcSettings | undefined,
  stealthContribs: StealthContribution[],
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

    const sourceName = `${proc.setName}: ${proc.procName}`;

    // Binary-sourced structured effects (falls back to the mechanics parse).
    // Each effect goes through the same category-filter + Rule-of-5 gate.
    for (const eff of getProcEffects(procData)) {
      if (eff.value === undefined || !isProcCategoryEnabled(eff.category, procSettings)) continue;
      // Skip pet/ally buffs (MM auras) and chance-gated procs — they don't
      // contribute a steady bonus to the PLAYER's dashboard.
      if ('target' in eff && eff.target === 'pets') continue;
      if ('chance' in eff && eff.chance !== undefined && eff.chance < 1) continue;
      const stat = eff.category ? PROC_CATEGORY_TO_STAT[eff.category] : undefined;
      const allowed = stat === undefined
        ? true  // No stat mapping: not subject to Rule of 5 (e.g., KB protection)
        : stat === null
          ? false // Explicitly excluded
          : trackBonus(tracking, stat, eff.value, sourceName, proc.powerName);

      if (allowed) {
        applySingleProcEffect(eff.category, eff.value, eff.valueMax, eff.effectType, sourceName, global, breakdown, proc.powerName, stealthContribs);
      } else if (stat) {
        // Rule of 5 rejected — add a capped entry so it appears in the tooltip
        addToBreakdown(breakdown, stat, {
          name: sourceName,
          value: eff.value,
          type: 'proc',
          capped: true,
          powerName: proc.powerName,
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

      const effects = getProcEffects(procData);
      const procsPerMin = calculateAutoToggleProcsPerMinute(procData.ppm);
      const sourceName = `${procData.setName}: ${ioSlot.name} (PPM)`;

      // Helper to apply a single PPM effect contribution
      const applyPPMEffect = (category: string | undefined, value: number | undefined, duration: number | undefined, suffix?: string) => {
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
            if (duration && duration > 0) {
              // Stacking DURATION regen BUFF (e.g. Unrelenting Fury: +15% /
              // Superior +20% Regeneration for ~10.25s, StackType=Stack). `value`
              // is the per-stack regen %, NOT a one-shot HP grant — do NOT run it
              // through the instant-grant rate conversion (that inflates +20% into
              // ~+430%). The steady-state contribution is the per-stack value ×
              // the expected number of concurrently-active stacks, which by
              // Little's law is arrivalRate × buff lifetime. procsPerMin is already
              // area/rate-clamped (≤ ~5.4 for toggles), so this lands near the low
              // end of the buff's transient 1–5-stack range — the honest average.
              const avgStacks = (procsPerMin / 60) * duration;
              const effectivePct = value * avgStacks;
              global.regeneration += effectivePct;
              addToBreakdown(breakdown, 'regeneration', { name: label, value: effectivePct, type: 'proc' });
            } else {
              // Genuine instant per-proc regen grant (no buff duration): convert
              // the one-shot to an equivalent sustained regen rate.
              const regenVal = (value * procsPerMin) / 60;
              const regenPct = (regenVal / BASE_REGEN_RATE) * 100;
              global.regeneration += regenPct;
              addToBreakdown(breakdown, 'regeneration', { name: label, value: regenPct, type: 'proc' });
            }
            break;
          }
          // Other PPM categories (Damage, Control, etc.) don't contribute to dashboard stats
        }
      };

      // Apply each structured effect (e.g., Panacea's +HP + +End)
      for (const e of effects) {
        applyPPMEffect(e.category, e.value, e.duration, effects.length > 1 ? e.category : undefined);
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

    // Fall back to `effects` so pool/epic click powers (Wall of Force,
    // Spring Attack, etc.) contribute Build Up proc averages instead of
    // silently using the radius=0 / recharge=4 defaults. arcToDegrees
    // handles the radians-stored arc from both sources.
    const baseRecharge = power.stats?.recharge ?? power.effects?.recharge ?? 4;
    const castTime = power.stats?.castTime ?? power.effects?.castTime ?? 1;
    const radius = power.stats?.radius ?? power.effects?.radius ?? 0;
    const rawArc = power.stats?.arc ?? power.effects?.arc;
    const arcDegrees = radius > 0 ? (arcToDegrees(rawArc) || 360) : 360;

    for (const slot of power.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;
      if (!ioSlot.isProc) continue;

      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData || procData.type !== 'Proc' || procData.ppm === null) continue;

      // A Build Up proc is a self-buff Damage effect with a duration (regular
      // damage procs carry a valueMax range and no duration), plus a ToHit buff.
      const effects = getProcEffects(procData);
      const dmgE = effects.find((e) => e.category === 'Damage' && e.duration !== undefined);
      if (!dmgE) continue;
      const toHitE = effects.find((e) => e.category === 'ToHit');

      buildUpProcs.push({
        procName: ioSlot.name,
        setName: procData.setName,
        ppm: procData.ppm,
        damage: dmgE.value || 0,
        toHit: toHitE?.value || 0,
        duration: dmgE.duration || 10,
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
  incarnateActive: IncarnateActiveState | undefined,
  incarnatesSuppressed = false,
): EnhancementBonuses {
  // Exemplared below 45 — incarnate abilities are off entirely.
  if (incarnatesSuppressed) return {};
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
  // Musculature / Agility carry `enduranceModification` in the alpha data
  // but every downstream gate in enhancement-values keys this aspect as
  // `enduranceMod`. Writing the long form here used to drop the bonus
  // silently in filterAlphaByAllowedEnhancements.
  if (alphaEffects.enduranceModification !== undefined) bonuses.enduranceMod = alphaEffects.enduranceModification;
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

    // Endurance discount (e.g., Hybrid Support T4 passive) flows into the
    // canonical EndDisc accumulator (global.endurance) — same bucket set
    // bonuses use — so the divisor formula in applyToggleEndCosts and the
    // dashboard "End Disc" stat both pick it up.
    if (stat === 'enduranceDiscount') {
      const value = decimal * 100;
      global.endurance += value;
      addToBreakdown(breakdown, 'endurance', { name: sourceName, value, type: 'incarnate' });
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
 * The active Genesis amplifier (Rebirth-only), or null. Genesis is toggleable,
 * so it only contributes when its slot toggle is on.
 */
function getActiveGenesis(
  incarnates: IncarnateBuildState | undefined,
  active: { genesis?: boolean },
): GenesisEffects | null {
  if (!incarnates?.genesis || active.genesis === false) return null;
  return getGenesisEffects(incarnates.genesis.powerId);
}

/**
 * Scale a Destiny effect block by a factor (used by Fate Genesis, which
 * amplifies Destiny slot ability effects). Only the numeric stat fields are
 * scaled — level shift and the duration metadata are left untouched.
 */
function scaleDestinyEffects(fx: DestinyEffects, factor: number): DestinyEffects {
  const skip = new Set(['levelShift', 'initialDuration', 'totalDuration']);
  const scaled: DestinyEffects = { ...fx };
  for (const [k, v] of Object.entries(fx)) {
    if (skip.has(k) || typeof v !== 'number') continue;
    (scaled as Record<string, number>)[k] = v * factor;
  }
  return scaled;
}

/**
 * Below level 45, a slotted+active Fate Genesis grants its exemplar buff (a
 * PBAoE ally buff: +Recharge / +Recovery, applied to self here as peak values
 * like Destiny). It's the only incarnate contribution that survives below 45 —
 * Verdict/Socket/Data exemplar powers are attacks/procs/pets (display-only).
 * The exemplar Fate buff feeds only +Recharge/+Recovery here; its mez protection
 * stays display-only (the full Destiny slot DOES wire mez protection into the
 * status-protection totals — see the Destiny block in applyIncarnateBonuses).
 */
function applyGenesisExemplarBuff(
  incarnates: IncarnateBuildState | undefined,
  active: { genesis?: boolean },
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
): void {
  const genesis = getActiveGenesis(incarnates, active);
  if (!genesis || genesis.tree !== 'fate') return;
  const ex = genesis.exemplarEffect;
  if (!ex || ex.kind !== 'buff') return;

  const sourceName = `${genesis.displayName} (exemplar)`;
  if (ex.stats.recharge) {
    const value = ex.stats.recharge * 100;
    global.recharge += value;
    addToBreakdown(breakdown, 'recharge', { name: sourceName, value, type: 'incarnate' });
  }
  if (ex.stats.recovery) {
    const value = ex.stats.recovery * 100;
    global.recovery += value;
    addToBreakdown(breakdown, 'recovery', { name: sourceName, value, type: 'incarnate' });
  }
}

/**
 * Apply bonuses from incarnate powers
 * Alpha provides enhancement bonuses, Destiny/Hybrid provide direct stat bonuses
 * Interface is proc-based and doesn't provide direct stats
 *
 * Genesis (Rebirth-only) amplifies a partner slot rather than granting flat
 * buffs: Socket adds player Max HP / Max End here; Fate scales the Destiny block
 * applied below. Verdict (Judgement damage) and Data (Lore pets) are display-only
 * and handled in the Info panel, not on the dashboard.
 */
function applyIncarnateBonuses(
  incarnates: IncarnateBuildState | undefined,
  incarnateActive: IncarnateActiveState | undefined,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  levelShiftActive = true,
  incarnatesSuppressed = false,
  destinyTime: number | null | undefined = undefined,
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
    genesis: true,
  };

  // Exemplared below 45: all normal incarnate bonuses are off. The ONLY
  // contribution that survives is Genesis's below-45 exemplar power — and of
  // the four trees, only Fate's grants a self stat-buff. The attack/proc/summon
  // are display-only (handled in the Info panel), so we return after it.
  if (incarnatesSuppressed) {
    applyGenesisExemplarBuff(incarnates, active, global, breakdown);
    return;
  }

  // Fate Genesis amplifies the Destiny block applied below.
  const genesis = getActiveGenesis(incarnates, active);
  const fateMultiplier = genesis?.tree === 'fate' ? genesis.tierPercent : 0;

  // Alpha - Enhancement bonuses are handled separately via getAlphaEnhancementBonuses()
  // They are applied in applyActivePowerBonuses() to boost power effectiveness
  // The dashboard doesn't show enhancement % directly, but the effect shows in toggle power stats

  // Destiny - Direct stat bonuses (defense, resistance, regen, recovery, etc.)
  // Note: These are initial/peak values since effects diminish over time
  if (incarnates.destiny && active.destiny) {
    // null → resolve at this power's sustained floor (the conservative default);
    // a number → that exact time; undefined → legacy flat peak.
    const effectiveDestinyTime = destinyTime === null
      ? getDestinySustainedFloorTime(incarnates.destiny.powerId)
      : destinyTime;
    let destinyEffects = getDestinyEffectsAtTime(incarnates.destiny.powerId, effectiveDestinyTime);
    if (destinyEffects) {
      // Alpha enhances Destiny buffs the game says accept its aspects — gated by
      // the power's boosts_allowed (Cardiac's resistance boosts Barrier's res,
      // etc.). Something Mids doesn't model. Only when the Alpha slot is active.
      let alphaEnhanced = false;
      if (incarnates.alpha && active.alpha) {
        const before = destinyEffects;
        destinyEffects = applyAlphaToDestiny(
          destinyEffects,
          getDestinyBoostsAllowed(incarnates.destiny.powerId),
          getAlphaEffects(incarnates.alpha.powerId),
        );
        alphaEnhanced = destinyEffects !== before;
      }

      // Fate Genesis (Rebirth) boosts Destiny ability effects by its tier %.
      if (fateMultiplier > 0) {
        destinyEffects = scaleDestinyEffects(destinyEffects, 1 + fateMultiplier);
      }
      const powerName =
        (fateMultiplier > 0
          ? `${incarnates.destiny.displayName} (+${(fateMultiplier * 100).toFixed(1)}% Genesis)`
          : incarnates.destiny.displayName) + (alphaEnhanced ? ' (+Alpha)' : '');

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

      // Healing Received (Res(Heal) buff, e.g. Incandescence). Stored positive
      // = more healing received. Its own total — NOT damage resistance (the
      // pre-fix `resistanceAll` mapping wrongly subtracted this from all 8 res
      // types).
      if (destinyEffects.healReceived !== undefined) {
        const value = destinyEffects.healReceived * 100;
        global.healReceived += value;
        addToBreakdown(breakdown, 'healReceived', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Mez Protection (Clarion) — a flat magnitude to all six control types.
      // Raw Mag points, NOT ×100 (that scaling is for percent stats only). This
      // was previously dropped by the converter and treated as display-only;
      // Clarion's whole purpose is mez protection, so it now feeds the
      // status-protection totals like any protection source.
      if (destinyEffects.mezProtection !== undefined) {
        const mag = destinyEffects.mezProtection;
        const protKeys: (keyof GlobalBonuses)[] = [
          'protHold', 'protStun', 'protImmobilize', 'protSleep', 'protConfuse', 'protFear',
        ];
        for (const key of protKeys) {
          (global[key] as number) += mag;
          addToBreakdown(breakdown, key, { name: powerName, value: mag, type: 'incarnate' });
        }
      }

      // Knockback/Knockup protection (Clarion) — its own total, raw Mag.
      if (destinyEffects.kbProtection !== undefined) {
        global.protKnockback += destinyEffects.kbProtection;
        addToBreakdown(breakdown, 'protKnockback', {
          name: powerName,
          value: destinyEffects.kbProtection,
          type: 'incarnate',
        });
      }

      // Run/Jump/Fly speed (Incandescence Radial) — one buff over all three
      // movement axes (decimal → percent).
      if (destinyEffects.runSpeed !== undefined) {
        const value = destinyEffects.runSpeed * 100;
        global.runSpeed += value;
        global.flySpeed += value;
        global.jumpHeight += value;
        addToBreakdown(breakdown, 'runSpeed', { name: powerName, value, type: 'incarnate' });
        addToBreakdown(breakdown, 'flySpeed', { name: powerName, value, type: 'incarnate' });
        addToBreakdown(breakdown, 'jumpHeight', { name: powerName, value, type: 'incarnate' });
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

  // Genesis (Rebirth) — Socket is the only tree with a direct player-stat effect:
  // +Max HP and +Max Endurance (both at the tier %). Fate is handled above
  // (Destiny scaling); Verdict (Judgement) and Data (Lore pets) are display-only.
  if (genesis?.tree === 'socket' && incarnates.genesis) {
    const powerName = incarnates.genesis.displayName;
    const value = genesis.tierPercent * 100;
    global.maxHP += value;
    addToBreakdown(breakdown, 'maxHP', { name: powerName, value, type: 'incarnate' });
    global.maxEndurance += value;
    addToBreakdown(breakdown, 'maxEndurance', { name: powerName, value, type: 'incarnate' });
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
    def?: { targetType?: string; powerType?: string; effectArea?: string; effects?: unknown; conditionalEffects?: unknown },
  ): PowerWithToggle => {
    if (!def) return power as unknown as PowerWithToggle;
    return {
      ...power,
      // Definition wins for static metadata — stored copy may be missing or stale.
      targetType: def.targetType,
      powerType: def.powerType,
      effectArea: def.effectArea,
      effects: def.effects ?? (power as { effects?: unknown }).effects,
      // Carry mode-/state-gated contributions so the calc can apply the
      // active ones (Bio Armor adaptation modes, …) — see expandActiveConditionals.
      conditionalEffects: def.conditionalEffects ?? (power as { conditionalEffects?: unknown }).conditionalEffects,
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

  // Inherent powers carry real self-buffs that must flow through the active-power
  // loop — most importantly the movement toggles (Sprint, Ninja Run, Beast Run,
  // prestige sprints), which otherwise contribute nothing to run/jump/fly speed.
  // Skip categories that already have dedicated handling so they aren't counted
  // twice: `fitness` (Swift/Hurdle/Health/Stamina → applyFitnessPowerBonuses) and
  // `archetype` (Supremacy, Vigilance, … → the AT-specific inherent calcs). The
  // stored inherent already carries effects/powerType from hydration, so it needs
  // no powerset-def enrichment.
  for (const power of build.inherents || []) {
    const cat = (power as { inherentCategory?: string }).inherentCategory;
    if (cat === 'fitness' || cat === 'archetype') continue;
    powers.push(power as unknown as PowerWithToggle);
  }

  return powers;
}

/**
 * Expand the *active* mode-/state-gated conditionalEffects of the build's
 * active powers into synthetic active-power contributions.
 *
 * Bio Armor's adaptation modes (and similar mechanics) layer extra effects on
 * top of a power's always-on base — e.g. Environmental Modification's base
 * +Def(Fire) 1.5 plus an *additional* +Def(Fire) 0.45 while Defensive
 * Adaptation is active (confirmed against the raw `.powers` def: the base mod
 * has no `Requires`; the mode mod is `Requires kDefensiveAdaptation source.Mode?`).
 *
 * Rather than merge the conditional into the base power (which would force a
 * lossy replace-or-separate-row choice on colliding keys like `defenseBuff`),
 * each active conditional becomes its own synthetic active power. Feeding it
 * through the same `applyActivePowerBonuses` machinery makes collisions **sum**
 * naturally at the global-totals level (base 1.5 + mode 0.45 = 1.95).
 *
 * The synthetic carries **no slots** and is applied with **no Alpha / no
 * strength buffs** (see the call site) — these mode bonuses are flagged
 * IgnoreStrength in the binary ("these special bonuses are unenhanceable"), so
 * they must bypass enhancement and Power Boost.
 *
 * Default-safe: a build with no adjuster toggles selected (the common case)
 * produces zero synthetics, so the dashboard totals are byte-identical to
 * before this pass existed. Behavior only appears once the user picks a mode.
 *
 * AT-inherent gated conditionals (Domination, …) are skipped — they already
 * have dedicated total handling and would otherwise double-count.
 */
function expandActiveConditionals(
  powers: PowerWithToggle[],
  globalAdjusters: Record<string, boolean>,
  mechanicAdjusters: Record<string, boolean>,
): PowerWithToggle[] {
  const synthetics: PowerWithToggle[] = [];
  // Stance conditionals (Bio Armor adaptation, Staff Perfection) read their
  // on/off from `globalAdjusters` here, but the caller has already overlaid the
  // build's `activeSubPower`-derived state onto that map (see
  // `stanceAdjusterOverrides`), so the stance is build-scoped and the
  // enabler-taken gate is implicit (no parent → no activeSubPower → off).
  for (const power of powers) {
    // The parent must itself be active for its gated effects to apply.
    const isAuto = power.powerType?.toLowerCase() === 'auto';
    if (!(isAuto || power.isActive)) continue;

    const conds = power.conditionalEffects;
    if (!conds || conds.length === 0) continue;

    for (const c of conds) {
      // Driven elsewhere in the calc — skip to avoid double-counting.
      if (AT_INHERENT_CONDITIONAL_IDS.has(c.id)) continue;
      // Damage-only conditionals affect attack output, not dashboard totals.
      if (!c.effects || Object.keys(c.effects).length === 0) continue;

      const def = !!c.defaultActive;
      let on: boolean;
      if (c.scope === 'global') {
        const v = globalAdjusters[c.id];
        on = v === undefined ? def : v;
      } else {
        const v = mechanicAdjusters[`${power.internalName}:${c.id}`];
        on = v === undefined ? def : v;
      }
      if (!on) continue;

      synthetics.push({
        name: `${power.name} (${c.label})`,
        internalName: power.internalName,
        powerType: power.powerType,
        targetType: power.targetType,
        effectArea: power.effectArea,
        isActive: true,
        effects: c.effects as unknown as ActivePowerEffect,
        // Intentionally no slots / allowedEnhancements → unenhanced.
      });
    }
  }
  return synthetics;
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
  /** Seconds after cast to evaluate the (diminishing) Destiny buff at. `null` =
   *  the equipped power's sustained floor (default); 0 = additive peak; `undefined`
   *  = legacy flat peak values. Only affects Destiny powers that diminish over
   *  time (Mids-style time slider). */
  destinyTime?: number | null;
  /** Combat mode: suppress defenseBuffSuppressible from stealth/travel powers */
  combatMode?: boolean;
  /** Active global Mechanic Adjuster state — caster-state toggles shared across
   *  powers (Bio Armor adaptation modes, Hide, In Combat, …), keyed by the bare
   *  conditional `id`. Drives mode-gated conditionalEffects into the dashboard
   *  totals. Default `{}` → no conditionals applied, so totals are unchanged
   *  from a build with no toggles selected. */
  globalAdjusters?: Record<string, boolean>;
  /** Active per-power Mechanic Adjuster state — target-state toggles keyed
   *  `<internalName>:<id>` (drowning, Disintegrating, …). Default `{}`. */
  mechanicAdjusters?: Record<string, boolean>;
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
  const effectiveLevel = getEffectiveLevel(build.level, exemplarMode, exemplarLevel);
  // Incarnate abilities turn off entirely below level 45 (Genesis swaps to its
  // exemplar power). Gates the two incarnate calc entry points below.
  const incarnatesSuppressed = areIncarnatesSuppressed(effectiveLevel);

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
      // Mirror PAIRED_STATS expansion from applySetBonusesToGlobal so the
      // breakdown shows up under both halves of a paired bonus (e.g.
      // Ice Mistral's Torment's +Res(Recharge Debuff) also grants Slow Res
      // — the source must surface under both stats, not just Recharge).
      const targetStats = PAIRED_STATS[normalizedStat] ?? [STAT_TO_GLOBAL[normalizedStat] || stat];
      for (const breakdownStat of targetStats) {
        const existing = breakdown.get(breakdownStat);
        if (existing) {
          existing.sources.push(...built.sources);
          existing.total += built.total;
          existing.cappedSources += built.cappedSources;
        } else {
          // Clone so paired stats don't share mutable source arrays.
          breakdown.set(breakdownStat, {
            ...built,
            sources: [...built.sources],
          });
        }
      }
    }
  }

  // Step 4: Collect all powers
  const allPowers = collectAllPowers(build);

  // Step 5: Get Alpha incarnate enhancement bonuses (apply to all powers including fitness)
  const alphaBonuses = getAlphaEnhancementBonuses(build.incarnates, incarnateActive, incarnatesSuppressed);
  // Alpha tier dictates how much of the boost bypasses ED (Common 1/6 …
  // Very Rare 2/3). Passed alongside alphaBonuses so combineWithAlphaED
  // splits the buff correctly against the per-power IO ED total.
  const alphaTier = build.incarnates?.alpha?.tier;
  const alphaEdBypassRatio = alphaTier ? INCARNATE_TIER_REGISTRY[alphaTier].edBypassRatio : 0;
  if (_debug) debugAlphaBonuses(alphaBonuses);

  // Step 6: Apply inherent power bonuses (Fitness powers, with Alpha bonuses)
  if (_debug) debugGroup('Step 6: Fitness Powers');
  applyFitnessPowerBonuses(build, globalBonuses, breakdown, effectiveLevel, alphaBonuses, alphaEdBypassRatio, exemplarLevel);
  if (_debug) debugGroupEnd();

  // Step 7: Apply active toggle power bonuses (with enhancement multipliers + Alpha bonuses)
  if (_debug) debugGroup('Step 7: Active Power Bonuses');
  // Collect active +Strength self-buffs (Power Boost family) FIRST, so each
  // boosted power's defense/tohit/etc. output is multiplied by the strength
  // when applyActivePowerBonuses runs. Stored on globalBonuses (as fractions)
  // for the Power Info per-power display to read.
  const strengthBuffs = collectStrengthBuffs(allPowers, build.archetype.id || '', effectiveLevel, options?.targetsHitValues ?? {});
  globalBonuses.strengthDefense = strengthBuffs.defense;
  globalBonuses.strengthToHit = strengthBuffs.toHit;
  globalBonuses.strengthHeal = strengthBuffs.heal;
  globalBonuses.strengthAbsorb = strengthBuffs.absorb;
  globalBonuses.strengthEndMod = strengthBuffs.endMod;
  globalBonuses.strengthMovement = strengthBuffs.movement;
  globalBonuses.strengthMez = strengthBuffs.mez;
  // Stealth radius is gathered from active powers AND procs, then committed
  // together by resolveStealthRadius (suppress-group max + additive sum).
  const stealthContribs: StealthContribution[] = [];
  applyActivePowerBonuses(allPowers, globalBonuses, breakdown, effectiveLevel, build.archetype.id || '', alphaBonuses, alphaEdBypassRatio, options?.targetsHitValues ?? {}, exemplarLevel, options?.combatMode, strengthBuffs, stealthContribs);

  // Step 7.1: Apply active mode-/state-gated conditional contributions (Bio
  // Armor adaptation modes, …). Each active conditional is a synthetic active
  // power so its effects SUM onto the base power's at the totals level (e.g.
  // Defensive Adaptation's +Def adds to Environmental Modification's base +Def).
  // Applied with NO Alpha / NO strength buffs and no slots → unenhanced, because
  // these mode bonuses are IgnoreStrength ("special bonuses are unenhanceable").
  // Default-safe: no toggles selected → no synthetics → totals unchanged.
  // Overlay the build's `activeSubPower`-derived stance state onto the UI
  // global adjusters so Bio Armor adaptation / Staff Perfection are driven by
  // the build-scoped stance (single source of truth), with `activeSubPower`
  // winning over any stale UI toggle.
  const effectiveGlobalAdjusters = {
    ...(options?.globalAdjusters ?? {}),
    ...stanceAdjusterOverrides(allPowers),
  };
  const conditionalPowers = expandActiveConditionals(
    allPowers,
    effectiveGlobalAdjusters,
    options?.mechanicAdjusters ?? {},
  );
  if (conditionalPowers.length > 0) {
    applyActivePowerBonuses(conditionalPowers, globalBonuses, breakdown, effectiveLevel, build.archetype.id || '', {}, 0, options?.targetsHitValues ?? {}, exemplarLevel, options?.combatMode, emptyStrengthBuffs(), stealthContribs);
  }
  if (_debug) debugGroupEnd();

  // Step 7.5: Apply always-on proc bonuses (Global and Proc120s in Auto/Toggle powers)
  // Procs have their own Rule of 5 tracking, separate from set bonuses
  const procSettings = options?.procSettings;
  const anyProcEnabled = !procSettings || Object.values(procSettings).some(v => v);
  if (_debug) debugGroup('Step 7.5-7.6: Proc Bonuses');
  if (anyProcEnabled) {
    applyProcBonuses(build, globalBonuses, breakdown, procSettings, stealthContribs);
  }

  // Step 7.5b: Commit stealth radius now that every source (active powers +
  // procs) is gathered — suppress groups contribute their max, the rest add.
  resolveStealthRadius(stealthContribs, globalBonuses, breakdown);

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
  applyIncarnateBonuses(build.incarnates, incarnateActive, globalBonuses, breakdown, options?.incarnateLevelShiftActive ?? true, incarnatesSuppressed, options?.destinyTime);
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

  // Step 9.7: Compute toggle endurance costs now that every global EndDisc
  // source (set bonuses, active-power discounts, Hybrid Support T4) has been
  // aggregated into global.endurance. Uses the divisor formula
  // `cost = base / (1 + slotEndRdx + global.endurance/100)` — the same math
  // the game and the per-power Power Info panel use. Replaces the earlier
  // pattern that summed per-toggle costs in Step 7 and then post-hoc scaled
  // by `(1 - global/100)` (wrong formula, and missed any discount source
  // that hadn't been aggregated by the time Step 7 ran, e.g. Hybrid T4 in
  // Step 9).
  if (_debug) debugGroup('Step 9.7: Toggle End Costs');
  applyToggleEndCosts(allPowers, globalBonuses, breakdown, effectiveLevel, alphaBonuses, alphaEdBypassRatio, exemplarLevel);
  if (_debug) debugGroupEnd();

  // Step 10: Convert to character stats format
  const stats = convertToCharacterStats(globalBonuses);

  // Compute net endurance per second (recovery minus toggle costs)
  // MaxEndurance bonuses are flat values (accolades +5, power effects in absolute points)
  const totalMaxEnd = 100 + globalBonuses.maxEndurance;
  const recoveryEndPerSec = (totalMaxEnd / 60) * (1 + globalBonuses.recovery / 100);
  globalBonuses.netEndPerSec = recoveryEndPerSec - globalBonuses.toggleEndCost;

  if (_debug) {
    debugNetEndurance(totalMaxEnd, globalBonuses.maxEndurance, globalBonuses.recovery, recoveryEndPerSec, globalBonuses.toggleEndCost, globalBonuses.endurance, globalBonuses.netEndPerSec);
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
