/**
 * City of Heroes: Rule of 5 System
 *
 * Tracks set bonuses and enforces the "Rule of 5":
 * Identical set bonus values can only stack 5 times maximum.
 *
 * Example:
 * - Thunderstrike 4pc gives +9% Accuracy (can stack 5x)
 * - OtherSet 6pc gives +9% Accuracy (counts toward same cap)
 * - DifferentSet 2pc gives +5% Accuracy (separate cap, can stack 5x)
 */

import type { SelectedPower, Enhancement } from '@/types';

// ============================================
// TYPES
// ============================================

export interface BonusSource {
  stat: string;
  value: number;
  source: string;
  setName: string;
  pieceCount: number;
  powerName: string;
}

export interface ValueTracking {
  count: number;
  sources: string[];
  rejectedSources: string[];
  capped: boolean;
  value: number;
}

export interface BonusTracking {
  [stat: string]: {
    [valueKey: string]: ValueTracking;
  };
}

export interface AggregatedBonuses {
  [stat: string]: number;
}

export interface StatBreakdownItem {
  value: number;
  count: number;
  sources: string[];
  rejectedSources: string[];
  capped: boolean;
  total: number;
}

export interface IOSet {
  name: string;
  minLevel?: number;
  maxLevel?: number;
  bonuses: Array<{
    pieces: number;
    effects?: Array<{ stat: string; value: number; pvp?: boolean }>;
    stat?: string;
    value?: number;
  }>;
}

export interface BuildPowers {
  primary?: { powers: SelectedPower[] };
  secondary?: { powers: SelectedPower[] };
  pools?: Array<{ powers: SelectedPower[] }>;
  epicPool?: { powers: SelectedPower[] };
  inherents?: SelectedPower[];
}

// ============================================
// STAT NAME NORMALIZATION
// ============================================

/**
 * Map of paired damage types in CoH
 * When one type is applied, the paired type should also receive the bonus
 * Example: damage_resistance_(lethal) also applies to smashing
 */
const PAIRED_STATS: Record<string, string> = {
  // Resistance pairs
  resSmashing: 'resLethal',
  resLethal: 'resSmashing',
  resFire: 'resCold',
  resCold: 'resFire',
  resEnergy: 'resNegative',
  resNegative: 'resEnergy',
  // Defense pairs
  defSmashing: 'defLethal',
  defLethal: 'defSmashing',
  defFire: 'defCold',
  defCold: 'defFire',
  defEnergy: 'defNegative',
  defNegative: 'defEnergy',
};

/**
 * Get the paired stat for a given stat (if any)
 */
export function getPairedStat(stat: string): string | undefined {
  return PAIRED_STATS[stat];
}

/**
 * Map of stat names from IO sets to internal stat keys
 */
