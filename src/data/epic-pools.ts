/**
 * Epic/Patron Pool data and accessor functions
 * Migrated from legacy/js/data/epics/
 *
 * Epic pools are archetype-specific power pools that unlock at level 35.
 * Heroes have Epic Power Pools, Villains have Patron Power Pools.
 */

import type {
  Power,
  PowerEffects,
  IOSetCategory,
  EnhancementStatType,
  PowerType,
} from '@/types';
import { getActiveDataset } from './dataset';
import { EPIC_POOL_LEVEL, EPIC_TIER_REQUIREMENTS } from './levels';

// ============================================
// EPIC POOL TYPES
// ============================================

export interface EpicPool {
  id: string;
  name: string;
  displayName: string;
  archetype: string;
  description: string;
  icon: string;
  minLevel: number;
  powers: Power[];
}

export type EpicPoolRegistry = Record<string, EpicPool>;

// ============================================
// RAW DATA TYPES (for conversion)
// ============================================

interface LegacyEpicPowerEffects {
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

interface LegacyEpicPower {
  name: string;
  fullName?: string;
  rank: number;
  available: number;
  description: string;
  shortHelp?: string;
  icon: string;
  powerType: string;
  requires?: string;
  maxSlots: number;
  allowedEnhancements: string[];
  allowedSetCategories: string[];
  effects: LegacyEpicPowerEffects;
  quickSnipe?: Power['quickSnipe'];
}

interface LegacyEpicPool {
  id: string;
  name: string;
  displayName?: string;
  archetype: string;
  description: string;
  icon: string;
  requires?: string;
  minLevel: number;
  powers: LegacyEpicPower[];
}

export type LegacyEpicPoolRegistry = Record<string, LegacyEpicPool>;

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transform legacy epic power to typed Power
 */
function transformEpicPower(legacy: LegacyEpicPower): Power {
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
  // Clicks pay a flat cost per activation and must NOT be divided by the tick
  // period (doing so doubled e.g. Power Boost's 9.75 to 19.5). Mirrors the
  // isToggle gating in power-pools.ts:transformPoolPower.
  const isToggle = legacy.powerType === 'Toggle';
  const endPerSec = endurance
    ? (isToggle ? endurance / (activatePeriod || 0.5) : endurance)
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
    requires: legacy.requires,
    ...(legacy.quickSnipe ? { quickSnipe: legacy.quickSnipe } : {}),
    effects: {
      // Stats (renamed from legacy format)
      accuracy,
      range,
      recharge,
      enduranceCost: endPerSec,
      castTime: activationTime,
      effectArea: effectArea as PowerEffects['effectArea'],
      radius,
      arc,
      maxTargets,
      // All other effects pass through directly (damage, buffs, debuffs,
      // mez, protection, resistance, movement, stealth, summon, etc.)
      ...effectFields,
    } as PowerEffects,
  };
}

/**
 * Transform legacy epic pool to typed EpicPool
 */
function transformEpicPool(legacy: LegacyEpicPool): EpicPool {
  return {
    id: legacy.id,
    name: legacy.name,
    displayName: legacy.displayName || legacy.name,
    archetype: legacy.archetype,
    description: legacy.description,
    icon: legacy.icon,
    minLevel: legacy.minLevel,
    powers: legacy.powers.map(transformEpicPower),
  };
}

/**
 * Transform entire registry
 */
function transformRegistry(legacy: LegacyEpicPoolRegistry): EpicPoolRegistry {
  const registry: EpicPoolRegistry = {};
  for (const [id, pool] of Object.entries(legacy)) {
    registry[id] = transformEpicPool(pool);
  }
  return registry;
}

// ============================================
// EPIC POOL REGISTRY
// ============================================

// Lazy-cache the transformed registry per dataset. The raw registry rides in
// the active dataset's dynamic chunk via `getActiveDataset().epicPoolsRaw`
// (not a static cross-dataset import), so only the active server's epic-pool
// data is downloaded; the transform runs once per dataset on first access.
const _registryCache = new Map<string, EpicPoolRegistry>();

function _activeRegistry(): EpicPoolRegistry {
  const ds = getActiveDataset();
  let r = _registryCache.get(ds.id);
  if (!r) {
    r = transformRegistry(ds.epicPoolsRaw);
    _registryCache.set(ds.id, r);
  }
  return r;
}

/**
 * Get all epic pools
 */
