/**
 * Power Pool data and accessor functions
 * Migrated from legacy/js/data/pools/
 *
 * Power Pools are secondary power sets that any character can take.
 * Players can select up to 4 pools total.
 */

import type {
  PowerPool,
  Power,
  PowerEffects,
  IOSetCategory,
  EnhancementStatType,
  PowerType,
} from '@/types';
import { POWER_POOLS_RAW as POWER_POOLS_RAW_HC } from './datasets/homecoming/power-pools-raw';
import { POWER_POOLS_RAW as POWER_POOLS_RAW_REBIRTH } from './datasets/rebirth/power-pools-raw';
import { POWER_POOLS_RAW as POWER_POOLS_RAW_THUNDERSPY } from './datasets/thunderspy/power-pools-raw';
import { getActiveDataset } from './dataset';
import { POOL_UNLOCK_LEVEL } from './levels';

// ============================================
// POWER POOL REGISTRY TYPE
// ============================================

export type PowerPoolRegistry = Record<string, PowerPool>;

// ============================================
// RAW DATA TYPES (for conversion)
// ============================================

interface LegacyPoolPowerEffects {
  // Stats (renamed during transformation)
  accuracy?: number;
  range?: number;
  recharge?: number;
  endurance?: number;
  activatePeriod?: number;
  activationTime?: number;
  effectArea?: string;
  radius?: number;
  arc?: number;
  maxTargets?: number;
  // All other effect fields pass through directly
  [key: string]: unknown;
}

interface LegacyPoolPower {
  name: string;
  fullName?: string;
  rank: number;
  available: number;
  description: string;
  shortHelp?: string;
  icon: string;
  powerType: string;
  /** Ally/foe/self targeting (e.g. "Teammate" for Grant Invisibility). Drives
   *  the ally-only filter that keeps ally-buff defense out of the caster's
   *  totals — must be carried through the transform or that filter sees
   *  undefined and the buff leaks into self stats. */
  targetType?: string;
  requires?: string;
  maxSlots: number;
  allowedEnhancements: string[];
  allowedSetCategories: string[];
  effects: LegacyPoolPowerEffects;
}

interface LegacyPowerPool {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  icon: string;
  requires?: string;
  powers: LegacyPoolPower[];
}

type LegacyPowerPoolRegistry = Record<string, LegacyPowerPool>;

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transform legacy pool power to typed Power
 */
function transformPoolPower(legacy: LegacyPoolPower): Power {
  // Destructure stats that need renaming, spread the rest through directly
  const {
    endurance,
    activatePeriod,
    activationTime,
    accuracy,
    range,
    recharge,
    effectArea,
    radius,
    arc,
    maxTargets,
    ...effectFields
  } = legacy.effects;

  // Toggle endurance is per-tick in the binary data — convert to per-second.
  // Default activate period is 0.5s (standard toggle tick rate) when not explicit.
  // For clicks, endurance is a flat cost per activation.
  const isToggle = legacy.powerType === 'Toggle';
  const effectivePeriod = isToggle ? (activatePeriod ?? 0.5) : undefined;
  const endCost = endurance
    ? (effectivePeriod ? endurance / effectivePeriod : endurance)
    : undefined;

  return {
    name: legacy.name,
    internalName: legacy.fullName?.split('.').pop()?.replace(/\s+/g, '_') ?? legacy.name.replace(/\s+/g, '_'),
    fullName: legacy.fullName,
    available: legacy.available,
    rank: legacy.rank,
    maxSlots: legacy.maxSlots,
    allowedEnhancements: legacy.allowedEnhancements as EnhancementStatType[],
    allowedSetCategories: legacy.allowedSetCategories as IOSetCategory[],
    description: legacy.description,
    shortHelp: legacy.shortHelp,
    icon: legacy.icon,
    powerType: legacy.powerType as PowerType,
    targetType: legacy.targetType as Power['targetType'],
    requires: legacy.requires,
    effects: {
      // Stats (renamed from legacy format)
      accuracy,
      range,
      recharge,
      enduranceCost: endCost,
      castTime: activationTime,
      effectArea: effectArea as PowerEffects['effectArea'],
      radius,
      arc,
      maxTargets,
      // All other effects pass through directly (damage, buffs, debuffs,
      // mez, movement, stealth, summon, resistance, defense, etc.)
      ...effectFields,
    } as PowerEffects,
  };
}

