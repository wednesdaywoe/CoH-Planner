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
  createSpecialEnhancement,
  HAMIDON_ENHANCEMENTS,
  TITAN_ENHANCEMENTS,
  HYDRA_ENHANCEMENTS,
  DSYNC_ENHANCEMENTS,
  PRESTIGE_ENHANCEMENTS,
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

/** Known Mids typos: midsName (lowercase) → corrected internalName */
const MIDS_NAME_TYPOS: Record<string, string> = {
  'spectral_terrror': 'Spectral_Terror',
};

/**
 * Find a power within a list of Power definitions by Mids internal name.
 * Tries internalName match first, then display name normalization.
 */
export function findPowerByMidsName(powers: Power[], midsName: string): Power | null {
  // Fix known Mids typos
  const corrected = MIDS_NAME_TYPOS[midsName.toLowerCase()] ?? midsName;

  // Try exact internalName match
  const byInternal = powers.find(
    (p) => p.internalName?.toLowerCase() === corrected.toLowerCase()
  );
  if (byInternal) return byInternal;

  // Try display name: "Quick_Strike" → "Quick Strike", "Tri_Cannon" → matches "Tri-Cannon"
  const normalized = corrected.replace(/_/g, ' ');
  const byDisplay = powers.find(
    (p) => p.name.toLowerCase() === normalized.toLowerCase()
  );
  if (byDisplay) return byDisplay;

  // Try display name with hyphen normalization: "Tri_Cannon" → "tri cannon" matches "Tri-Cannon" → "tri cannon"
  const normalizeAll = (s: string) => s.toLowerCase().replace(/[-_]/g, ' ');
  const normalizedAll = normalizeAll(corrected);
  const byDisplayNormalized = powers.find(
    (p) => normalizeAll(p.name) === normalizedAll
  );
  if (byDisplayNormalized) return byDisplayNormalized;

  // fullName last segment match (e.g., "Combat_Flight" matches Pool.Flight.Combat_Flight → "Hover")
  const lowerName = corrected.toLowerCase();
  const byFullName = powers.find((p) => {
    if (!p.fullName) return false;
    const segment = p.fullName.split('.').pop() ?? '';
    return segment.toLowerCase() === lowerName;
  });
  if (byFullName) return byFullName;

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
 * Mids sometimes abbreviates words in epic pool names.
 * e.g., "Sentinel_Psi_Mastery" instead of "Sentinel_Psionic_Mastery".
 * Maps lowercase abbreviated word → full word.
 */
const MIDS_WORD_ABBREVIATIONS: Record<string, string> = {
  'psi': 'psionic',
};

function expandMidsAbbreviations(name: string): string {
  const words = name.split('_');
  const expanded = words.map(w => MIDS_WORD_ABBREVIATIONS[w] || w);
  return expanded.join('_');
}

/**
 * Mids uses AT abbreviation suffixes on epic pool internal names.
 * e.g., "Ice_Mastery_DefCorr" = Ice Mastery for Defenders/Corruptors.
 * Maps lowercase suffix → AT IDs to try when constructing pool ID.
 */
const MIDS_EPIC_AT_SUFFIXES: Record<string, string[]> = {
  '_defcorr': ['defender'],
  '_def': ['defender'],
  '_corr': ['corruptor'],
  '_brute': ['brute', 'tanker'],
  '_tank': ['tanker'],
  '_scrap': ['scrapper'],
  '_stalk': ['stalker', 'scrapper'],
  '_blast': ['blaster'],
  '_sent': ['sentinel', 'blaster'],
  '_cont': ['controller'],
  '_dom': ['dominator', 'controller'],
  '_mm': ['mastermind', 'defender'],
};

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

  // Fallback: strip Mids AT abbreviation suffix and try {at}_{baseName} pattern
  // This must run BEFORE the broad startsWith search to avoid e.g. "ice_mastery_defcorr"
  // matching "ice_mastery" (blaster pool) instead of "defender_ice_mastery".
  const allEpicPools = getAllEpicPools();
  for (const [suffix, ats] of Object.entries(MIDS_EPIC_AT_SUFFIXES)) {
    if (midsEpicName.endsWith(suffix)) {
      const baseName = midsEpicName.slice(0, -suffix.length);
      for (const at of ats) {
        const candidateId = `${at}_${baseName}`;
        for (const pool of Object.values(allEpicPools)) {
          if (pool.id.toLowerCase() === candidateId) {
            return pool.id;
          }
        }
      }
      // Also try baseName alone
      for (const pool of Object.values(allEpicPools)) {
        if (pool.id.toLowerCase() === baseName) {
          return pool.id;
        }
      }
    }
  }

  // Fallback: search ALL epic pools for a match
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

  // Fallback: expand known Mids abbreviations (e.g., "psi" → "psionic") and retry
  const expandedName = expandMidsAbbreviations(midsEpicName);
  if (expandedName !== midsEpicName) {
    for (const pool of epicPools) {
      if (pool.id.toLowerCase() === expandedName) {
        return pool.id;
      }
    }
    for (const pool of Object.values(allEpicPools)) {
      if (pool.id.toLowerCase() === expandedName ||
          expandedName.startsWith(pool.id.toLowerCase()) ||
          pool.id.toLowerCase().startsWith(expandedName)) {
        return pool.id;
      }
    }
  }

  return null;
}