const STAT_NAME_MAP: Record<string, string | null> = {
  // Offense
  Damage: 'damage',
  damage: 'damage',
  DamageBuff: 'damage',
  Accuracy: 'accuracy',
  accuracy: 'accuracy',
  ToHit: 'tohit',
  tohit: 'tohit',
  Recharge: 'recharge',
  recharge: 'recharge',
  RechargeTime: 'recharge',
  EnduranceDiscount: 'endrdx',
  endurance_discount: 'endrdx',
  EnduranceReduction: 'endrdx',

  // Defense - Positional
  MeleeDef: 'defMelee',
  melee_defense: 'defMelee',
  RangedDef: 'defRanged',
  ranged_defense: 'defRanged',
  AoEDef: 'defAoE',
  aoe_defense: 'defAoE',
  'defense_(melee)': 'defMelee',
  'defense_(ranged)': 'defRanged',
  'defense_(aoe)': 'defAoE',
  'defense_(area)': 'defAoE',

  // Defense - Typed
  SmashingDef: 'defSmashing',
  smashing_defense: 'defSmashing',
  'defense_(smashing)': 'defSmashing',
  LethalDef: 'defLethal',
  lethal_defense: 'defLethal',
  'defense_(lethal)': 'defLethal',
  FireDef: 'defFire',
  fire_defense: 'defFire',
  'defense_(fire)': 'defFire',
  ColdDef: 'defCold',
  cold_defense: 'defCold',
  'defense_(cold)': 'defCold',
  EnergyDef: 'defEnergy',
  energy_defense: 'defEnergy',
  'defense_(energy)': 'defEnergy',
  NegativeDef: 'defNegative',
  negative_defense: 'defNegative',
  'defense_(negative)': 'defNegative',
  PsionicDef: 'defPsionic',
  psionic_defense: 'defPsionic',
  'defense_(psionic)': 'defPsionic',
  ToxicDef: 'defToxic',
  toxic_defense: 'defToxic',
  'defense_(toxic)': 'defToxic',

  // Resistance
  SmashingRes: 'resSmashing',
  'damage_resistance_(smashing)': 'resSmashing',
  LethalRes: 'resLethal',
  'damage_resistance_(lethal)': 'resLethal',
  FireRes: 'resFire',
  'damage_resistance_(fire)': 'resFire',
  ColdRes: 'resCold',
  'damage_resistance_(cold)': 'resCold',
  EnergyRes: 'resEnergy',
  'damage_resistance_(energy)': 'resEnergy',
  NegativeRes: 'resNegative',
  'damage_resistance_(negative)': 'resNegative',
  PsionicRes: 'resPsionic',
  'damage_resistance_(psionic)': 'resPsionic',
  ToxicRes: 'resToxic',
  'damage_resistance_(toxic)': 'resToxic',

  // Recovery & HP
  Recovery: 'recovery',
  recovery: 'recovery',
  Regeneration: 'regeneration',
  regeneration: 'regeneration',
  MaxHitPoints: 'maxhp',
  maximum_hitpoints: 'maxhp',
  MaxHealth: 'maxhp',
  MaxEndurance: 'maxend',
  maximum_endurance: 'maxend',

  // Movement
  RunSpeed: 'runspeed',
  run_speed: 'runspeed',
  increased_movement: 'runspeed',
  FlySpeed: 'flyspeed',
  fly_speed: 'flyspeed',
  JumpSpeed: 'jumpspeed',
  jump_speed: 'jumpspeed',
  JumpHeight: 'jumpheight',
  jump_height: 'jumpheight',

  // Mez Resistance
  'mez_resistance_(all)': 'mezresist',
  MezRes: 'mezresist',

  // Mez Protection (from IO set unique bonuses)
  'knockback_protection': 'kbprotection',
};

/**
 * Normalize stat names from IO set bonuses to internal stat keys
 */
export function normalizeStatName(statName: string): string | null | undefined {
  if (!statName) return null;

  if (statName in STAT_NAME_MAP) {
    return STAT_NAME_MAP[statName];
  }

  // Return undefined for unknown stats
  return undefined;
}

// ============================================
// RULE OF 5 TRACKING
// ============================================

/**
 * Create a new bonus tracking object
 */
export function createBonusTracking(): BonusTracking {
  return {};
}

/**
 * Track a bonus with Rule of 5 enforcement
 */
export function trackBonus(
  tracking: BonusTracking,
  stat: string,
  value: number,
  source: string
): boolean {
  const valueKey = value.toFixed(2);

  // Initialize stat tracking if needed
  if (!tracking[stat]) {
    tracking[stat] = {};
  }

  // Initialize value tracking if needed
  if (!tracking[stat][valueKey]) {
    tracking[stat][valueKey] = {
      count: 0,
      sources: [],
      rejectedSources: [],
      capped: false,
      value,
    };
  }

  const valueTracking = tracking[stat][valueKey];

  // Only count if under cap
  if (valueTracking.count < 5) {
    valueTracking.count++;
    valueTracking.sources.push(source);
    return true;
  } else {
    valueTracking.capped = true;
    valueTracking.rejectedSources.push(source);
    return false;
  }
}

/**
 * Get aggregated bonuses from tracking (with Rule of 5 applied)
 */
