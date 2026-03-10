/**
 * Homecoming in-game build export importer
 *
 * Converts parsed game export data into a complete Build object
 * that can be loaded into the build store.
 */

import type {
  Build,
  SelectedPower,
  Power,
  Enhancement,
  PoolSelection,
  ArchetypeId,
  Origin,
} from '@/types';
import { createEmptyIncarnateBuildState } from '@/types';
import {
  getArchetype,
  getPowerset,
  getAllPowersets,
  getPowerPool,
  getEpicPool,
  getEpicPoolsForArchetype,
  getIOSet,
  getAllIOSets,
  getInherentPowers,
  createArchetypeInherentPower,
  createIOSetEnhancement,
  createGenericIOEnhancement,
} from '@/data';
import type { InherentPowerDef } from '@/data';
import { computeSetTracking } from '@/utils/calculations/set-tracking';

import { parseGameExport } from './parser';
import type {
  GameExportEnhancement,
  GameImportResult,
  GameImportWarning,
  GameImportSummary,
} from './types';

// ============================================
// ARCHETYPE MAPPING
// ============================================

const ARCHETYPE_MAP: Record<string, ArchetypeId> = {
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

const ORIGIN_MAP: Record<string, Origin> = {
  'Magic': 'Magic',
  'Mutation': 'Mutation',
  'Natural': 'Natural',
  'Science': 'Science',
  'Technology': 'Technology',
};

/**
 * Maps game export category prefixes to primary/secondary.
 * The game export uses "{Archetype}_{Role}" format for categories.
 */
const CATEGORY_ROLE_MAP: Record<string, 'primary' | 'secondary'> = {
  // Primary roles
  'Ranged': 'primary',      // Blaster, Corruptor, Defender (primary ranged), Sentinel
  'Melee': 'primary',       // Scrapper, Stalker, Brute (varies)
  'Control': 'primary',     // Controller, Dominator
  'Summon': 'primary',      // Mastermind
  'Defensive': 'primary',   // Peacebringer/Warshade (can be secondary too)
  // Secondary roles
  'Support': 'secondary',   // Blaster secondary
  'Buff': 'secondary',      // Defender, Controller, Corruptor, Mastermind secondary
  'Defense': 'secondary',   // Tanker primary → but also Scrapper/Brute/Stalker/Sentinel secondary
  'Assault': 'secondary',   // Dominator secondary
};

/**
 * Determine if a category prefix indicates primary or secondary for a given archetype.
 * Some roles swap meaning depending on archetype (e.g., Defense is primary for Tanker, secondary for Scrapper).
 */
function getCategoryType(category: string, archetypeId: string): 'primary' | 'secondary' | null {
  // Parse: "Corruptor_Ranged" → archetype="Corruptor", role="Ranged"
  const parts = category.split('_');
  if (parts.length < 2) return null;

  const role = parts.slice(1).join('_'); // Handle multi-word roles like "Arachnos_Soldier"

  // Special cases where role meaning flips based on archetype
  if (role === 'Defense') {
    // Defense is PRIMARY for Tanker, SECONDARY for everyone else
    return archetypeId === 'tanker' ? 'primary' : 'secondary';
  }
  if (role === 'Melee') {
    // Melee is PRIMARY for Scrapper/Stalker/Brute, SECONDARY for Tanker
    return archetypeId === 'tanker' ? 'secondary' : 'primary';
  }
  if (role === 'Ranged') {
    // Ranged is PRIMARY for Blaster/Corruptor/Sentinel, SECONDARY for Defender
    return archetypeId === 'defender' ? 'secondary' : 'primary';
  }
  if (role === 'Buff') {
    // Buff is PRIMARY for Defender, SECONDARY for Controller/Corruptor/Mastermind
    return archetypeId === 'defender' ? 'primary' : 'secondary';
  }

  return CATEGORY_ROLE_MAP[role] ?? null;
}

// ============================================
// GENERIC IO STAT MAPPING
// ============================================

const GENERIC_STAT_MAP: Record<string, string> = {
  'Damage': 'Damage',
  'Accuracy': 'Accuracy',
  'Recharge': 'Recharge',
  'EnduranceReduction': 'EnduranceReduction',
  'Endurance_Reduction': 'EnduranceReduction',
  'EndRdx': 'EnduranceReduction',
  'Range': 'Range',
  'Defense': 'Defense',
  'Defense_Buff': 'Defense',
  'Resistance': 'Resistance',
  'Healing': 'Healing',
  'Heal': 'Healing',
  'ToHit': 'ToHit',
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
  'Interrupt': 'Interrupt',
  'Absorb': 'Absorb',
};

// ============================================
// IO SET NAME LOOKUP
// ============================================

let _ioSetNameLookup: Map<string, string> | null = null;

function getIOSetNameLookup(): Map<string, string> {
  if (_ioSetNameLookup) return _ioSetNameLookup;

  const lookup = new Map<string, string>();
  const allSets = getAllIOSets();
  for (const [id, set] of Object.entries(allSets)) {
    // Normalize: "Positron's Blast" → "positrons_blast"
    const normalized = set.name
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/\s+/g, '_');
    lookup.set(normalized, id);

    // Also store the raw ID
    lookup.set(id, id);
  }
  return lookup;
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

export function importGameExport(text: string): GameImportResult {
  const warnings: GameImportWarning[] = [];
  const summary: GameImportSummary = {
    powersImported: 0,
    powersFailed: 0,
    enhancementsImported: 0,
    enhancementsFailed: 0,
    slotsImported: 0,
  };

  // 1. Parse text
  const parsed = parseGameExport(text);
  if (!parsed) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'general', name: '', message: 'Could not parse game export text. Make sure it includes the header line and power entries.' }],
      summary,
    };
  }

  // 2. Map archetype
  const archetypeId = ARCHETYPE_MAP[parsed.header.archetype];
  if (!archetypeId) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'archetype', name: parsed.header.archetype, message: `Unknown archetype: ${parsed.header.archetype}` }],
      summary,
    };
  }

  const archetype = getArchetype(archetypeId);
  if (!archetype) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'archetype', name: archetypeId, message: `Archetype data not found: ${archetypeId}` }],
      summary,
    };
  }

  // 3. Map origin and level
  const origin = ORIGIN_MAP[parsed.header.origin] ?? 'Natural';
  const level = Math.min(Math.max(parsed.header.level, 1), 50);

  // 4. Process powers by category
  const primaryPowers: SelectedPower[] = [];
  const secondaryPowers: SelectedPower[] = [];
  const poolPowersMap: Record<string, SelectedPower[]> = {};
  const epicPowers: SelectedPower[] = [];
  const inherentSlotData: SelectedPower[] = [];

  let primaryId: string | null = null;
  let secondaryId: string | null = null;
  const poolIds: string[] = [];
  let epicPoolId: string | null = null;

  for (const entry of parsed.powers) {
    // Skip Redirects (inherent procs like Gauntlet_Proc)
    if (entry.category === 'Redirects') continue;

    // Inherent powers
    if (entry.category === 'Inherent') {
      const slots = resolveEnhancements(entry.enhancements, warnings, summary);
      if (slots.some((s) => s !== null)) {
        inherentSlotData.push({
          name: entry.powerName.replace(/_/g, ' '),
          powerSet: 'Inherent',
          level: 1,
          available: -1,
          maxSlots: 6,
          slots,
          effects: {},
        } as SelectedPower);
      }
      continue;
    }

    // Pool powers
    if (entry.category === 'Pool') {
      const poolId = entry.powerset.toLowerCase();
      const pool = getPowerPool(poolId);
      if (!pool) {
        warnings.push({ type: 'pool', name: `${entry.powerset}/${entry.powerName}`, message: `Pool not found: ${poolId}` });
        summary.powersFailed++;
        continue;
      }

      const powerDef = findPowerByInternalName(pool.powers, entry.powerName);
      if (!powerDef) {
        // Some powers are auto-granted (like Fly_Boost) and may not have slots
        if (entry.level === 0 && entry.enhancements.length === 0) continue;
        warnings.push({ type: 'pool', name: `${entry.powerset}/${entry.powerName}`, message: `Pool power not found: ${entry.powerName}` });
        summary.powersFailed++;
        continue;
      }

      if (!poolPowersMap[poolId]) {
        poolPowersMap[poolId] = [];
        poolIds.push(poolId);
      }

      const slots = resolveEnhancements(entry.enhancements, warnings, summary);
      poolPowersMap[poolId].push(buildSelectedPower(powerDef, poolId, entry.level, slots));
      summary.powersImported++;
      continue;
    }

    // Epic powers
    if (entry.category === 'Epic') {
      const epicId = resolveEpicPoolId(entry.powerset, archetypeId);
      if (!epicId) {
        warnings.push({ type: 'epic', name: `${entry.powerset}/${entry.powerName}`, message: `Epic pool not found: ${entry.powerset}` });
        summary.powersFailed++;
        continue;
      }

      const epicPool = getEpicPool(epicId);
      if (!epicPool) {
        warnings.push({ type: 'epic', name: epicId, message: `Epic pool data not found: ${epicId}` });
        summary.powersFailed++;
        continue;
      }

      epicPoolId = epicId;
      const powerDef = findPowerByInternalName(epicPool.powers, entry.powerName);
      if (!powerDef) {
        warnings.push({ type: 'epic', name: entry.powerName, message: `Epic power not found: ${entry.powerName}` });
        summary.powersFailed++;
        continue;
      }

      const slots = resolveEnhancements(entry.enhancements, warnings, summary);
      epicPowers.push(buildSelectedPower(powerDef, epicId, entry.level, slots));
      summary.powersImported++;
      continue;
    }

    // Primary/Secondary powers
    const catType = getCategoryType(entry.category, archetypeId);
    if (!catType) {
      warnings.push({ type: 'power', name: `${entry.category}/${entry.powerName}`, message: `Unknown category: ${entry.category}` });
      summary.powersFailed++;
      continue;
    }

    // Resolve powerset ID
    const powersetId = resolvePowersetId(entry.powerset, archetypeId);
    if (!powersetId) {
      warnings.push({ type: 'powerset', name: entry.powerset, message: `Could not resolve powerset: ${entry.powerset} for ${archetypeId}` });
      summary.powersFailed++;
      continue;
    }

    const powerset = getPowerset(powersetId);
    if (!powerset) {
      warnings.push({ type: 'powerset', name: powersetId, message: `Powerset data not found: ${powersetId}` });
      summary.powersFailed++;
      continue;
    }

    const powerDef = findPowerByInternalName(powerset.powers, entry.powerName);
    if (!powerDef) {
      warnings.push({ type: 'power', name: entry.powerName, message: `Power not found in ${powerset.name}: ${entry.powerName}` });
      summary.powersFailed++;
      continue;
    }

    const slots = resolveEnhancements(entry.enhancements, warnings, summary);
    const selectedPower = buildSelectedPower(powerDef, powersetId, entry.level, slots);

    if (catType === 'primary') {
      primaryId = powersetId;
      primaryPowers.push(selectedPower);
    } else {
      secondaryId = powersetId;
      secondaryPowers.push(selectedPower);
    }
    summary.powersImported++;
  }

  // 5. Build pool selections
  const pools: PoolSelection[] = poolIds.map((id) => {
    const pool = getPowerPool(id);
    return {
      id,
      name: pool?.name ?? id,
      powers: poolPowersMap[id] ?? [],
    };
  });

  // 6. Build epic pool selection
  let epicPool: PoolSelection | null = null;
  if (epicPoolId) {
    const epic = getEpicPool(epicPoolId);
    if (epic) {
      epicPool = {
        id: epicPoolId,
        name: epic.name,
        powers: epicPowers,
      };
    }
  }

  // 7. Build inherent powers
  const inherents = getInherentSelectedPowers(archetype.name, archetype.inherent);

  // Merge slot data from inherent entries
  for (const slotPower of inherentSlotData) {
    const match = inherents.find(
      (inh) => inh.name.toLowerCase() === slotPower.name.toLowerCase()
    );
    if (match && slotPower.slots.length > 0) {
      match.slots = slotPower.slots;
    }
  }

  // 8. Resolve powerset names
  const primaryPowerset = primaryId ? getPowerset(primaryId) : null;
  const secondaryPowerset = secondaryId ? getPowerset(secondaryId) : null;

  // 9. Construct Build
  const build: Build = {
    name: parsed.header.characterName || `${archetype.name} Import`,
    archetype: {
      id: archetypeId,
      name: archetype.name,
      stats: archetype.stats,
      inherent: archetype.inherent,
    },
    level,
    exemplarLevel: null,
    progressionMode: 'auto',
    primary: {
      id: primaryId,
      name: primaryPowerset?.name ?? '',
      powers: primaryPowers,
    },
    secondary: {
      id: secondaryId,
      name: secondaryPowerset?.name ?? '',
      powers: secondaryPowers,
    },
    pools,
    epicPool,
    inherents,
    accolades: [],
    settings: {
      globalIOLevel: level <= 50 ? Math.min(level + 2, 53) : 50,
      origin,
    },
    sets: {},
    incarnates: createEmptyIncarnateBuildState(),
    craftingChecklist: {},
    shoppingListAcquired: {},
    slotOrder: [],
  };

  // 10. Recompute set tracking
  build.sets = computeSetTracking(build);

  return {
    success: true,
    build,
    warnings,
    summary,
  };
}