/**
 * Transform legacy power pool to typed PowerPool
 */
function transformPowerPool(legacy: LegacyPowerPool): PowerPool {
  return {
    id: legacy.id,
    name: legacy.name,
    displayName: legacy.displayName,
    description: legacy.description,
    icon: legacy.icon,
    requires: legacy.requires,
    powers: legacy.powers.map(transformPoolPower),
  };
}

/**
 * Transform entire registry
 */
function transformRegistry(legacy: LegacyPowerPoolRegistry): PowerPoolRegistry {
  const registry: PowerPoolRegistry = {};
  for (const [id, pool] of Object.entries(legacy)) {
    registry[id] = transformPowerPool(pool);
  }
  return registry;
}

// ============================================
// POWER POOL REGISTRY
// ============================================

// Lazy-cache the transformed registry per dataset.
const _registryCache = new Map<string, PowerPoolRegistry>();

function _resolveRawForDataset(datasetId: string) {
  switch (datasetId) {
    case 'rebirth': return POWER_POOLS_RAW_REBIRTH;
    case 'thunderspy': return POWER_POOLS_RAW_THUNDERSPY;
    case 'homecoming':
    default: return POWER_POOLS_RAW_HC;
  }
}

function _activeRegistry(): PowerPoolRegistry {
  const id = getActiveDataset().id;
  let r = _registryCache.get(id);
  if (!r) {
    r = transformRegistry(
      _resolveRawForDataset(id) as unknown as LegacyPowerPoolRegistry
    );
    _registryCache.set(id, r);
  }
  return r;
}

/**
 * Get all power pools
 */