export function getAggregatedFromTracking(tracking: BonusTracking): AggregatedBonuses {
  const aggregated: AggregatedBonuses = {};

  Object.entries(tracking).forEach(([stat, valueTrackings]) => {
    let total = 0;

    Object.values(valueTrackings).forEach((vt) => {
      total += vt.value * vt.count;
    });

    aggregated[stat] = total;
  });

  return aggregated;
}

// ============================================
// SET BONUS COLLECTION
// ============================================

/**
 * Collect all set bonuses from all powers in build
 */
export function collectAllSetBonuses(
  buildPowers: BuildPowers,
  getIOSet: (setId: string) => IOSet | undefined,
  exemplarLevel?: number,
  buildLevel = 50
): BonusSource[] {
  const bonuses: BonusSource[] = [];
  const effectiveLevel = exemplarLevel || buildLevel;

  // Helper to process a single power
  const processPower = (power: SelectedPower) => {
    if (!power.slots) return;

    // Track which sets are slotted in this power
    const setsInPower: Record<string, number[]> = {};

    power.slots.forEach((slot) => {
      if (!slot || slot.type !== 'io-set') return;

      const enhancement = slot as Enhancement & { type: 'io-set' };
      const setId = enhancement.setId;

      // Get the set to check minLevel for attuned enhancements
      const set = getIOSet(setId);

      // Check if this IO's set bonuses are suppressed by exemplar level
      let bonusesActive = true;

      if (enhancement.attuned) {
        // Attuned: bonuses active down to (set minLevel - 3)
        const setMinLevel = set?.minLevel || 1;
        const minBonusLevel = setMinLevel - 3;
        bonusesActive = effectiveLevel >= minBonusLevel;
      } else {
        // Non-attuned: bonuses active if exemplar level >= (IO level - 3)
        const ioLevel = enhancement.level || 50;
        bonusesActive = effectiveLevel >= ioLevel - 3;
      }

      if (bonusesActive) {
        if (!setsInPower[setId]) {
          setsInPower[setId] = [];
        }
        setsInPower[setId].push(enhancement.pieceNum);
      }
    });

    // For each set, check how many pieces are slotted
    Object.entries(setsInPower).forEach(([setId, pieces]) => {
      const set = getIOSet(setId);
      if (!set) return;

      const pieceCount = pieces.length;

      // Check each set bonus
      set.bonuses.forEach((bonus) => {
        if (!bonus?.pieces) return;

        // Only count if we have enough pieces slotted
        if (pieceCount < bonus.pieces) return;

        // Handle bonuses with effects array
        if (bonus.effects && Array.isArray(bonus.effects)) {
          bonus.effects.forEach((effect) => {
            // Skip PvP-only effects — they don't apply in PvE
            if (effect.pvp) return;

            const stat = normalizeStatName(effect.stat);
            if (stat === undefined) {
              // Unknown stat - not in our mapping
              console.warn('Unknown stat in set bonus:', effect.stat, 'in', set.name);
              return;
            }
            if (stat === null) {
              // Explicitly ignored stat
              return;
            }

            bonuses.push({
              stat,
              value: effect.value,
              source: `${set.name} (${bonus.pieces}pc in ${power.name})`,
              setName: set.name,
              pieceCount: bonus.pieces,
              powerName: power.name,
            });

            // Also apply to paired stat (e.g., S/L, F/C, E/N are paired)
            const pairedStat = getPairedStat(stat);
            if (pairedStat) {
              bonuses.push({
                stat: pairedStat,
                value: effect.value,
                source: `${set.name} (${bonus.pieces}pc in ${power.name})`,
                setName: set.name,
                pieceCount: bonus.pieces,
                powerName: power.name,
              });
            }
          });
        }
        // Legacy format: direct stat/value on bonus object
        else if (bonus.stat && bonus.value !== undefined) {
          const stat = normalizeStatName(bonus.stat);
          if (stat) {
            bonuses.push({
              stat,
              value: bonus.value,
              source: `${set.name} (${bonus.pieces}pc in ${power.name})`,
              setName: set.name,
              pieceCount: bonus.pieces,
              powerName: power.name,
            });

            // Also apply to paired stat (e.g., S/L, F/C, E/N are paired)
            const pairedStat = getPairedStat(stat);
            if (pairedStat) {
              bonuses.push({
                stat: pairedStat,
                value: bonus.value,
                source: `${set.name} (${bonus.pieces}pc in ${power.name})`,
                setName: set.name,
                pieceCount: bonus.pieces,
                powerName: power.name,
              });
            }
          }
        }
      });
    });
  };

  // Process primary powers
  if (buildPowers.primary?.powers) {
    buildPowers.primary.powers.forEach(processPower);
  }

  // Process secondary powers
  if (buildPowers.secondary?.powers) {
    buildPowers.secondary.powers.forEach(processPower);
  }

  // Process pool powers
  if (buildPowers.pools) {
    buildPowers.pools.forEach((pool) => {
      if (pool.powers) {
        pool.powers.forEach(processPower);
      }
    });
  }

  // Process epic pool powers
  if (buildPowers.epicPool?.powers) {
    buildPowers.epicPool.powers.forEach(processPower);
  }

  // Process inherent powers (Fitness, etc.)
  if (buildPowers.inherents) {
    buildPowers.inherents.forEach(processPower);
  }

  return bonuses;
}