// ============================================
// ENHANCEMENT MAPPING
// ============================================

/**
 * Dev-name aliases: maps internal/development set names to their live set IDs.
 * HC sometimes ships sets with dev names that differ from the final display name.
 */
const DEV_NAME_ALIASES: Record<string, string> = {
  'shrapnel': 'artillery',
};

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

  // Add dev-name aliases (internal names that differ from live names)
  for (const [devName, setId] of Object.entries(DEV_NAME_ALIASES)) {
    lookup.set(devName, setId);
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
 * Parse Mids RelativeLevel string to a boost number (0-5).
 * "PlusOne" → 1, "PlusTwo" → 2, ..., "PlusFive" → 5
 * "Even", "None", or anything else → 0
 */
const RELATIVE_LEVEL_BOOST: Record<string, number> = {
  'PlusOne': 1,
  'PlusTwo': 2,
  'PlusThree': 3,
  'PlusFour': 4,
  'PlusFive': 5,
};

function parseBoostLevel(relativeLevel: string): number {
  return RELATIVE_LEVEL_BOOST[relativeLevel] ?? 0;
}

/**
 * Map a Mids enhancement UID to an app Enhancement object.
 * @param uid - e.g., "Superior_Attuned_Superior_Brutes_Fury_A" or "Crafted_Damage"
 * @param ioLevel - the IoLevel from the .mbd file (0-based)
 * @param relativeLevel - "Even", "PlusOne", "PlusTwo", etc.
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
  const boost = parseBoostLevel(relativeLevel);

  // Check for special enhancements (Hamidon, Titan, Hydra, D-Sync, Prestige)
  if (grade === 'SingleO' || uid.startsWith('Hamidon_') || uid.startsWith('Titan_') || uid.startsWith('Hydra_') || uid.startsWith('DSync_') || uid.startsWith('Dsync_') || uid.startsWith('Generic_')) {
    return mapSpecialEnhancementUid(uid, boost);
  }

  // Check for origin enhancements (SO/DO/TO)
  if (grade === 'SO' || grade === 'DO' || grade === 'TO') {
    const stat = MIDS_STAT_MAP[uid] ?? uid;
    try {
      const enh = createOriginEnhancement(stat as any, grade, undefined, boost || undefined);
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
        const enh = createGenericIOEnhancement(stat as any, level, boost || undefined);
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

  let { setId, pieceNum, attuned } = parsed;

  // Look up the IO set
  let ioSet = getIOSet(setId);

  // For Superior_Attuned_ UIDs where the set name doesn't already include "superior_",
  // try the superior variant (e.g., "blistering_cold" → "superior_blistering_cold").
  // Mids uses "Superior_Attuned_Blistering_Cold" for winter sets but our data stores
  // the superior version as "superior_blistering_cold".
  if (!ioSet && attuned && !setId.startsWith('superior_')) {
    const superiorId = `superior_${setId}`;
    const superiorSet = getIOSet(superiorId);
    if (superiorSet) {
      ioSet = superiorSet;
      setId = superiorId;
    }
  }

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
    attuned,
    level: attuned ? 50 : level,
    boost: boost || undefined,
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

// ============================================
// SPECIAL ENHANCEMENT MAPPING (HamiO/Titan/Hydra/D-Sync)
// ============================================

type SpecialCategory = 'hamidon' | 'titan' | 'hydra' | 'd-sync' | 'prestige';

interface SpecialRegistryDef {
  name: string;
  aspects: { stat: string; value: number }[];
}

/**
 * Maps Mids stat-based UID keywords to normalized stat categories.
 * Multiple HamiO aspects can map to the same keyword (e.g., Defense Debuff + ToHit Debuff → "debuff").
 */
const STAT_TO_UID_KEYWORD: Record<string, string> = {
  'accuracy': 'accuracy',
  'damage': 'damage',
  'recharge': 'recharge',
  'endurancereduction': 'endurance_discount',
  'range': 'range',
  'defense': 'defense_buff',
  'resistance': 'resist',
  'healing': 'heal',
  'tohit': 'tohit_buff',
  'defense debuff': 'debuff',
  'tohit debuff': 'debuff',
  'hold': 'mez',
  'stun': 'mez',
  'immobilize': 'mez',
  'sleep': 'mez',
  'confuse': 'mez',
  'fear': 'mez',
  'slow': 'slow',
  'fly': 'travel',
  'jump': 'travel',
  'run speed': 'travel',
  'knockback': 'knockback',
  'taunt': 'taunt',
  'endurancemodification': 'endmod',
  'absorb': 'absorb',
};

/** Multi-word UID keywords to check first (longest match) */
const MULTI_WORD_UID_KEYWORDS = [
  'endurance_discount', 'defense_buff', 'tohit_buff',
];

/** Single-word UID keywords */
const SINGLE_UID_KEYWORDS = [
  'accuracy', 'damage', 'recharge', 'range', 'debuff', 'mez',
  'resist', 'heal', 'slow', 'travel', 'knockback', 'taunt', 'endmod', 'absorb',
];

/** Extract stat keywords from a Mids UID suffix (after stripping prefix) */
function extractUidKeywords(suffix: string): Set<string> {
  const keywords = new Set<string>();
  let remaining = suffix.toLowerCase();

  for (const kw of MULTI_WORD_UID_KEYWORDS) {
    if (remaining.includes(kw)) {
      keywords.add(kw);
      remaining = remaining.replace(kw, '');
    }
  }
  for (const kw of SINGLE_UID_KEYWORDS) {
    if (remaining.includes(kw)) {
      keywords.add(kw);
    }
  }
  return keywords;
}

/** Build expected keyword set from a registry entry's aspects */
function buildExpectedKeywords(aspects: { stat: string }[]): Set<string> {
  const keywords = new Set<string>();
  for (const aspect of aspects) {
    const kw = STAT_TO_UID_KEYWORD[aspect.stat.toLowerCase()];
    if (kw) keywords.add(kw);
  }
  return keywords;
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) if (!b.has(item)) return false;
  return true;
}