export function getAllPowerPools(): PowerPoolRegistry {
  return _activeRegistry();
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get a power pool by ID (e.g., "speed", "fighting")
 */
export function getPowerPool(id: string): PowerPool | undefined {
  return _activeRegistry()[id];
}

/**
 * Get all pool IDs
 */
export function getPowerPoolIds(): string[] {
  return Object.keys(_activeRegistry());
}

/**
 * Get a specific power from a pool
 */
export function getPoolPower(poolId: string, powerName: string): Power | undefined {
  const pool = getPowerPool(poolId);
  return pool?.powers.find((p) => p.internalName === powerName);
}

/**
 * Get powers available at or before a given level (including rank 1 and 2)
 * Note: available is 0-indexed (available=0 means level 1)
 */
export function getPoolPowersAvailableAtLevel(poolId: string, level: number): Power[] {
  const pool = getPowerPool(poolId);
  if (!pool) return [];
  return pool.powers.filter((p) => p.available < level && p.available >= 0);
}

/**
 * Get the tier-unlocking powers for a pool (typically rank 1 and 2)
 */
export function getPoolEntryPowers(poolId: string): Power[] {
  const pool = getPowerPool(poolId);
  if (!pool) return [];
  return pool.powers.filter((p) => p.available === 0 && (!p.requires || p.requires === ''));
}

/**
 * Check if prerequisites are met for a pool power
 * @param poolId - The pool ID
 * @param powerName - The power to check
 * @param selectedPowers - Array of power names already selected from this pool
 */
export function arePoolPrerequisitesMet(
  poolId: string,
  powerName: string,
  selectedPowers: string[]
): boolean {
  const power = getPoolPower(poolId, powerName);
  if (!power) return false;

  // No requires means no prerequisites
  if (!power.requires || power.requires === '') return true;

  // Parse the requires expression
  // Format: "Pool.Speed.Flurry && Pool.Speed.Hasten || Pool.Speed.Flurry && Pool.Speed.Super_Speed"
  // Or count: "Pool.Force_of_Will.Mighty_Leap + Pool.Force_of_Will.Project_Will + ... > 1"
  const requiresExpr = power.requires;

  // Helper: resolve a "Pool.X.Power_Name" atom to its internalName (last segment)
  const resolveAtom = (atom: string): string => {
    const parts = atom.trim().split('.');
    return parts[parts.length - 1];
  };

  // Raw .def `requires` strings are Reverse Polish Notation: operators come
  // after their operands. Two RPN flavors appear in pool data:
  //   • Boolean: `A B && C D && || E F && ||` — Group Fly tier-4 prereqs.
  //   • Count:   `A B + C + N >`              — Sorcery Enflame requires
  //                                            (count of selected from set) > N.
  // Splitting on `||`/`&&`/`+` as infix mangles compound atoms like
  // "Pool.X.A Pool.X.B" into one token whose last segment is just B.
  const trimmed = requiresExpr.trim();
  const tokens = trimmed.split(/\s+/);
  const lastTok = tokens[tokens.length - 1];
  const isBoolRpn = lastTok === '!' || lastTok === '&&' || lastTok === '||';
  const isCountRpn = lastTok === '>' || lastTok === '>=' || lastTok === '<' || lastTok === '<=';

  if (isBoolRpn) {
    const stack: boolean[] = [];
    for (const tok of tokens) {
      if (tok === '!') {
        if (stack.length < 1) return false;
        stack.push(!stack.pop()!);
      } else if (tok === '&&') {
        if (stack.length < 2) return false;
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(a && b);
      } else if (tok === '||') {
        if (stack.length < 2) return false;
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(a || b);
      } else {
        stack.push(selectedPowers.includes(resolveAtom(tok)));
      }
    }
    return stack.length === 1 ? stack[0] : false;
  }

  if (isCountRpn) {
    const stack: number[] = [];
    for (const tok of tokens) {
      if (tok === '+') {
        if (stack.length < 2) return false;
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(a + b);
      } else if (tok === '>' || tok === '>=' || tok === '<' || tok === '<=') {
        if (stack.length < 2) return false;
        const threshold = stack.pop()!;
        const count = stack.pop()!;
        return tok === '>'  ? count > threshold
             : tok === '>=' ? count >= threshold
             : tok === '<'  ? count < threshold
             :                count <= threshold;
      } else {
        const n = Number(tok);
        if (!isNaN(n) && /^\d+$/.test(tok)) {
          stack.push(n);
        } else {
          stack.push(selectedPowers.includes(resolveAtom(tok)) ? 1 : 0);
        }
      }
    }
    return false;
  }

  // Infix count expression fallback: "A + B + C > N"
  if (requiresExpr.includes('>') && requiresExpr.includes('+')) {
    const [sumPart, thresholdPart] = requiresExpr.split('>').map((s) => s.trim());
    const threshold = parseInt(thresholdPart, 10);
    if (!isNaN(threshold)) {
      const atoms = sumPart.split('+').map((s) => s.trim());
      const count = atoms.filter((a) => selectedPowers.includes(resolveAtom(a))).length;
      return count > threshold;
    }
  }

  // Infix fallback (legacy / hand-edited overrides).
  // Split by || (OR conditions)
  const orConditions = requiresExpr.split('||').map((s) => s.trim());

  // Check if any OR condition is satisfied
  return orConditions.some((orCond) => {
    // Split by && (AND conditions)
    const andConditions = orCond.split('&&').map((s) => s.trim());

    // All AND conditions must be met
    return andConditions.every((andCond) => {
      const reqPowerName = resolveAtom(andCond);
      return selectedPowers.includes(reqPowerName);
    });
  });
}

// ============================================
// POOL CATEGORY INFO
// ============================================

export interface PoolCategoryInfo {
  id: string;
  name: string;
  pools: string[];
}

/**
 * Standard pool categories
 */
export const POOL_CATEGORIES: PoolCategoryInfo[] = [
  {
    id: 'travel',
    name: 'Travel',
    pools: ['flight', 'leaping', 'speed', 'teleportation'],
  },
  {
    id: 'combat',
    name: 'Combat',
    pools: ['fighting', 'presence', 'invisibility', 'force_of_will'],
  },
  {
    id: 'support',
    name: 'Support',
    pools: ['medicine', 'leadership'],
  },
  {
    id: 'utility',
    name: 'Utility',
    pools: ['sorcery', 'experimentation'],
  },
];

/**
 * Mutually exclusive pool groups.
 * Only one pool from each group can be selected per build.
 * On Homecoming, Sorcery / Experimentation / Force of Will are "Specialized" pools.
 */
export const POOL_EXCLUSION_GROUPS: string[][] = [
  ['sorcery', 'experimentation', 'force_of_will'],
];

/**
 * Get the exclusion group a pool belongs to, if any.
 * Returns the other pool IDs in the group that conflict, or null.
 */
export function getExcludedPools(poolId: string): string[] | null {
  for (const group of POOL_EXCLUSION_GROUPS) {
    if (group.includes(poolId)) {
      return group.filter((id) => id !== poolId);
    }
  }
  return null;
}

/**
 * Get pools in a category
 */
export function getPoolsByCategory(categoryId: string): PowerPool[] {
  const category = POOL_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];
  const registry = _activeRegistry();
  return category.pools.map((poolId) => registry[poolId]).filter(Boolean) as PowerPool[];
}

