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
import { LEGACY_PIECE_ALIASES } from './legacy-piece-aliases';
import type { MidsImportWarning } from './types';
import { warnFallback } from '@/utils/fallback-warnings';

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
  'Class_Guardian': 'guardian',  // Rebirth-only AT
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
  // Some Mids exports include trailing whitespace in segments
  // (Rebirth Guardian builds emit "Guardian_Composition.Energy_Composition "
  // with the trailing space). Trim every segment defensively.
  const segments = midsPath.split('.').map(s => s.trim());
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
 * Known Mids-name → app internalName remaps.
 *
 * Applied ONLY as a fallback after every other matcher fails against the
 * original name. This makes renames safe even when the old name is still valid
 * in some powersets: e.g. `Conserve_Power` still matches Brute Energy Aura's
 * `Conserve_Power` directly, but for Tanker Energy Aura (which no longer has
 * Conserve_Power) the rename kicks in and maps to `Energize`.
 */
const MIDS_NAME_TYPOS: Record<string, string> = {
  'spectral_terrror': 'Spectral_Terror',

  // Stalker Assassin-power renames.
  'assassins_smash': 'Assassins_Rockslide',     // Stone Melee
  'assassins_whisper': 'Assassins_Resonance',   // Sonic Melee

  // Pyrotechnic Control T9: renamed/reworked from Multipurpose_Missiles → Glitz
  // (display: "Brilliant Barrage").
  'multipurpose_missiles': 'Glitz',

  // Tanker Energy Aura: Conserve_Power was removed and its function folded
  // into Energize. Brute Energy Aura still has Conserve_Power natively, so
  // this rename is only used as a fallback.
  'conserve_power': 'Energize',

  // Mastermind Kinetics T9: Kinetic_Transfer is the internal redirect power for
  // Fulcrum_Shift on the MM variant. Controller/Defender Kinetics still has
  // Kinetic_Transfer natively; the rename fires only for MM builds.
  'kinetic_transfer': 'Fulcrum_Shift',

  // VEAT prefix stripping. Mids prefixes some powers with a branch code
  // (BS_, FRT_, NW_) that the HC client data doesn't use.
  'bs_bash': 'Bash',                   // Arachnos Soldier / Bane Spider Soldier
  'frt_fate_sealed': 'Fate_Sealed',    // Arachnos Widow / Fortunata Teamwork
  'nw_pain_tolerance': 'Pain_Tolerance', // Arachnos Widow / Widow Teamwork

  // Mids quirk: an extra `P` in EMP Pulse for Mastermind Radiation Emission.
  'emp_pulse': 'EM_Pulse',
};

/**
 * Mids full paths that reference powers/effects with no user-selectable
 * counterpart in HC. When encountered at the top level of PowerEntries we
 * silently skip them (no warning, no failure) — they're auto-granted passives
 * or Mids serialization artifacts.
 *
 * Keys are lowercase full Mids paths (e.g. `mastermind_summon.beast_mastery.pack_mentality`).
 */
export const MIDS_SILENT_SKIP_PATHS = new Set<string>([
  // Auto-granted passive from Beast Mastery summons; not a player pick in HC.
  'mastermind_summon.beast_mastery.pack_mentality',

  // Mids serialization quirk: emits a "Radiation_Emission" power entry inside
  // the Radiation_Emission set (likely the set root). No corresponding power.
  'mastermind_buff.radiation_emission.radiation_emission',
]);