export function getAllEpicPools(): EpicPoolRegistry {
  return _activeRegistry();
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get an epic pool by ID (e.g., "sentinel_dark_mastery")
 */
export function getEpicPool(id: string): EpicPool | undefined {
  return _activeRegistry()[id];
}

// Hero ATs that lack patron pool data use their villain counterpart's patron pools.
// All ATs can access patron pools in-game (unlocked via going rogue/villain).
// Blasters are paired with Mastermind here because the in-game proliferation
// gave Blaster patron pools (Leviathan, Soul) the heavy-hitting Mastermind
// roster (School of Sharks + Knockout Blow / Chum Spray + Spirit Shark Jaws
// for Leviathan, etc.) — not Corruptor's lighter Hibernate / Coralax-summon
// roster. Mace and Mu Mastery are already authored natively for Blaster, so
// only Leviathan and Soul fall back, and they need the Mastermind variant.
const PATRON_POOL_FALLBACK: Record<string, string> = {
  defender: 'corruptor',
  tanker: 'brute',
  scrapper: 'stalker',
  controller: 'dominator',
  blaster: 'mastermind',
};

// Villain ATs that lack epic pool data use their hero counterpart's epic pools.
// Epic pools were proliferated to villain ATs in-game.
const EPIC_POOL_FALLBACK: Record<string, string> = {
  corruptor: 'defender',
  brute: 'tanker',
  stalker: 'scrapper',
  dominator: 'controller',
  mastermind: 'defender',
};

const PATRON_POOL_NAMES = new Set(['Leviathan Mastery', 'Mace Mastery', 'Mu Mastery', 'Soul Mastery']);

// Game `@Class_<Name>` tokens → our archetype ids. Epic/ancillary pools gate
// their powers with `requires` expressions like `$archetype @Class_Mastermind ==`
// (or `… @Class_Defender == @Class_Corruptor == ||` for a shared copy). This is
// the authoritative game restriction on which archetypes may take the pool.
const CLASS_TOKEN_TO_AT: Record<string, string> = {
  blaster: 'blaster', brute: 'brute', controller: 'controller', corruptor: 'corruptor',
  defender: 'defender', dominator: 'dominator', mastermind: 'mastermind', scrapper: 'scrapper',
  sentinel: 'sentinel', stalker: 'stalker', tanker: 'tanker', peacebringer: 'peacebringer',
  warshade: 'warshade', arachnos_soldier: 'arachnos_soldier', arachnos_widow: 'arachnos_widow',
  guardian: 'guardian',
};

/**
 * The set of archetype ids a pool is gated to, read from its powers' `requires`
 * `@Class_<Name>` tokens. An empty set means the pool carries no archetype gate
 * (unrestricted / legacy data without baked-in class expressions). No pool uses
 * a negated (`!=`) class gate, so every `@Class` token is an allow.
 */
function poolArchetypeGate(pool: EpicPool): Set<string> {
  const gate = new Set<string>();
  for (const power of pool.powers) {
    const req = power.requires;
    if (!req) continue;
    const re = /@Class_([A-Za-z_]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(req)) !== null) {
      const at = CLASS_TOKEN_TO_AT[m[1].toLowerCase()];
      if (at) gate.add(at);
    }
  }
  return gate;
}

/**
 * Whether the game's `@Class` gate on a pool admits the given archetype.
 * Ungated pools (empty set) are treated as admitted so legacy data without
 * baked-in class expressions keeps its prior behavior.
 */
function poolAdmitsArchetype(pool: EpicPool, normalizedId: string): boolean {
  const gate = poolArchetypeGate(pool);
  return gate.size === 0 || gate.has(normalizedId);
}

/**
 * Get epic pools for a specific archetype
 * @param archetypeId - The archetype ID (e.g., "sentinel", "blaster")
 * @returns Array of epic pools available to that archetype
 */