// ============================================
// POWER RESOLUTION
// ============================================

/**
 * Find a power within a powerset by internal name (underscore format).
 */
function findPowerByInternalName(powers: Power[], internalName: string): Power | null {
  // Exact internalName match
  const byInternal = powers.find(
    (p) => p.internalName?.toLowerCase() === internalName.toLowerCase()
  );
  if (byInternal) return byInternal;

  // Display name: "Chain_Lightning" → "Chain Lightning"
  const normalized = internalName.replace(/_/g, ' ');
  const byDisplay = powers.find(
    (p) => p.name.toLowerCase() === normalized.toLowerCase()
  );
  if (byDisplay) return byDisplay;

  return null;
}

/**
 * Resolve a powerset name from the game export to our powerset ID.
 * Game uses: "Storm_Blast" → we need: "corruptor/storm-blast"
 */
function resolvePowersetId(gameSetName: string, archetypeId: string): string | null {
  // Convert: "Storm_Blast" → "storm-blast"
  const slug = gameSetName.toLowerCase().replace(/_/g, '-');
  const directId = `${archetypeId}/${slug}`;

  // Try direct ID
  if (getPowerset(directId)) return directId;

  // Fallback: brute-force search all powersets for this archetype
  const allPowersets = getAllPowersets();
  for (const [id, ps] of Object.entries(allPowersets)) {
    if (ps.archetype?.toLowerCase() !== archetypeId) continue;

    // Match by internal name in the powerset data
    const psSlug = id.split('/')[1];
    if (psSlug === slug) return id;

    // Match by display name
    const psDisplaySlug = ps.name.toLowerCase().replace(/\s+/g, '-');
    if (psDisplaySlug === slug) return id;
  }

  return null;
}