function tryMatch(powers: Power[], name: string): Power | null {
  // Exact internalName match
  const byInternal = powers.find(
    (p) => p.internalName?.toLowerCase() === name.toLowerCase(),
  );
  if (byInternal) return byInternal;

  // Display name: "Quick_Strike" → "Quick Strike"
  const normalized = name.replace(/_/g, ' ');
  const byDisplay = powers.find(
    (p) => p.name.toLowerCase() === normalized.toLowerCase(),
  );
  if (byDisplay) {
    warnFallback('findPowerByMidsName', `'${name}' matched by display name → '${byDisplay.name}' (internalName '${byDisplay.internalName}') — internalName lookup failed`);
    return byDisplay;
  }

  // Collapse runs of separators: "Enervating__Field" → "enervating field".
  const normalizeAll = (s: string) => s.toLowerCase().replace(/[-_\s]+/g, ' ').trim();
  const normalizedAll = normalizeAll(name);
  const byDisplayNormalized = powers.find(
    (p) => normalizeAll(p.name) === normalizedAll,
  );
  if (byDisplayNormalized) {
    warnFallback('findPowerByMidsName', `'${name}' matched by hyphen-normalized display name → '${byDisplayNormalized.name}' (internalName '${byDisplayNormalized.internalName}')`);
    return byDisplayNormalized;
  }
  const byInternalNormalized = powers.find(
    (p) => p.internalName && normalizeAll(p.internalName) === normalizedAll,
  );
  if (byInternalNormalized) {
    warnFallback('findPowerByMidsName', `'${name}' matched by collapsed-separator internalName → '${byInternalNormalized.name}' (internalName '${byInternalNormalized.internalName}')`);
    return byInternalNormalized;
  }

  // fullName last segment (e.g. "Combat_Flight" → Pool.Flight.Combat_Flight / "Hover")
  const lowerName = name.toLowerCase();
  const byFullName = powers.find((p) => {
    if (!p.fullName) return false;
    const segment = p.fullName.split('.').pop() ?? '';
    return segment.toLowerCase() === lowerName;
  });
  if (byFullName) {
    warnFallback('findPowerByMidsName', `'${name}' matched by fullName last-segment → '${byFullName.name}' (internalName '${byFullName.internalName}')`);
    return byFullName;
  }

  return null;
}

/**
 * Find a power within a list of Power definitions by Mids internal name.
 *
 * Strategy:
 *   1. Try every matcher on the original Mids name (exact, display, normalized, fullName-tail).
 *   2. Only if all of those fail, apply MIDS_NAME_TYPOS and retry the exact-match
 *      lookup with the renamed target. This keeps renames safe in powersets
 *      where the old name is still valid.
 */