// ============================================
// MAIN API
// ============================================

/**
 * Calculate set bonuses with Rule of 5 applied
 */
export function calculateSetBonuses(
  buildPowers: BuildPowers,
  getIOSet: (setId: string) => IOSet | undefined,
  exemplarLevel?: number,
  buildLevel = 50
): { bonuses: AggregatedBonuses; tracking: BonusTracking } {
  const tracking = createBonusTracking();

  // Collect all bonuses from all powers
  const allBonuses = collectAllSetBonuses(buildPowers, getIOSet, exemplarLevel, buildLevel);

  // Track each bonus with Rule of 5
  allBonuses.forEach((bonus) => {
    trackBonus(tracking, bonus.stat, bonus.value, bonus.source);
  });

  // Get aggregated totals
  const bonuses = getAggregatedFromTracking(tracking);

  return { bonuses, tracking };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get detailed breakdown for a specific stat
 */
export function getStatBreakdown(tracking: BonusTracking, stat: string): StatBreakdownItem[] {
  if (!tracking[stat]) return [];

  const breakdown: StatBreakdownItem[] = [];

  Object.values(tracking[stat]).forEach((vt) => {
    breakdown.push({
      value: vt.value,
      count: vt.count,
      sources: vt.sources,
      rejectedSources: vt.rejectedSources,
      capped: vt.capped,
      total: vt.value * vt.count,
    });
  });

  // Sort by value descending
  breakdown.sort((a, b) => b.value - a.value);

  return breakdown;
}

/**
 * Check if a specific bonus value is at cap for a stat
 */
export function isBonusCapped(tracking: BonusTracking, stat: string, value: number): boolean {
  const valueKey = value.toFixed(2);
  return tracking[stat]?.[valueKey]?.capped ?? false;
}

/**
 * Get count of a specific bonus value for a stat
 */
export function getBonusCount(tracking: BonusTracking, stat: string, value: number): number {
  const valueKey = value.toFixed(2);
  return tracking[stat]?.[valueKey]?.count ?? 0;
}

/**
 * Get all active set bonuses as a flat list
 */
export function getActiveSetBonusesList(
  tracking: BonusTracking
): Array<{ stat: string; value: number; source: string }> {
  const bonuses: Array<{ stat: string; value: number; source: string }> = [];

  Object.entries(tracking).forEach(([stat, valueTrackings]) => {
    Object.values(valueTrackings).forEach((vt) => {
      vt.sources.forEach((source) => {
        bonuses.push({
          stat,
          value: vt.value,
          source,
        });
      });
    });
  });

  return bonuses;
}