/**
 * Resolve an epic pool name from the game export to our epic pool ID.
 * Game uses: "Corruptor_Mace_Mastery" or "Energy_Mastery"
 */
function resolveEpicPoolId(gameName: string, archetypeId: string): string | null {
  const normalized = gameName.toLowerCase();

  // Try direct match: "Corruptor_Mace_Mastery" → "corruptor_mace_mastery"
  let pool = getEpicPool(normalized);
  if (pool) return pool.id;

  // Try with archetype prefix: "Energy_Mastery" → "corruptor_energy_mastery"
  // (Some exports may not include archetype prefix)
  const withArchetype = `${archetypeId.replace(/-/g, '_')}_${normalized}`;
  pool = getEpicPool(withArchetype);
  if (pool) return pool.id;

  // Fallback: search epic pools for this archetype
  const epicPools = getEpicPoolsForArchetype(archetypeId);
  for (const ep of epicPools) {
    if (ep.id.toLowerCase() === normalized) return ep.id;
    if (ep.id.toLowerCase() === withArchetype) return ep.id;
    // Partial match: "Energy_Mastery" matches "corruptor_energy_mastery"
    if (ep.id.toLowerCase().endsWith(`_${normalized}`)) return ep.id;
    // Display name match
    if (ep.name.toLowerCase().replace(/\s+/g, '_') === normalized) return ep.id;
  }

  return null;
}