export function findPowerByMidsName(powers: Power[], midsName: string): Power | null {
  const direct = tryMatch(powers, midsName);
  if (direct) return direct;

  const renamed = MIDS_NAME_TYPOS[midsName.toLowerCase()];
  if (renamed && renamed.toLowerCase() !== midsName.toLowerCase()) {
    const viaRename = powers.find(
      (p) => p.internalName?.toLowerCase() === renamed.toLowerCase(),
    );
    if (viaRename) {
      warnFallback('findPowerByMidsName', `'${midsName}' mapped via rename → '${viaRename.name}' (internalName '${viaRename.internalName}')`);
      return viaRename;
    }
  }

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
 * Mids pool name → app pool ID aliases for pools whose names diverge.
 * Keys are lowercase Mids pool names (after "Pool." prefix).
 */
const MIDS_POOL_ALIASES: Record<string, string> = {
  // HC renamed Presence → Manipulation in newer exports; our app still uses "presence".
  manipulation: 'presence',
};

/**
 * Resolve a Mids pool powerset path to an app pool ID.
 * @param midsPath - e.g., "Pool.Fighting" or "Pool.Force_of_Will"
 */
export function resolvePoolId(midsPath: string): string | null {
  const segments = midsPath.split('.').map(s => s.trim());
  if (segments.length < 2 || segments[0] !== 'Pool') return null;

  // "Force_of_Will" → "force_of_will"
  const rawId = segments[1].toLowerCase();
  return MIDS_POOL_ALIASES[rawId] ?? rawId;
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
  'elec': 'electricity',
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
  '_brute': ['brute', 'tanker', 'tank'],
  '_tank': ['tanker', 'tank'],
  // Shared Tank/Brute pools (e.g. Psionic Mastery): our data uses the `tank_` prefix.
  '_tankbrute': ['tank', 'tanker', 'brute'],
  '_scrap': ['scrapper', 'melee'],
  '_stalk': ['stalker', 'scrapper', 'melee'],
  // Shared Scrapper/Stalker pools (e.g. Psionic Mastery): our data uses the `melee_` prefix.
  '_scrapstalk': ['melee', 'scrapper', 'stalker'],
  '_blast': ['blaster'],
  '_sent': ['sentinel', 'blaster'],
  '_cont': ['controller'],
  '_dom': ['dominator', 'controller'],
  '_mm': ['mastermind', 'defender'],
  // Pool name ends with the full AT name (e.g. "Dark_Mastery_Mastermind"
  // maps to `mastermind_dark_mastery`).
  '_mastermind': ['mastermind'],
  '_defender': ['defender'],
  '_corruptor': ['corruptor'],
  '_dominator': ['dominator'],
  '_controller': ['controller'],
  '_blaster': ['blaster'],
  '_tanker': ['tanker', 'tank'],
  '_scrapper': ['scrapper'],
  '_stalker': ['stalker'],
  '_sentinel': ['sentinel'],
};

/**
 * Mids also uses AT-abbreviation PREFIXES on some epic pool names.
 * e.g., "Corr_Flame_Mastery" (Corruptor Flame Mastery) → `flame_mastery`.
 * Maps lowercase prefix → AT IDs to try when constructing pool ID.
 */
const MIDS_EPIC_AT_PREFIXES: Record<string, string[]> = {
  'def_': ['defender'],
  'corr_': ['corruptor'],
  'brute_': ['brute', 'tanker', 'tank'],
  'tank_': ['tanker', 'tank'],
  'scrap_': ['scrapper', 'melee'],
  'stalk_': ['stalker', 'scrapper', 'melee'],
  'blast_': ['blaster'],
  'sent_': ['sentinel', 'blaster'],
  'sentinel_': ['sentinel', 'blaster'],
  'cont_': ['controller'],
  'dom_': ['dominator', 'controller'],
  'mm_': ['mastermind', 'defender'],
  'mastermind_': ['mastermind'],
};

/**
 * Direct Mids → app epic-pool ID overrides. These cover cases where the AT
 * prefix/suffix logic picks the wrong pool due to HC set renames.
 * Key is the lowercased Mids pool name (after stripping `Epic.`).
 */
const MIDS_EPIC_POOL_OVERRIDES: Record<string, string> = {
  // HC renamed the Corruptor/Defender epic pool from "Flame Mastery" to
  // "Fire Mastery". Mids still uses the old name.
  'corr_flame_mastery': 'corruptor_fire_mastery',
  'def_flame_mastery': 'defender_fire_mastery',
  // Rebirth Guardian — Mids puts the AT after the school
  // ("Psionic_Mastery_Guardian"); our generated id puts the AT first
  // ("guardian_psionic_mastery"). Map all Guardian epic pools.
  'fire_mastery_guardian': 'guardian_fire_mastery',
  'ice_mastery_guardian': 'guardian_ice_mastery',
  'leviathan_mastery_guardian': 'guardian_leviathan_mastery',
  'mace_mastery_guardian': 'guardian_mace_mastery',
  'mu_mastery_guardian': 'guardian_mu_mastery',
  'munitions_mastery_guardian': 'guardian_munitions_mastery',
  'primal_forces_mastery_guardian': 'guardian_primal_forces_mastery',
  'psionic_mastery_guardian': 'guardian_psionic_mastery',
  'soul_mastery_guardian': 'guardian_soul_mastery',
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
  const segments = midsPath.split('.').map(s => s.trim());
  if (segments.length < 2 || segments[0] !== 'Epic') return null;

  // "Energy_Mastery_Brute" → "energy_mastery_brute"
  const midsEpicName = segments[1].toLowerCase();

  // Direct override for known Mids/HC naming divergences (set renames).
  const override = MIDS_EPIC_POOL_OVERRIDES[midsEpicName];
  if (override && getEpicPool(override)) return override;

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

  // Also try AT-abbreviation PREFIXES (e.g. "corr_flame_mastery" → try
  // `corruptor_flame_mastery` or just `flame_mastery`).
  for (const [prefix, ats] of Object.entries(MIDS_EPIC_AT_PREFIXES)) {
    if (midsEpicName.startsWith(prefix)) {
      const baseName = midsEpicName.slice(prefix.length);
      for (const at of ats) {
        const candidateId = `${at}_${baseName}`;
        for (const pool of Object.values(allEpicPools)) {
          if (pool.id.toLowerCase() === candidateId) {
            return pool.id;
          }
        }
      }
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

    // Always key by the set ID itself — catches cases where our ID spelling
    // diverges from the display-name spelling (e.g. `superior_ascendency_of_the_dominator`
    // has display "Superior Ascendancy of the Dominator" but Mids sends the ID spelling).
    lookup.set(id, id);
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
  // Defensive: Mids slot entries occasionally have undefined/null Uid values.
  // Treat them as an empty slot rather than crashing.
  if (uid == null || typeof uid !== 'string' || uid.length === 0) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: '(empty)', message: 'Enhancement entry had no Uid' },
    };
  }

  // The ioLevel in .mbd is 0-based (49 = level 50)
  const level = Math.min(Math.max(ioLevel + 1, 1), 53);
  const boost = parseBoostLevel(relativeLevel);

  // Check for special enhancements (Hamidon, Synthetic HO, Titan, Hydra, D-Sync, Prestige)
  if (grade === 'SingleO' || uid.startsWith('Synthetic_Hamidon_') || uid.startsWith('Hamidon_') || uid.startsWith('Titan_') || uid.startsWith('Hydra_') || uid.startsWith('DSync_') || uid.startsWith('Dsync_') || uid.startsWith('Generic_')) {
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
// LEGACY ENHANCEMENT FORMAT (pre-2024 Mids)
// ============================================

/**
 * Normalize an IO set piece display name so minor divergences between data
 * sources (Mids, HC binary, our app data) collapse to the same key.
 *
 * Handles:
 *  - `Resistance` ↔ `Damage Resistance`
 *  - `+End` ↔ `+Endurance`, `+HP` ↔ `+Hit Points` ↔ `+Health`
 *  - `Increased Global Recharge Speed` ↔ `+Recharge`
 *  - `RechargeTime` ↔ `Recharge`, `Endurance Reduction` ↔ `Endurance`
 *  - `Chance for/of/to X` collapses
 *  - `Damage(Negative)` ↔ `Damage(Negative Energy)` — strip " Energy"
 *  - `Knockback Reduction (N points)` ↔ `Knockback Protection`
 *  - `Scaling Resist Damage` ↔ `+Res(All)`
 *  - `TP Protection +3% Def (All)` ↔ `+Def(All)`
 */
function normalizePieceName(name: string): string {
  let n = name.toLowerCase().trim();

  // Strip apostrophes and curly quotes.
  n = n.replace(/['']/g, '');

  // Canonical slash separator (no spaces around "/").
  n = n.replace(/\s*\/\s*/g, '/');

  // Recharge phrasings.
  n = n.replace(/increased global recharge speed/g, '+recharge');
  n = n.replace(/\bglobal recharge\b/g, '+recharge');
  n = n.replace(/\brechargetime\b/g, 'recharge');

  // Chance-for-X collapses.
  n = n.replace(/\bchance (for|to|of)\s+/g, 'chance ');

  // Endurance phrasings.
  n = n.replace(/\bendurance reduction\b/g, 'endurance');
  n = n.replace(/\bend mod\b/g, 'endmod');
  n = n.replace(/\bendurance modification\b/g, 'endmod');
  n = n.replace(/\+endurance\b/g, '+end');
  n = n.replace(/\+end\b/g, '+end');

  // Health / HP aliases.
  n = n.replace(/\+hit points\b/g, '+hp');
  n = n.replace(/\+health\b/g, '+hp');
  n = n.replace(/heal self\b/g, '+hp');

  // Damage type expansions → short forms.
  n = n.replace(/negative energy/g, 'negative');

  // Knockback Reduction (N points) / Knockback Protection → kb protection.
  n = n.replace(/knockback reduction\s*\(\d+\s*points?\)/g, 'knockback protection');
  n = n.replace(/knockback reduction/g, 'knockback protection');

  // Scaling Resist Damage → +res(all).
  n = n.replace(/scaling resist damage/g, '+res(all)');
  n = n.replace(/scaling resistance/g, '+res(all)');

  // Shield Wall: "+Res (Teleportation), +5% Res (All)" → +res(all)
  n = n.replace(/\+res\s*\(teleportation\),\s*\+\d+%\s*res\s*\(all\)/g, '+res(all)');
  n = n.replace(/\+res\s*\(all\)/g, '+res(all)');

  // Gladiator's Armor: "TP Protection +3% Def (All)" → +def(all)
  n = n.replace(/tp protection\s*\+\d+%\s*def\s*\(all\)/g, '+def(all)');
  n = n.replace(/\+def\s*\(all\)/g, '+def(all)');
  n = n.replace(/\+def\s*\d+%\s*/g, '+def(all) ');
  n = n.replace(/resistance\/\+def\s*\d+%?/g, 'damage resistance/+def(all)');

  // Max HP aliases.
  n = n.replace(/\+max hp\b/g, '+max hitpoints');
  n = n.replace(/\+max hitpoints\b/g, '+max hitpoints');

  // Strip "damage " prefix from each slash-segment (Aegis / Unbreakable Guard).
  n = n.split('/').map((part) => part.replace(/^damage\s+/, '').trim()).join('/');

  // Parenthetical spacing.
  n = n.replace(/\s*\(\s*/g, '(').replace(/\s*\)\s*/g, ')');

  // Collapse whitespace runs.
  n = n.replace(/\s+/g, ' ').trim();

  return n;
}

/** Single-word aspect aliases used by parsePieceAspects. */
const ASPECT_WORD_ALIASES: Record<string, string> = {
  'accuracy': 'accuracy',
  'acc': 'accuracy',
  'damage': 'damage',
  'dam': 'damage',
  'dmg': 'damage',
  'endurance': 'endurance',
  'end': 'endurance',
  'endmod': 'endmod',
  'endurancemod': 'endmod',
  'enduranceamod': 'endmod',
  'endurancemodification': 'endmod',
  'recharge': 'recharge',
  'rech': 'recharge',
  'rechargetime': 'recharge',
  'range': 'range',
  'defense': 'defense',
  'def': 'defense',
  'resistance': 'resistance',
  'res': 'resistance',
  'damageresistance': 'resistance',
  'heal': 'heal',
  'healing': 'heal',
  'absorb': 'absorb',
  'tohit': 'tohit',
  'tohitbuff': 'tohit',
  'tohitdebuff': '-tohit',
  '-tohit': '-tohit',
  // Mez aliases — Mids uses past tense (Confused, Stunned, Held, Slept); our data uses infinitive.
  'holdduration': 'hold',
  'hold': 'hold',
  'held': 'hold',
  'immobilize': 'immobilize',
  'immobilizeduration': 'immobilize',
  'immob': 'immobilize',
  'immobilized': 'immobilize',
  'stun': 'stun',
  'stunduration': 'stun',
  'stunned': 'stun',
  'sleep': 'sleep',
  'sleepduration': 'sleep',
  'slept': 'sleep',
  'fear': 'fear',
  'fearduration': 'fear',
  'feared': 'fear',
  'terrorized': 'fear',
  'confuse': 'confuse',
  'confused': 'confuse',
  'confuseduration': 'confuse',
  'taunt': 'taunt',
  'tauntduration': 'taunt',
  'taunted': 'taunt',
  'placate': 'placate',
  'placated': 'placate',
  'threat': 'taunt',
  'slow': 'slow',
  'slowmovement': 'slow',
  'knockback': 'knockback',
  'flight': 'flight',
  'flightspeed': 'flight',
  'jumping': 'jump',
  'jump': 'jump',
  'running': 'run',
  'runspeed': 'run',
  'interrupt': 'interrupt',
  'interrupttime': 'interrupt',
  // ATO-specific bonus aspect names. Mids uses verbose names; our data uses
  // terser "+X%" forms. All collapse to the same `atobonus` canonical key.
  'criticalhitbonus': 'atobonus',
  'criticalhit': 'atobonus',
  'furybonus': 'atobonus',
  'fury': 'atobonus',
  'buildupproc': 'atobonus',
  'buildup': 'atobonus',
  'rchbuildup': 'atobonus',
  'energyfont': 'atobonus',
  'fieryorb': 'atobonus',
  'dominationbonus': 'atobonus',
  'domination': 'atobonus',
  'containmentproc': 'atobonus',
  'containment': 'atobonus',
  'assassinbonus': 'atobonus',
  'assassination': 'atobonus',
  'gauntletbonus': 'atobonus',
  'gauntlet': 'atobonus',
  'minionbonus': 'atobonus',
  'petbonus': 'atobonus',
  'petresistregen': 'atobonus',
  'petaoedefenseaura': 'atobonus',
  'petdefenseaura': 'atobonus',
  'chanceofdamage': 'atobonus',
  // Mids "Control Duration" is the same concept as our data's generic "Mez"
  // aspect on Dominator ATO sets (Overpowering Presence, Dominating Grasp,
  // Will of the Controller, Ascendency of the Dominator). Map both to `mez`,
  // and in the aspect matcher treat `mez` as a wildcard for any specific mez
  // aspect (Confuse/Hold/etc.) in case a set uses a specific one instead.
  'controlduration': 'mez',
  'mez': 'mez',
};

/** Mez-type canonical aspect names that the `mez` wildcard should match. */
const MEZ_ASPECT_NAMES = new Set(['confuse', 'hold', 'immobilize', 'stun', 'sleep', 'fear', 'taunt', 'placate', 'slow', 'mez']);

/**
 * Check if a display-name-only enhancement is a special enhancement
 * (Hamidon Exposure, Titan, Hydra, D-Sync).
 */
function isSpecialEnhancementName(name: string): boolean {
  return /\b(exposure|origin|nucleus)\b/i.test(name)
    || name.startsWith('Titan ')
    || name.startsWith('Hydra ')
    || name.startsWith('D-Sync ');
}

/**
 * Look up a special enhancement (Hamidon/Titan/Hydra/D-Sync/Prestige) by display name.
 */
function findSpecialByDisplayName(displayName: string, boost: number): Enhancement | null {
  const needle = displayName.toLowerCase().trim();
  const registries: Array<[typeof HAMIDON_ENHANCEMENTS, 'hamidon' | 'titan' | 'hydra' | 'd-sync' | 'prestige']> = [
    [HAMIDON_ENHANCEMENTS, 'hamidon'],
    [TITAN_ENHANCEMENTS, 'titan'],
    [HYDRA_ENHANCEMENTS, 'hydra'],
    [DSYNC_ENHANCEMENTS, 'd-sync'],
    [PRESTIGE_ENHANCEMENTS, 'prestige'],
  ];
  for (const [registry, category] of registries) {
    for (const [id, def] of Object.entries(registry)) {
      if (def.name.toLowerCase() === needle) {
        try {
          return createSpecialEnhancement(id, def, category, boost || undefined);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/**
 * Parse a piece display name into a canonical set of aspect words, stripping
 * apostrophes, normalizing slashes, and mapping common synonyms so that
 * "Damage/Endurance/Accuracy/RechargeTime" and "Accuracy/Damage/Endurance/Recharge"
 * produce the same aspect set.
 *
 * Returns an empty array for proc/special pieces whose names don't follow the
 * slash-separated aspect convention.
 */
function parsePieceAspects(name: string): string[] {
  // Skip if this looks like a true proc or KB/teleport special.
  // Note: parentheses alone don't signal a proc — "+Res(All)" is just a
  // formatting convention for ATO-bonus pieces.
  if (/\bchance\b|\bscaling\b|\bknockback (protection|reduction)\b|\breduction \(/i.test(name)) {
    return [];
  }

  const segments = name
    .toLowerCase()
    .replace(/['']/g, '')
    .split(/\s*\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) return [];

  const aspects: string[] = [];
  for (const seg of segments) {
    // Segments starting with `+` (e.g. "+Regeneration", "+Res(All)",
    // "+Critical Hit%") or containing "Pet " are ATO-bonus aspects — collapse
    // them into a single `atobonus` so our "Endurance/+Regen/+Res(All)" piece
    // matches Mids' "Endurance/Pet +Resist +Regen".
    if (seg.startsWith('+') || /\bpet\b/.test(seg) || /^-/.test(seg)) {
      aspects.push('atobonus');
      continue;
    }
    // Normalize: strip non-alphanumeric runs.
    const key = seg.replace(/[^a-z0-9-]+/g, '');
    if (!key) return [];
    aspects.push(ASPECT_WORD_ALIASES[key] ?? key);
  }

  // Dedupe atobonus (multi-segment bonus aspects collapse to one).
  const deduped: string[] = [];
  let atobonusSeen = false;
  for (const a of aspects) {
    if (a === 'atobonus') {
      if (atobonusSeen) continue;
      atobonusSeen = true;
    }
    deduped.push(a);
  }

  deduped.sort();
  return deduped;
}

/**
 * Older Mids exports (e.g. 3.5.x, DB 2023.x) store enhancements by display
 * name inside an inner `Enhancement` string field, not a `Uid`. Format is
 * `"Set Name: Piece Name"`, e.g. `"Blood Mandate: Accuracy/Damage"`. Generic
 * IOs use `"Invention: Stat"`. This parser resolves those to app enhancements
 * via the display-name lookups already used elsewhere in the mapper.
 */
export function mapEnhancementByDisplayName(
  displayName: string,
  ioLevel: number,
  relativeLevel: string,
  grade?: string,
): EnhancementMapResult {
  if (typeof displayName !== 'string' || displayName.length === 0) {
    return { enhancement: null, warning: null };
  }

  const level = Math.min(Math.max(ioLevel + 1, 1), 53);
  const boost = parseBoostLevel(relativeLevel);

  // Special enhancements (Hamidon, Titan, Hydra, D-Sync). Mids encodes these
  // with Grade='SingleO' and the full display name in the Enhancement string
  // (e.g. "Membrane Exposure").
  if (grade === 'SingleO' || isSpecialEnhancementName(displayName)) {
    const enh = findSpecialByDisplayName(displayName, boost);
    if (enh) return { enhancement: enh, warning: null };
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: displayName, message: `Unknown special enhancement: ${displayName}` },
    };
  }

  // Split on the first ": " (sets may contain colons in piece names like "Chance for +End").
  const splitIdx = displayName.indexOf(': ');
  if (splitIdx < 0) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: displayName, message: `Legacy enhancement lacks "Set: Piece" format` },
    };
  }

  const setNameRaw = displayName.slice(0, splitIdx).trim();
  const pieceNameRaw = displayName.slice(splitIdx + 2).trim();

  // Generic IOs: "Invention: Accuracy"
  if (setNameRaw.toLowerCase() === 'invention') {
    const stat = MIDS_STAT_MAP[pieceNameRaw.replace(/\s+/g, '_')]
      ?? MIDS_STAT_MAP[pieceNameRaw]
      ?? pieceNameRaw.replace(/\s+/g, '_');
    try {
      const enh = createGenericIOEnhancement(stat as any, level, boost || undefined);
      return { enhancement: enh, warning: null };
    } catch {
      return {
        enhancement: null,
        warning: { type: 'enhancement', midsName: displayName, message: `Unknown generic IO stat: ${pieceNameRaw}` },
      };
    }
  }

  // Set IO: look up set by display name, then piece by display name.
  // Apply known spelling fixes before normalizing (e.g. Mids misspells
  // "Convalescence" as "Convalesence").
  const setNameFixed = setNameRaw.replace(/Convalesence/gi, 'Convalescence');

  const normalizedSet = setNameFixed
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '_');

  const nameLookup = getIOSetNameLookup();
  let setId = nameLookup.get(normalizedSet);
  if (!setId) {
    // Try without hyphens (same normalization the lookup builder uses).
    setId = nameLookup.get(normalizedSet.replace(/-/g, ''));
  }
  if (!setId) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: displayName, message: `Legacy set not found: ${setNameRaw}` },
    };
  }

  const ioSet = getIOSet(setId);
  if (!ioSet) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: displayName, message: `Set resolved to ${setId} but not retrievable` },
    };
  }

  // Piece-name resolution. Try in order:
  //   1. Auto-generated alias table keyed by HC display name.
  //   2. Normalized matcher (handles common word aliases).
  //   3. Aspect-set matching for compound pieces (e.g. "Damage/Endurance/Accuracy").
  //   4. Proc detection: if the Mids name looks like a proc ("Chance for/to/of",
  //      "+X"), fall back to the set's unique proc piece.
  let piece = null as (typeof ioSet.pieces)[number] | null;

  const aliasKey = `${setId}\u0000${pieceNameRaw.toLowerCase().trim()}`;
  const aliasPieceNum = LEGACY_PIECE_ALIASES[aliasKey];
  if (aliasPieceNum != null) {
    piece = ioSet.pieces.find((p) => p.num === aliasPieceNum) ?? null;
  }

  if (!piece) {
    const pieceNorm = normalizePieceName(pieceNameRaw);
    piece = ioSet.pieces.find(
      (p) => normalizePieceName(p.name) === pieceNorm,
    ) ?? null;
  }

  // Aspect-set match: compare multiset of aspect words. Handles two wildcards:
  //   - `mez` (from Mids "Control Duration" or our "Mez") matches any mez aspect.
  //   - `atobonus` (from Mids "X Bonus" / "+X%") matches our +X%/ATO-bonus piece.
  if (!piece) {
    const midsAspects = parsePieceAspects(pieceNameRaw);
    if (midsAspects.length > 0) {
      piece = ioSet.pieces.find((p) => {
        const ourAspects = parsePieceAspects(p.name);
        if (ourAspects.length !== midsAspects.length) return false;
        const ourRemaining = [...ourAspects];
        for (const m of midsAspects) {
          let idx = -1;
          if (m === 'mez') {
            idx = ourRemaining.findIndex((o) => MEZ_ASPECT_NAMES.has(o));
          } else if (m === 'atobonus') {
            idx = ourRemaining.findIndex((o) => o === 'atobonus');
          } else {
            idx = ourRemaining.indexOf(m);
          }
          if (idx < 0) return false;
          ourRemaining.splice(idx, 1);
        }
        return ourRemaining.length === 0;
      }) ?? null;
    }
  }

  // Proc fallback: if Mids name looks proc-y and the set has a single proc piece, use it.
  if (!piece) {
    const looksProcy = /\bchance\b|\+\w|\bscaling\b/i.test(pieceNameRaw);
    if (looksProcy) {
      const procPieces = ioSet.pieces.filter((p) => p.proc);
      if (procPieces.length === 1) {
        piece = procPieces[0];
      }
    }
  }

  // Last-resort fuzzy aspect match: same count, at most 1 mismatched aspect.
  // Catches cases like Perfect Zinger's `Threat/Placate/Recharge` (Mids)
  // vs `Range/Recharge/Threat` (ours) — same 3-aspect piece, one aspect
  // labeled differently.
  if (!piece) {
    const midsAspects = parsePieceAspects(pieceNameRaw);
    if (midsAspects.length >= 2) {
      const candidates = ioSet.pieces
        .map((p) => ({
          p,
          ourAspects: parsePieceAspects(p.name),
        }))
        .filter(({ ourAspects }) => ourAspects.length === midsAspects.length);
      const matches = candidates.map(({ p, ourAspects }) => {
        const overlap = ourAspects.filter((a) => midsAspects.includes(a)).length;
        return { p, overlap };
      });
      // Accept if the best candidate has exactly one mismatch and is unique.
      matches.sort((a, b) => b.overlap - a.overlap);
      if (
        matches.length > 0 &&
        matches[0].overlap === midsAspects.length - 1 &&
        (matches.length === 1 || matches[0].overlap > matches[1].overlap)
      ) {
        piece = matches[0].p;
      }
    }
  }

  if (!piece) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', midsName: displayName, message: `Piece not found in ${ioSet.name}: ${pieceNameRaw}` },
    };
  }

  // Older format uses `Grade: "None"` for IOs; treat all legacy entries as non-attuned
  // unless the caller explicitly maps them elsewhere.
  const enh = createIOSetEnhancement(ioSet, piece, piece.num - 1, {
    attuned: false,
    level,
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
  // Synthetic_Hamidon_ must come before Hamidon_ so startsWith matches the longer prefix first.
  // Synthetic HOs share the Hamidon registry (identical aspect values in-game).
  ['Synthetic_Hamidon_', 'hamidon'],
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