export function getEpicPoolsForArchetype(archetypeId: string): EpicPool[] {
  // Normalize archetype ID (handle "arachnos-soldier" vs "arachnos_soldier")
  const normalizedId = archetypeId.toLowerCase().replace(/-/g, '_');

  // Special case: Arachnos Widow shares patron pools with Arachnos Soldier
  // In-game, both VEATs can access the same patron pools (Leviathan, Mace, Mu, Soul)
  const archTypesToMatch = normalizedId === 'arachnos_widow'
    ? ['arachnos_widow', 'arachnos_soldier']
    : [normalizedId];

  const registry = _activeRegistry();
  const pools = Object.values(registry).filter(
    (pool) => archTypesToMatch.includes(pool.archetype.toLowerCase())
  );

  // Fill in missing patron pools from villain counterpart. Patron pools are
  // genuinely cross-AT in-game (a rogue Blaster can take them), but our data
  // only holds one AT's *copy* of each — whose `@Class` gate names that copy's
  // owner, not everyone who can pick it. So patron borrowing is matched by
  // pool name only; the gate is deliberately NOT consulted here.
  const patronFallbackAT = PATRON_POOL_FALLBACK[normalizedId];
  if (patronFallbackAT) {
    const existingNames = new Set(pools.map(p => p.displayName || p.name));
    const fallbackPools = Object.values(registry).filter(
      (pool) => pool.archetype.toLowerCase() === patronFallbackAT
        && PATRON_POOL_NAMES.has(pool.displayName || pool.name)
        && !existingNames.has(pool.displayName || pool.name)
    );
    pools.push(...fallbackPools);
  }

  // Fill in missing ancillary pools from the hero counterpart, but only those
  // the game actually lets this AT take. The borrowed copy carries an
  // authoritative `@Class` gate (e.g. Defender's shared pools gate
  // `@Class_Defender == @Class_Corruptor ==` — Corruptor is admitted, but a
  // Mastermind borrowing from Defender is not). Without this guard the name
  // dedup leaks every non-colliding hero pool onto the villain AT — the
  // Mastermind-shows-Defender-masteries bug.
  const epicFallbackAT = EPIC_POOL_FALLBACK[normalizedId];
  if (epicFallbackAT) {
    const existingNames = new Set(pools.map(p => p.displayName || p.name));
    const fallbackPools = Object.values(registry).filter(
      (pool) => pool.archetype.toLowerCase() === epicFallbackAT
        && !PATRON_POOL_NAMES.has(pool.displayName || pool.name)
        && !existingNames.has(pool.displayName || pool.name)
        && poolAdmitsArchetype(pool, normalizedId)
    );
    pools.push(...fallbackPools);
  }

  return pools;
}

// ============================================
// EPIC POWER AVAILABILITY CHECKING
// ============================================

/**
 * Check if epic pools are available at the given level
 */
export function areEpicPoolsUnlocked(level: number): boolean {
  return level >= EPIC_POOL_LEVEL;
}

/**
 * Check if a specific epic pool power is available based on level and selected powers
 *
 * Rules:
 * - Epic pools unlock at level 35
 * - First two powers (rank 1-2) are available at level 35
 * - Third power (rank 3) requires level 38 AND 1 power from the pool
 * - Fourth power (rank 4) requires level 41 AND 1 power from the pool
 * - Fifth power (rank 5) requires level 44 AND 2 powers from the pool
 *
 * @param power - The power to check
 * @param level - Current character level
 * @param selectedPowersInPool - Array of power names already selected from this pool
 */
/**
 * Whether a server's epic pools enforce Homecoming's rank-based tier
 * prerequisites (deeper powers require prior picks + a higher level).
 * Homecoming and Rebirth do; Thunderspy's epic pools are flat (no
 * prerequisites). New servers default to the tiered model.
 */
function epicPoolsHaveTierPrereqs(datasetId: string): boolean {
  return datasetId !== 'thunderspy';
}

export function isEpicPowerAvailable(
  power: Power,
  level: number,
  selectedPowersInPool: string[]
): boolean {
  // Epic pools not available before level 35
  if (level < EPIC_POOL_LEVEL) return false;

  // Powers with available=-1 are auto-granted powers that should never be shown in selection
  if (power.available < 0) {
    return false;
  }

  // Per-server rule: the rank-based tier prerequisites (deeper powers need
  // prior picks + a higher level) are a Homecoming/Rebirth convention.
  // Thunderspy's epic pools are FLAT — once epic pools unlock, any power is
  // selectable with no prior-pick requirement (Tspy dev-confirmed: e.g. Body
  // Mastery's Physical Perfection can be taken as your only pick). Enforcing the
  // HC tiers uniformly wrongly blocked those picks on Thunderspy.
  if (!epicPoolsHaveTierPrereqs(getActiveDataset().id)) {
    return true;
  }

  const rank = power.rank || 1;
  const numSelectedPowers = selectedPowersInPool.length;

  // Rank 1-2: Available at level 35 (epic pool unlock)
  if (rank <= 2) {
    return level >= EPIC_TIER_REQUIREMENTS.TIER_1_2.minLevel;
  }

  // Rank 3: Requires level 38 and 1 power from the pool
  if (rank === 3) {
    if (level < EPIC_TIER_REQUIREMENTS.TIER_3.minLevel) return false;
    return numSelectedPowers >= EPIC_TIER_REQUIREMENTS.TIER_3.requiredPowers;
  }

  // Rank 4: Requires level 41 and 1 power from the pool
  if (rank === 4) {
    if (level < EPIC_TIER_REQUIREMENTS.TIER_4.minLevel) return false;
    return numSelectedPowers >= EPIC_TIER_REQUIREMENTS.TIER_4.requiredPowers;
  }

  // Rank 5+: Requires level 44 and 2 powers from the pool
  if (rank >= 5) {
    if (level < EPIC_TIER_REQUIREMENTS.TIER_5.minLevel) return false;
    return numSelectedPowers >= EPIC_TIER_REQUIREMENTS.TIER_5.requiredPowers;
  }

  return false;
}