// ============================================
// POWER AVAILABILITY CHECKING
// ============================================

/**
 * Check if power pools are available at the given level
 */
export function arePoolsUnlocked(level: number): boolean {
  return level >= POOL_UNLOCK_LEVEL;
}

/**
 * Check if a specific pool power is available based on level and selected powers.
 *
 * Fully DATA-DRIVEN — no rank heuristics or hard-coded travel-power lists.
 * Every gate comes from fields the bin parser already extracts:
 *   - Pools unlock at level 4 (POOL_UNLOCK_LEVEL).
 *   - `power.available` is the power's own 0-indexed unlock level and is the
 *     authoritative level gate, clamped to the pool-unlock floor:
 *       available 0  → level 4 (e.g. Boxing, Flurry — gated by pool unlock)
 *       available 3  → level 4 (early travel: Super Speed, Fly, Jetpack…)
 *       available 13 → level 14 (e.g. Tough, Weave, Whirlwind)
 *   - `power.requires` carries every prerequisite: intra-pool counts
 *     ("2 of {Flurry, Hasten, Super Speed}" for Whirlwind) and mutual-exclusion
 *     locks ("Strike !" on Boxing). Evaluated by arePoolPrerequisitesMet;
 *     empty requires → no prerequisite.
 *
 * This replaces the legacy rank→level mapping + EARLY_TRAVEL_POWERS list, which
 * only approximated what `available` + `requires` already state exactly — and
 * which mis-gated datasets whose pools diverge from Homecoming's 5-power shape
 * (e.g. Thunderspy's 8-power Fighting pool, Rebirth's non-standard unlock levels).
 *
 * @param poolId - The pool ID
 * @param power - The power to check
 * @param level - Current character level
 * @param selectedPowersInPool - Array of power names already selected from this pool
 */
export function isPowerAvailableInPool(
  poolId: string,
  power: Power,
  level: number,
  selectedPowersInPool: string[]
): boolean {
  // Pools as a whole unlock at level 4.
  if (level < POOL_UNLOCK_LEVEL) return false;

  // available = -1 marks auto-granted sub-powers (Afterburner from Fly, Bio
  // Armor adaptations, etc.) — never user-pickable.
  if (power.available < 0) return false;

  // Data-driven level gate (the power's own unlock level, clamped to the floor).
  if (level < Math.max(POOL_UNLOCK_LEVEL, power.available + 1)) return false;

  // Data-driven prerequisites (intra-pool counts + mutual-exclusion locks).
  return arePoolPrerequisitesMet(poolId, power.internalName, selectedPowersInPool);
}

/**
 * Get all available powers from a pool based on level and already selected powers
 * This filters out already selected powers and checks level/prerequisite requirements
 */
export function getAvailablePoolPowers(
  poolId: string,
  level: number,
  selectedPowersInPool: string[]
): Power[] {
  const pool = getPowerPool(poolId);
  if (!pool) return [];

  return pool.powers.filter((power) => {
    // Skip already selected powers
    if (selectedPowersInPool.includes(power.internalName)) return false;
    // Check availability
    return isPowerAvailableInPool(poolId, power, level, selectedPowersInPool);
  });
}