// ============================================
// ENHANCEMENT RESOLUTION
// ============================================

/**
 * Resolve an array of parsed enhancements into Enhancement objects.
 */
function resolveEnhancements(
  enhancements: (GameExportEnhancement | null)[],
  warnings: GameImportWarning[],
  summary: GameImportSummary,
): (Enhancement | null)[] {
  return enhancements.map((enh) => {
    summary.slotsImported++;
    if (!enh) return null;

    const result = resolveEnhancement(enh);
    if (result.warning) {
      warnings.push(result.warning);
      summary.enhancementsFailed++;
    }
    if (result.enhancement) {
      summary.enhancementsImported++;
    }
    return result.enhancement;
  });
}

interface EnhancementResolveResult {
  enhancement: Enhancement | null;
  warning: GameImportWarning | null;
}

/**
 * Resolve a single parsed enhancement into an Enhancement object.
 */
function resolveEnhancement(enh: GameExportEnhancement): EnhancementResolveResult {
  const { uid, level, boost, attuned } = enh;

  // Check for generic IOs: "Crafted_Accuracy", "Crafted_Heal", etc.
  if (uid.startsWith('Crafted_') && !hasIOSetPieceSuffix(uid)) {
    const statPart = uid.slice('Crafted_'.length);
    const stat = GENERIC_STAT_MAP[statPart];
    if (stat) {
      const enhancement = createGenericIOEnhancement(
        stat as any,
        level ?? 50,
        boost,
      );
      return { enhancement, warning: null };
    }
    return {
      enhancement: null,
      warning: { type: 'enhancement', name: uid, message: `Unknown generic IO stat: ${statPart}` },
    };
  }

  // IO Set enhancement
  const parsed = parseIOSetUid(uid);
  if (!parsed) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', name: uid, message: `Could not parse enhancement UID` },
    };
  }

  // Look up the IO set
  let ioSet = getIOSet(parsed.setId);

  // Fallback: name-based lookup
  if (!ioSet) {
    const nameLookup = getIOSetNameLookup();
    const fallbackId = nameLookup.get(parsed.setId);
    if (fallbackId) {
      ioSet = getIOSet(fallbackId);
    }
  }

  if (!ioSet) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', name: uid, message: `IO set not found: ${parsed.setId}` },
    };
  }

  // Find the piece
  const piece = ioSet.pieces.find((p) => p.num === parsed.pieceNum);
  if (!piece) {
    return {
      enhancement: null,
      warning: { type: 'enhancement', name: uid, message: `Piece ${parsed.pieceNum} not found in set ${ioSet.name}` },
    };
  }

  const enhancement = createIOSetEnhancement(ioSet, piece, parsed.pieceNum - 1, {
    attuned: attuned || parsed.attuned,
    level: attuned ? 50 : (level ?? 50),
    boost,
  });

  return { enhancement, warning: null };
}

