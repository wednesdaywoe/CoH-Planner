/**
 * Mapping functions to convert Mids Reborn naming conventions to app internal IDs
 */

import type { ArchetypeId, Enhancement, Power, Origin } from '@/types';
import {
  getAllPowersets,
  getPowerset,
  getPowerPool,
  getPowerPoolIds,
  getEpicPoolsForArchetype,
  getEpicPool,
  getAllEpicPools,
  getIOSet,
  getAllIOSets,
  createIOSetEnhancement,
  createGenericIOEnhancement,
  createOriginEnhancement,
} from '@/data';
import type { MidsImportWarning } from './types';

// ============================================
// ARCHETYPE MAPPING
// ============================================

const MIDS_ARCHETYPE_MAP: Record<string, ArchetypeId> = {
  'Class_Blaster': 'blaster',
  'Class_Brute': 'brute',
  'Class_Controller': 'controller',
  'Class_Defender': 'defender',
  'Class_Scrapper': 'scrapper',
  'Class_Tanker': 'tanker',
  'Class_Sentinel': 'sentinel',
  'Class_Corruptor': 'corruptor',
  'Class_Dominator': 'dominator',
  'Class_Mastermind': 'mastermind',
  'Class_Stalker': 'stalker',
  'Class_Peacebringer': 'peacebringer',
  'Class_Warshade': 'warshade',
  'Class_Arachnos_Soldier': 'arachnos-soldier',
  'Class_Arachnos_Widow': 'arachnos-widow',
};

export function mapArchetype(midsClass: string): ArchetypeId | null {
  return MIDS_ARCHETYPE_MAP[midsClass] ?? null;
}

// ============================================
// ORIGIN MAPPING
// ============================================

const MIDS_ORIGIN_MAP: Record<string, Origin> = {
  'Magic': 'Magic',
  'Mutation': 'Mutation',
  'Natural': 'Natural',
  'Science': 'Science',
  'Technology': 'Technology',
};

export function mapOrigin(midsOrigin: string): Origin {
  return MIDS_ORIGIN_MAP[midsOrigin] ?? 'Natural';
}

// ============================================
// POWERSET MAPPING
// ============================================

/**
 * Manual overrides for powerset icon names that don't match Mids' internal names.
 * Key: lowercase Mids internal name (second segment of dotted path)
 * Value: the icon stem that should be used for lookup
 */
const POWERSET_ICON_OVERRIDES: Record<string, string> = {
  // Add overrides here as mismatches are discovered during testing
  // e.g., 'some_mids_name': 'some_icon_stem',
};

/**
 * Build a reverse lookup from Mids powerset naming to app powerset IDs.
 * Uses the powerset icon field as the bridge (icon stems match Mids internal names).
 *
 * Returns Map<string, string> where:
 *   key = "{archetype}:{mids_internal_name}" (lowercased)
 *   value = app powerset ID (e.g., "brute/kinetic-melee")
 */
export function buildPowersetLookup(): Map<string, string> {
  const lookup = new Map<string, string>();
  const allPowersets = getAllPowersets();

  for (const [id, powerset] of Object.entries(allPowersets)) {
    if (!powerset.archetype || !powerset.icon) continue;

    // Extract internal name from icon: "kinetic_attack_set.png" → "kinetic_attack"
    const iconStem = powerset.icon.replace(/_set\.png$/, '').replace(/\.png$/, '');

    // Build the lookup key: "brute:kinetic_attack"
    const key = `${powerset.archetype}:${iconStem}`.toLowerCase();

    // Handle icon collisions (e.g., psionic_armor reuses dark_armor_set.png):
    // Prefer the powerset whose ID slug matches the icon stem
    const existing = lookup.get(key);
    if (existing) {
      const newSlug = id.split('/')[1] ?? '';
      const iconSlug = iconStem.replace(/_/g, '-');
      // Keep whichever one's slug matches the icon stem
      if (newSlug === iconSlug) {
        lookup.set(key, id);
      }
      // Otherwise keep existing (it either matches or was set first)
    } else {
      lookup.set(key, id);
    }
  }

  return lookup;
}

/**
 * Resolve a Mids powerset path to an app powerset ID.
 * @param midsPath - e.g., "Brute_Melee.Kinetic_Attack"
 * @param archetypeId - the mapped archetype ID (e.g., "brute")
 * @param powersetLookup - the reverse lookup map from buildPowersetLookup()
 */
