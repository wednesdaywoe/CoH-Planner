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
import { getIOSet, getAlphaEffects, getDestinyEffects, getHybridEffects, findProcData, parseProcEffect, isProcAlwaysOn, calculateAutoToggleProcsPerMinute } from '@/data';
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
import {
  calculatePowerEnhancementBonuses,
  type EnhancementBonuses,
} from './enhancement-values';

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
  debuffResistance?: Record<string, number>;
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
  slots?: (Enhancement | null)[];
}

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
  alphaBonuses: EnhancementBonuses = {}
): void {
  for (const power of powers) {
    if (!power.isActive || !power.effects) continue;

    const effects = power.effects;

    // Calculate enhancement bonuses for this power from slotted enhancements
    let enhBonuses: EnhancementBonuses = {};
    if (power.slots && power.slots.length > 0) {
      enhBonuses = calculatePowerEnhancementBonuses(
        { name: power.name, slots: power.slots },
        buildLevel,
        getIOSet
      );
    }

    // Add Alpha incarnate enhancement bonuses (these apply universally to all powers)
    // Alpha bonuses are additive with slotted enhancement bonuses
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) {
        enhBonuses[aspect] = (enhBonuses[aspect] || 0) + value;
      }
    }

    // ToHit buff (stored as decimal, convert to percentage)
    // Enhanced by ToHit enhancements
    if (effects.tohitBuff !== undefined) {
      const enhMultiplier = 1 + (enhBonuses.tohit || 0);
      const value = effects.tohitBuff * 100 * enhMultiplier;
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
      const value = effects.damageBuff * 100 * enhMultiplier;
      global.damage += value;
      addToBreakdown(breakdown, 'damage', {
        name: power.name,
        value,
        type: 'active-power',
      });
    }

    // Defense from active powers
    // Enhanced by Defense enhancements
    if (effects.defense && typeof effects.defense === 'object') {
      const def = effects.defense;
      const enhMultiplier = 1 + (enhBonuses.defense || enhBonuses.defenseBuff || 0);
      for (const [type, value] of Object.entries(def)) {
        const percentage = (value as number) * 100 * enhMultiplier;
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
    // Enhanced by Resistance enhancements
    if (effects.resistance && typeof effects.resistance === 'object') {
      const res = effects.resistance;
      const enhMultiplier = 1 + (enhBonuses.resistance || 0);
      for (const [type, value] of Object.entries(res)) {
        const percentage = (value as number) * 100 * enhMultiplier;
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
    // Note: Debuff resistance typically cannot be enhanced
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

      for (const [type, value] of Object.entries(debuffRes)) {
        const percentage = (value as number) * 100;
        const key = debuffResMapping[type.toLowerCase()];
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
// FITNESS POWER PROCESSING
// ============================================

/**
 * Base values for fitness inherent powers (unenhanced)
 * These are the default values all characters receive
 */
const FITNESS_POWER_BASE_VALUES: Record<string, { stat: keyof GlobalBonuses; value: number; enhancementType: string }> = {
  'Swift': { stat: 'runSpeed', value: 7.5, enhancementType: 'run' },
  'Hurdle': { stat: 'jumpHeight', value: 7.5, enhancementType: 'jump' },
  'Health': { stat: 'regeneration', value: 40, enhancementType: 'heal' },
  'Stamina': { stat: 'recovery', value: 25, enhancementType: 'enduranceMod' },
};

/**
 * Apply bonuses from inherent fitness powers
 * Fitness powers provide base stats that can be enhanced with slotted enhancements
 */
function applyFitnessPowerBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>,
  globalIOLevel: number
): void {
  const fitnessPowers = (build.inherents || []).filter(
    (p) => p.inherentCategory === 'fitness'
  );

  for (const power of fitnessPowers) {
    const baseConfig = FITNESS_POWER_BASE_VALUES[power.name];
    if (!baseConfig) continue;

    // Calculate enhancement bonus for this power
    const enhBonuses = calculatePowerEnhancementBonuses(
      power,
      globalIOLevel,
      getIOSet
    );

    // Get the enhancement multiplier for this power's stat type
    const enhMultiplier = 1 + (enhBonuses[baseConfig.enhancementType] || 0);

    // Calculate final value: base * (1 + enhancement%)
    const finalValue = baseConfig.value * enhMultiplier;

    // Apply to global bonuses
    global[baseConfig.stat] += finalValue;

    // Track in breakdown
    addToBreakdown(breakdown, baseConfig.stat, {
      name: power.name,
      value: finalValue,
      type: 'inherent',
    });
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

    case 'MaxHP':
      global.maxHP += value;
      addToBreakdown(breakdown, 'maxhp', {
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
        }
        addToBreakdown(breakdown, 'defall', {
          name: sourceName,
          value,
          type: 'proc',
        });
      }
      break;

    case 'Resistance':
      // Apply to all resistance types if effect type is "All"
      if (effectType?.toLowerCase() === 'all') {
        const resTypes: (keyof GlobalBonuses)[] = [
          'resSmashing', 'resLethal', 'resFire', 'resCold',
          'resEnergy', 'resNegative', 'resPsionic', 'resToxic'
        ];
        for (const resType of resTypes) {
          global[resType] += value;
        }
        addToBreakdown(breakdown, 'resall', {
          name: sourceName,
          value,
          type: 'proc',
        });
      }
      break;

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
      addToBreakdown(breakdown, 'runspeed', {
        name: sourceName,
        value,
        type: 'proc',
      });
      break;

    case 'KnockbackProtection':
      // KB protection is a magnitude, not a percentage
      // We could add a separate field for this if needed
      break;

    // Other categories (Damage, Control, Debuff, etc.) are not "always-on" stats
    default:
      break;
  }
}

/**
 * Apply bonuses from always-on procs (Global and Proc120s in Auto/Toggle powers)
 */
function applyProcBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>
): void {
  const procs = collectAlwaysOnProcs(build);

  for (const proc of procs) {
    const procData = findProcData(proc.procName, proc.setName);
    if (!procData) continue;

    const effect = parseProcEffect(procData.mechanics);
    const sourceName = `${proc.setName}: ${proc.procName}`;

    // Apply primary effect
    applySingleProcEffect(
      effect.category,
      effect.value,
      effect.effectType,
      sourceName,
      global,
      breakdown
    );

    // Apply secondary effect if present (e.g., Numina's Recovery+Regen, Panacea HP+End)
    if (effect.secondaryCategory && effect.secondaryValue !== undefined) {
      applySingleProcEffect(
        effect.secondaryCategory,
        effect.secondaryValue,
        effect.secondaryEffectType,
        sourceName,
        global,
        breakdown
      );
    }
  }

  // Also collect PPM procs from Auto/Toggle powers and calculate their effective contribution
  applyPPMProcBonuses(build, global, breakdown);
}

/**
 * Apply bonuses from PPM-based procs in Auto/Toggle powers
 * These procs fire with a calculable frequency, contributing a rate-based bonus
 */
function applyPPMProcBonuses(
  build: Build,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>
): void {
  const BASE_RECOVERY_RATE = 1.667; // Base end/sec (100 end in 60 seconds)

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

      // Calculate effective contributions based on effect category
      if (effect.category === 'Endurance' && effect.value !== undefined) {
        // Endurance proc: X% of max end per proc
        // Convert to recovery equivalent: (value% × procsPerMin) / 60 / BASE_RECOVERY_RATE × 100
        // This gives us an equivalent recovery buff percentage
        const endPerSec = (effect.value * procsPerMin) / 60;
        const recoveryEquivalent = (endPerSec / BASE_RECOVERY_RATE) * 100;
        global.recovery += recoveryEquivalent;
        addToBreakdown(breakdown, 'recovery', {
          name: sourceName,
          value: recoveryEquivalent,
          type: 'proc',
        });
      }

      // Note: Recovery and Regeneration procs are typically Proc120s (100% chance, 120s duration)
      // and are handled by the always-on proc system. PPM-based recovery/regen procs are rare.
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
        addToBreakdown(breakdown, 'maxhp', {
          name: accolade.name,
          value: bonus.value,
          type: 'accolade',
        });
      } else if (stat === 'maxendurance') {
        // Endurance bonuses from accolades are flat values
        global.maxEndurance += bonus.value;
        addToBreakdown(breakdown, 'maxend', {
          name: accolade.name,
          value: bonus.value,
          type: 'accolade',
        });
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
  const active = incarnateActive || { alpha: true, destiny: true, hybrid: true, interface: true };
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
 * Apply bonuses from incarnate powers
 * Alpha provides enhancement bonuses, Destiny/Hybrid provide direct stat bonuses
 * Interface is proc-based and doesn't provide direct stats
 */
function applyIncarnateBonuses(
  incarnates: IncarnateBuildState | undefined,
  incarnateActive: IncarnateActiveState | undefined,
  global: GlobalBonuses,
  breakdown: Map<string, DashboardStatBreakdown>
): void {
  if (!incarnates) return;

  // Default to all active if no active state provided
  const active = incarnateActive || {
    alpha: true,
    destiny: true,
    hybrid: true,
    interface: true,
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
        // Apply to all defense types
        global.defMelee += value;
        global.defRanged += value;
        global.defAoE += value;
        global.defSmashing += value;
        global.defLethal += value;
        global.defFire += value;
        global.defCold += value;
        global.defEnergy += value;
        global.defNegative += value;
        global.defPsionic += value;
        global.defToxic += value;

        addToBreakdown(breakdown, 'defAll', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Resistance All
      if (destinyEffects.resistanceAll !== undefined) {
        const value = destinyEffects.resistanceAll * 100;
        global.resSmashing += value;
        global.resLethal += value;
        global.resFire += value;
        global.resCold += value;
        global.resEnergy += value;
        global.resNegative += value;
        global.resPsionic += value;
        global.resToxic += value;

        addToBreakdown(breakdown, 'resAll', {
          name: powerName,
          value,
          type: 'incarnate',
        });
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

  // Hybrid - Direct stat bonuses when toggled on
  if (incarnates.hybrid && active.hybrid) {
    const hybridEffects = getHybridEffects(incarnates.hybrid.powerId);
    if (hybridEffects) {
      const powerName = incarnates.hybrid.displayName;

      // Damage
      if (hybridEffects.damage !== undefined) {
        const value = hybridEffects.damage * 100;
        global.damage += value;
        addToBreakdown(breakdown, 'damage', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Defense (Support tree)
      if (hybridEffects.defense !== undefined) {
        const value = hybridEffects.defense * 100;
        global.defMelee += value;
        global.defRanged += value;
        global.defAoE += value;
        addToBreakdown(breakdown, 'defAll', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Defense All (Melee tree)
      if (hybridEffects.defenseAll !== undefined) {
        const value = hybridEffects.defenseAll * 100;
        global.defMelee += value;
        global.defRanged += value;
        global.defAoE += value;
        global.defSmashing += value;
        global.defLethal += value;
        global.defFire += value;
        global.defCold += value;
        global.defEnergy += value;
        global.defNegative += value;
        global.defPsionic += value;
        global.defToxic += value;
        addToBreakdown(breakdown, 'defAll', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Resistance All (Melee tree)
      if (hybridEffects.resistanceAll !== undefined) {
        const value = hybridEffects.resistanceAll * 100;
        global.resSmashing += value;
        global.resLethal += value;
        global.resFire += value;
        global.resCold += value;
        global.resEnergy += value;
        global.resNegative += value;
        global.resPsionic += value;
        global.resToxic += value;
        addToBreakdown(breakdown, 'resAll', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Regeneration (Melee tree)
      if (hybridEffects.regeneration !== undefined) {
        const value = hybridEffects.regeneration * 100;
        global.regeneration += value;
        addToBreakdown(breakdown, 'regeneration', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }

      // Accuracy (Support tree)
      if (hybridEffects.accuracy !== undefined) {
        const value = hybridEffects.accuracy * 100;
        global.accuracy += value;
        addToBreakdown(breakdown, 'accuracy', {
          name: powerName,
          value,
          type: 'incarnate',
        });
      }
    }
  }

  // Interface - These are proc effects that debuff enemies, not player stats
  // We don't add them to global bonuses, but they could be displayed in tooltips
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
 * @param incarnateActive - Which incarnate slots are active for stat calculations
 */
export function calculateCharacterTotals(
  build: Build,
  exemplarMode = false,
  incarnateActive?: IncarnateActiveState
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

  // Step 5: Apply inherent power bonuses (Fitness powers)
  applyFitnessPowerBonuses(build, globalBonuses, breakdown, effectiveLevel);

  // Step 6: Get Alpha incarnate enhancement bonuses (apply to all powers)
  const alphaBonuses = getAlphaEnhancementBonuses(build.incarnates, incarnateActive);

  // Step 7: Apply active toggle power bonuses (with enhancement multipliers + Alpha bonuses)
  applyActivePowerBonuses(allPowers, globalBonuses, breakdown, effectiveLevel, alphaBonuses);

  // Step 7.5: Apply always-on proc bonuses (Global and Proc120s in Auto/Toggle powers)
  applyProcBonuses(build, globalBonuses, breakdown);

  // Step 8: Apply accolade bonuses
  if (build.accolades && build.accolades.length > 0) {
    applyAccoladeBonuses(build.accolades, globalBonuses, breakdown);
  }

  // Step 9: Apply incarnate bonuses (Destiny, Hybrid - direct stats)
  // Note: Alpha bonuses were already applied in Step 7 as enhancement bonuses
  applyIncarnateBonuses(build.incarnates, incarnateActive, globalBonuses, breakdown);

  // Step 10: Convert to character stats format
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