/**
 * Check if a UID has an IO set piece suffix (_A through _F).
 * Distinguishes "Crafted_Accuracy" (generic) from "Crafted_Hecatomb_A" (set piece).
 */
function hasIOSetPieceSuffix(uid: string): boolean {
  // Strip the Crafted_ prefix and check if what remains ends with _A through _F
  const afterPrefix = uid.slice('Crafted_'.length);
  // Must have at least something before the _X suffix
  return /^.+_[A-F]$/.test(afterPrefix);
}

interface ParsedIOSetUid {
  setId: string;
  pieceNum: number;
  attuned: boolean;
}

/**
 * Parse an IO set enhancement UID into its components.
 * Same logic as the Mids importer.
 */
function parseIOSetUid(uid: string): ParsedIOSetUid | null {
  let remaining = uid;
  let attuned = false;

  // Strip prefixes
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
// HELPERS
// ============================================

function buildSelectedPower(
  powerDef: Power,
  powersetId: string,
  level: number,
  slots: (Enhancement | null)[],
): SelectedPower {
  // Ensure at least one slot (the inherent slot)
  const finalSlots = slots.length > 0 ? slots : [null];

  return {
    ...powerDef,
    powerSet: powersetId,
    level: Math.max(level, 1),
    slots: finalSlots,
  };
}

function createInherentSelectedPower(def: InherentPowerDef): SelectedPower {
  const slots: (Enhancement | null)[] = def.maxSlots === 0 ? [] : [null];
  return {
    ...def,
    powerSet: 'Inherent',
    level: 1,
    slots,
    isLocked: def.isLocked ?? true,
    inherentCategory: def.category,
  };
}

function getInherentSelectedPowers(
  archetypeName: string,
  archetypeInherent: { name: string; description: string } | null,
): SelectedPower[] {
  const powers = getInherentPowers().map(createInherentSelectedPower);

  if (archetypeName && archetypeInherent) {
    const atInherentDef = createArchetypeInherentPower(archetypeName, archetypeInherent);
    powers.unshift(createInherentSelectedPower(atInherentDef));
  }

  return powers;
}