export function resolvePowerset(
  midsPath: string,
  archetypeId: string,
  powersetLookup: Map<string, string>,
): string | null {
  const segments = midsPath.split('.');
  if (segments.length < 2) return null;

  const midsInternalName = segments[1].toLowerCase();

  // Check overrides first
  const overrideName = POWERSET_ICON_OVERRIDES[midsInternalName];
  if (overrideName) {
    const overrideKey = `${archetypeId}:${overrideName}`.toLowerCase();
    const overrideResult = powersetLookup.get(overrideKey);
    if (overrideResult) return overrideResult;
  }

  // Try direct ID construction first (most precise — avoids icon collisions)
  // "Dark_Armor" → "dark-armor" → "tanker/dark-armor"
  const idSlug = midsInternalName.replace(/_/g, '-');
  const directId = `${archetypeId}/${idSlug}`;
  if (getPowerset(directId)) return directId;

  // Fallback: icon-based lookup (handles cases where Mids name differs from app slug)
  const key = `${archetypeId}:${midsInternalName}`.toLowerCase();
  const iconResult = powersetLookup.get(key);
  if (iconResult) return iconResult;

  return null;
}

// ============================================
// POWER MAPPING (within a powerset)
// ============================================

/**
 * Find a power within a list of Power definitions by Mids internal name.
 * Tries internalName match first, then display name normalization.
 */
export function findPowerByMidsName(powers: Power[], midsName: string): Power | null {
  // Try exact internalName match
  const byInternal = powers.find(
    (p) => p.internalName?.toLowerCase() === midsName.toLowerCase()
  );
  if (byInternal) return byInternal;

  // Try display name: "Quick_Strike" → "Quick Strike"
  const normalized = midsName.replace(/_/g, ' ');
  const byDisplay = powers.find(
    (p) => p.name.toLowerCase() === normalized.toLowerCase()
  );
  if (byDisplay) return byDisplay;

  return null;
}

// ============================================
// POOL MAPPING
// ============================================

export interface PoolPowerMatch {
  poolId: string;
  poolName: string;
  power: Power;
}

/**
 * Build a lookup from pool power fullNames to pool info.
 * Key: fullName like "Pool.Speed.Hasten"
 * Value: { poolId, poolName, power }
 */
export function buildPoolLookup(): Map<string, PoolPowerMatch> {
  const lookup = new Map<string, PoolPowerMatch>();
  const poolIds = getPowerPoolIds();

  for (const poolId of poolIds) {
    const pool = getPowerPool(poolId);
    if (!pool) continue;

    for (const power of pool.powers) {
      if (power.fullName) {
        lookup.set(power.fullName, { poolId, poolName: pool.name, power });
      }
    }
  }

  return lookup;
}

/**
 * Resolve a Mids pool powerset path to an app pool ID.
 * @param midsPath - e.g., "Pool.Fighting" or "Pool.Force_of_Will"
 */
export function resolvePoolId(midsPath: string): string | null {
  const segments = midsPath.split('.');
  if (segments.length < 2 || segments[0] !== 'Pool') return null;

  // "Force_of_Will" → "force_of_will"
  return segments[1].toLowerCase();
}

// ============================================
// EPIC POOL MAPPING
// ============================================

export interface EpicPowerMatch {
  epicPoolId: string;
  epicPoolName: string;
  power: Power;
}

/**
 * Build a lookup from epic power fullNames to epic pool info.
 * Key: fullName like "Epic.Energy_Mastery_Brute.Focused_Accuracy"
 * Value: { epicPoolId, epicPoolName, power }
 */
export function buildEpicLookup(archetypeId: string, additionalPoolIds?: string[]): Map<string, EpicPowerMatch> {
  const lookup = new Map<string, EpicPowerMatch>();
  const epicPools = getEpicPoolsForArchetype(archetypeId);

  // Include any explicitly resolved pool IDs that weren't found via archetype filter
  if (additionalPoolIds) {
    for (const poolId of additionalPoolIds) {
      if (!epicPools.some((p) => p.id === poolId)) {
        const pool = getEpicPool(poolId);
        if (pool) epicPools.push(pool);
      }
    }
  }

  for (const pool of epicPools) {
    for (const power of pool.powers) {
      if (power.fullName) {
        lookup.set(power.fullName, {
          epicPoolId: pool.id,
          epicPoolName: pool.name,
          power,
        });
      }
    }
  }

  return lookup;
}

/**
 * Resolve a Mids epic powerset path to an app epic pool ID.
 * @param midsPath - e.g., "Epic.Energy_Mastery_Brute"
 * @param archetypeId - the mapped archetype ID
 */