/**
 * Find the best matching registry entry for a UID suffix using keyword-based matching.
 */
function matchByKeywords(
  uidSuffix: string,
  registry: Record<string, SpecialRegistryDef>,
): string | null {
  const inputKw = extractUidKeywords(uidSuffix);
  if (inputKw.size === 0) return null;

  // Try exact keyword set match
  for (const [id, def] of Object.entries(registry)) {
    const expectedKw = buildExpectedKeywords(def.aspects);
    if (setsEqual(inputKw, expectedKw)) return id;
  }

  // Fallback: best partial match (highest overlap ratio)
  let bestId = '';
  let bestScore = 0;
  for (const [id, def] of Object.entries(registry)) {
    const expectedKw = buildExpectedKeywords(def.aspects);
    let matches = 0;
    for (const kw of inputKw) {
      if (expectedKw.has(kw)) matches++;
    }
    const score = matches / Math.max(inputKw.size, expectedKw.size);
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  return bestId && bestScore >= 0.5 ? bestId : null;
}

const SPECIAL_REGISTRIES: Record<SpecialCategory, Record<string, SpecialRegistryDef>> = {
  'hamidon': HAMIDON_ENHANCEMENTS,
  'titan': TITAN_ENHANCEMENTS,
  'hydra': HYDRA_ENHANCEMENTS,
  'd-sync': DSYNC_ENHANCEMENTS,
  'prestige': PRESTIGE_ENHANCEMENTS,
};

/**
 * Direct mapping from Mids UID suffix (lowercased) to registry entry ID.
 * Mids UIDs use stat-based naming like "Damage_Range", "Buff_Endurance_Discount".
 * This table maps those suffixes to the named entries in each enhancement registry.
 *
 * Key Mids UID stat keywords:
 *   Buff = Defense + ToHit aspects
 *   DeBuff = Defense Debuff + ToHit Debuff
 *   Mez = all mez types (Hold/Stun/Immob/Sleep/Confuse/Fear)
 *   Travel = Fly + Jump + Run Speed
 *   Res_Damage = Resistance
 *   Endurance_Discount = EnduranceReduction
 *   Endurance_Modification = EnduranceModification
 *   Threat = Taunt
 *   Heal = Healing (may also include Absorb in some entries)
 */
const SPECIAL_SUFFIX_MAPS: Record<SpecialCategory, Record<string, string>> = {
  'hamidon': {
    'damage_accuracy': 'nucleolus',
    'damage_range': 'centriole',
    'debuff_endurance_discount': 'enzyme',
    'debuff_accuracy': 'lysosome',
    'buff_recharge': 'membrane',
    'damage_mez': 'peroxisome',
    'res_damage_endurance_discount': 'ribosome',
    'heal_endurance_discount': 'golgi',
    'accuracy_mez': 'endoplasm',
    'buff_endurance_discount': 'cytoskeleton',
    'travel_endurance_discount': 'microfilament',
    'endurance_modification_recharge': 'vesicle',
    'slow_recharge_endurance_discount': 'stereocilia',
    'endurance_modification_accuracy': 'microtubule',
    'damage_endurance_discount': 'karyoplasm',
    'accuracy_range': 'microvillus',
    'damage_recharge': 'chromatin',
    'threat_accuracy_recharge': 'ectosome',
    'heal_recharge': 'amyloplast',
    'heal_accuracy': 'chloroplast',
  },
  'titan': {
    'damage_mez': 'amethyst',
    'accuracy_mez': 'calcite',
    'buff_recharge': 'citrine',
    'damage_accuracy': 'diamond',
    'debuff_accuracy': 'gypsum',
    'heal_endurance_discount': 'kyanite',
    'res_damage_endurance_discount': 'peridont',
    'damage_range': 'quartz',
    'travel_endurance_discount': 'selenite',
    'buff_endurance_discount': 'tanzanite',
    'debuff_endurance_discount': 'zeolite',
  },
  'hydra': {
    'debuff_endurance_discount': 'antiproton',
    'debuff_accuracy': 'delta',
    'res_damage_endurance_discount': 'electron',
    'damage_mez': 'gluon',
    'accuracy_mez': 'graviton',
    'damage_accuracy': 'neutrino',
    'damage_range': 'neutron',
    'heal_endurance_discount': 'positron',
    'buff_endurance_discount': 'proton',
    'buff_recharge': 'quark',
    'travel_endurance_discount': 'theta',
  },
  'd-sync': {
    'travel_endurance_discount': 'acceleration',
    'accuracy_mez': 'binding',
    'endurance_modification_recharge': 'conduit',
    'damage_mez': 'containment',
    'slow_recharge_endurance_discount': 'deceleration',
    'endurance_modification_accuracy': 'drain',
    'damage_endurance_discount': 'efficiency',
    'buff_endurance_discount': 'elusivity',
    'damage_accuracy': 'empowerment',
    'damage_range': 'extension',
    'res_damage_endurance_discount': 'fortification',
    'accuracy_range': 'guidance',
    'debuff_endurance_discount': 'marginalization',
    'debuff_accuracy': 'obfuscation',
    'damage_recharge': 'optimization',
    'threat_accuracy_recharge': 'provocation',
    'heal_endurance_discount': 'reconstitution',
    'heal_recharge': 'reconstruction',
    'buff_recharge': 'shifting',
    'heal_accuracy': 'siphon',
  },
  'prestige': {
    'might_of_the_empire': 'might_of_the_empire',
    'clockwork_efficiency': 'clockwork_efficiency',
    'will_of_the_seers': 'will_of_the_seers',
    'resistance_tactics': 'resistance_tactics',
    'syndicate_techniques': 'syndicate_techniques',
  },
};

const SPECIAL_PREFIXES: [string, SpecialCategory][] = [
  ['Hamidon_', 'hamidon'],
  ['Titan_', 'titan'],
  ['Hydra_', 'hydra'],
  ['DSync_', 'd-sync'],
  ['Dsync_', 'd-sync'],  // Mids sometimes uses lowercase 's'
  ['Generic_', 'prestige'],
];

/**
 * Map a Mids special enhancement UID to an app Enhancement object.
 * Uses keyword-based aspect matching against the known registries.
 */
function mapSpecialEnhancementUid(uid: string, boost?: number): EnhancementMapResult {
  // Determine category from prefix
  let category: SpecialCategory | null = null;
  let suffix = uid;

  for (const [prefix, cat] of SPECIAL_PREFIXES) {
    if (uid.startsWith(prefix)) {
      category = cat;
      suffix = uid.slice(prefix.length);
      break;
    }
  }

  if (!category) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: uid, message: `Unrecognized special enhancement prefix` },
    };
  }

  const registry = SPECIAL_REGISTRIES[category];

  // Try direct suffix lookup first (most reliable)
  const suffixMap = SPECIAL_SUFFIX_MAPS[category];
  const directId = suffixMap?.[suffix.toLowerCase()];
  if (directId && registry[directId]) {
    const def = registry[directId];
    const enh = createSpecialEnhancement(directId, def, category, boost);
    return { enhancement: enh, warning: null };
  }

  // Fallback: keyword-based matching for unknown suffixes
  const matchedId = matchByKeywords(suffix, registry);

  if (matchedId) {
    const def = registry[matchedId];
    const enh = createSpecialEnhancement(matchedId, def, category, boost);
    return { enhancement: enh, warning: null };
  }

  return {
    enhancement: null,
    warning: { type: 'enhancement', midsName: uid, message: `Could not match special enhancement: ${uid}` },
  };
}