export function resolveEpicPoolId(
  midsPath: string,
  archetypeId: string,
): string | null {
  const segments = midsPath.split('.');
  if (segments.length < 2 || segments[0] !== 'Epic') return null;

  // "Energy_Mastery_Brute" → "energy_mastery_brute"
  const midsEpicName = segments[1].toLowerCase();

  // Try direct match with the epic pool IDs for this archetype
  const epicPools = getEpicPoolsForArchetype(archetypeId);
  for (const pool of epicPools) {
    if (pool.id.toLowerCase() === midsEpicName) {
      return pool.id;
    }
  }

  // Try matching without archetype suffix (e.g., "energy_mastery_brute" vs "energy_mastery")
  for (const pool of epicPools) {
    if (midsEpicName.startsWith(pool.id.toLowerCase()) ||
        pool.id.toLowerCase().startsWith(midsEpicName)) {
      return pool.id;
    }
  }

  // Fallback: direct ID lookup bypassing archetype filter
  const directPool = getEpicPool(midsEpicName);
  if (directPool) return directPool.id;

  // Fallback: search ALL epic pools for a match
  const allEpicPools = getAllEpicPools();
  for (const pool of Object.values(allEpicPools)) {
    if (pool.id.toLowerCase() === midsEpicName) {
      return pool.id;
    }
  }
  for (const pool of Object.values(allEpicPools)) {
    if (midsEpicName.startsWith(pool.id.toLowerCase()) ||
        pool.id.toLowerCase().startsWith(midsEpicName)) {
      return pool.id;
    }
  }

  return null;
}

// ============================================
// ENHANCEMENT MAPPING
// ============================================

/**
 * Build a reverse lookup from IO set display names (normalized) to set IDs.
 * Used as fallback when UID-based matching fails.
 */
function buildIOSetNameLookup(): Map<string, string> {
  const lookup = new Map<string, string>();
  const allSets = getAllIOSets();
  for (const [id, set] of Object.entries(allSets)) {
    // Normalize: "Brute's Fury" → "brutes_fury" (strip apostrophes, lowercase, spaces to underscores)
    const normalized = set.name
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/\s+/g, '_');
    lookup.set(normalized, id);

    // Also store with hyphens removed (Mids strips hyphens: "Fire-Control" → "FireControl")
    const noHyphens = normalized.replace(/-/g, '');
    if (noHyphens !== normalized) {
      lookup.set(noHyphens, id);
    }

    // Also key by set ID with hyphens removed (direct ID match after Mids normalization)
    const idNoHyphens = id.replace(/-/g, '');
    if (idNoHyphens !== id) {
      lookup.set(idNoHyphens, id);
    }
  }
  return lookup;
}

// Cache the name lookup
let _ioSetNameLookup: Map<string, string> | null = null;
function getIOSetNameLookup(): Map<string, string> {
  if (!_ioSetNameLookup) {
    _ioSetNameLookup = buildIOSetNameLookup();
  }
  return _ioSetNameLookup;
}

/**
 * Known enhancement stat names in Mids and their app equivalents
 */
const MIDS_STAT_MAP: Record<string, string> = {
  'Damage': 'Damage',
  'Accuracy': 'Accuracy',
  'Recharge': 'Recharge',
  'EnduranceReduction': 'EnduranceReduction',
  'Endurance_Reduction': 'EnduranceReduction',
  'Endurance_Discount': 'EnduranceReduction',
  'EndRdx': 'EnduranceReduction',
  'Range': 'Range',
  'Defense': 'Defense',
  'Defense_Buff': 'Defense',
  'Resistance': 'Resistance',
  'Healing': 'Healing',
  'Heal': 'Healing',
  'ToHit': 'ToHit',
  'To_Hit': 'ToHit',
  'ToHit_Buff': 'ToHit',
  'Hold': 'Hold',
  'Stun': 'Stun',
  'Immobilize': 'Immobilize',
  'Immob': 'Immobilize',
  'Sleep': 'Sleep',
  'Confuse': 'Confuse',
  'Fear': 'Fear',
  'Knockback': 'Knockback',
  'Run_Speed': 'Run Speed',
  'RunSpeed': 'Run Speed',
  'Run': 'Run Speed',
  'Jump': 'Jump',
  'Fly': 'Fly',
  'Flight': 'Fly',
  'Slow': 'Slow',
  'Taunt': 'Taunt',
  'EnduranceModification': 'EnduranceModification',
  'EndMod': 'EnduranceModification',
};

export interface EnhancementMapResult {
  enhancement: Enhancement | null;
  warning: MidsImportWarning | null;
}

/**
 * Map a Mids enhancement UID to an app Enhancement object.
 * @param uid - e.g., "Superior_Attuned_Superior_Brutes_Fury_A" or "Crafted_Damage"
 * @param ioLevel - the IoLevel from the .mbd file (0-based)
 * @param relativeLevel - "Even", "Superior", etc.
 * @param grade - "IO", "SO", "DO", "TO", etc.
 */
export function mapEnhancementUid(
  uid: string,
  ioLevel: number,
  relativeLevel: string,
  grade?: string,
): EnhancementMapResult {
  // The ioLevel in .mbd is 0-based (49 = level 50)
  const level = Math.min(Math.max(ioLevel + 1, 1), 53);

  // Check for origin enhancements (SO/DO/TO)
  if (grade === 'SO' || grade === 'DO' || grade === 'TO') {
    const stat = MIDS_STAT_MAP[uid] ?? uid;
    try {
      const enh = createOriginEnhancement(stat as any, grade);
      return { enhancement: enh, warning: null };
    } catch {
      return {
        enhancement: null,
        warning: { type: 'enhancement', midsName: uid, message: `Unknown origin enhancement stat: ${uid}` },
      };
    }
  }

  // Check for generic IOs: "Crafted_Damage", "Crafted_Accuracy", etc.
  if (uid.startsWith('Crafted_')) {
    const statPart = uid.slice('Crafted_'.length);
    // Check if this is a generic IO (no piece letter suffix)
    if (!statPart.match(/_[A-F]$/) || isGenericStat(statPart)) {
      const stat = MIDS_STAT_MAP[statPart] ?? statPart;
      try {
        const enh = createGenericIOEnhancement(stat as any, level);
        return { enhancement: enh, warning: null };
      } catch {
        return {
          enhancement: null,
          warning: { type: 'enhancement', midsName: uid, message: `Unknown generic IO stat: ${statPart}` },
        };
      }
    }
  }

  // IO Set enhancement: parse the UID
  const parsed = parseIOSetUid(uid);
  if (!parsed) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: uid, message: `Could not parse enhancement UID` },
    };
  }

  const { setId, pieceNum, attuned } = parsed;

  // Look up the IO set
  let ioSet = getIOSet(setId);

  // Fallback: try name-based lookup
  if (!ioSet) {
    const nameLookup = getIOSetNameLookup();
    const fallbackId = nameLookup.get(setId);
    if (fallbackId) {
      ioSet = getIOSet(fallbackId);
    }
  }

  if (!ioSet) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: uid, message: `IO set not found: ${setId}` },
    };
  }

  // Find the piece
  const piece = ioSet.pieces.find((p) => p.num === pieceNum);
  if (!piece) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: uid, message: `Piece ${pieceNum} not found in set ${ioSet.name}` },
    };
  }

  const enh = createIOSetEnhancement(ioSet, piece, pieceNum - 1, {
    attuned: attuned || relativeLevel === 'Even',
    level: attuned ? 50 : level,
  });

  return { enhancement: enh, warning: null };
}

// ============================================
// INTERNAL HELPERS
// ============================================

function isGenericStat(name: string): boolean {
  return name in MIDS_STAT_MAP && !name.match(/_[A-F]$/);
}

interface ParsedIOSetUid {
  setId: string;
  pieceNum: number;
  attuned: boolean;
}

/**
 * Parse a Mids IO set enhancement UID into its components.
 * Examples:
 *   "Superior_Attuned_Superior_Brutes_Fury_A" → { setId: "superior_brutes_fury", pieceNum: 1, attuned: true }
 *   "Hecatomb_A" → { setId: "hecatomb", pieceNum: 1, attuned: false }
 *   "Attuned_Basilisks_Gaze_A" → { setId: "basilisks_gaze", pieceNum: 1, attuned: true }
 */
function parseIOSetUid(uid: string): ParsedIOSetUid | null {
  let remaining = uid;
  let attuned = false;

  // Strip attuned prefixes
  if (remaining.startsWith('Superior_Attuned_')) {
    remaining = remaining.slice('Superior_Attuned_'.length);
    attuned = true;
  } else if (remaining.startsWith('Attuned_')) {
    remaining = remaining.slice('Attuned_'.length);
    attuned = true;
  } else if (remaining.startsWith('Crafted_')) {
    remaining = remaining.slice('Crafted_'.length);
  }

  // Extract piece letter (last _X where X is A-F)
  const pieceMatch = remaining.match(/_([A-F])$/);
  if (!pieceMatch) return null;

  const pieceLetter = pieceMatch[1];
  const pieceNum = pieceLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
  const setName = remaining.slice(0, -2); // Remove "_X"

  // Lowercase to match app's IO set IDs
  const setId = setName.toLowerCase();

  return { setId, pieceNum, attuned };
}
