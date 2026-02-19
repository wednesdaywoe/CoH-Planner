/**
 * Mids Reborn .mbd import orchestrator
 *
 * Parses .mbd JSON, maps all powers/enhancements to app format,
 * and constructs a complete Build object.
 */

import type {
  Build,
  SelectedPower,
  Power,
  Enhancement,
  PoolSelection,
  SetTracking,
} from '@/types';
import { createEmptyIncarnateBuildState } from '@/types';
import {
  getArchetype,
  getAllPowersets,
  getPowerset,
  getPowerPool,
  getEpicPool,
  getInherentPowers,
  createArchetypeInherentPower,
} from '@/data';
import type { InherentPowerDef } from '@/data';

import type {
  MbdFile,
  MbdPowerEntry,
  MidsImportResult,
  MidsImportWarning,
  MidsImportSummary,
} from './types';
import {
  mapArchetype,
  mapOrigin,
  buildPowersetLookup,
  resolvePowerset,
  findPowerByMidsName,
  buildPoolLookup,
  buildEpicLookup,
  resolvePoolId,
  resolveEpicPoolId,
  mapEnhancementUid,
} from './mappers';
import type { PoolPowerMatch, EpicPowerMatch } from './mappers';

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

export function importMidsBuild(jsonString: string): MidsImportResult {
  const warnings: MidsImportWarning[] = [];
  const summary: MidsImportSummary = {
    powersImported: 0,
    powersFailed: 0,
    enhancementsImported: 0,
    enhancementsFailed: 0,
    slotsImported: 0,
  };

  // 1. Parse JSON
  let mbd: MbdFile;
  try {
    mbd = JSON.parse(jsonString);
  } catch {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'general', midsName: '', message: 'Invalid JSON: could not parse .mbd file' }],
      summary,
    };
  }

  // 2. Validate required fields
  if (!mbd.Class || !mbd.PowerSets || !mbd.PowerEntries) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'general', midsName: '', message: 'Missing required fields (Class, PowerSets, or PowerEntries)' }],
      summary,
    };
  }

  // 3. Map archetype
  const archetypeId = mapArchetype(mbd.Class);
  if (!archetypeId) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'archetype', midsName: mbd.Class, message: `Unknown archetype: ${mbd.Class}` }],
      summary,
    };
  }

  const archetype = getArchetype(archetypeId);
  if (!archetype) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'archetype', midsName: archetypeId, message: `Archetype data not found: ${archetypeId}` }],
      summary,
    };
  }

  // 4. Map origin and level
  // Mids top-level Level is 0-based (48 = level 49), power entry levels are 1-based
  const origin = mapOrigin(mbd.Origin);
  const parsedLevel = (parseInt(mbd.Level, 10) || 49) + 1;
  const level = Math.min(Math.max(parsedLevel, 1), 50);

  // 5. Build lookup tables
  const powersetLookup = buildPowersetLookup();
  const poolLookup = buildPoolLookup();

  // 6. Resolve powersets
  const primaryPath = mbd.PowerSets[0] || '';
  const secondaryPath = mbd.PowerSets[1] || '';

  let primaryId = primaryPath ? resolvePowerset(primaryPath, archetypeId, powersetLookup) : null;
  let secondaryId = secondaryPath ? resolvePowerset(secondaryPath, archetypeId, powersetLookup) : null;

  if (!primaryId && primaryPath) {
    warnings.push({ type: 'powerset', midsName: primaryPath, message: `Could not resolve primary powerset` });
  }
  if (!secondaryId && secondaryPath) {
    warnings.push({ type: 'powerset', midsName: secondaryPath, message: `Could not resolve secondary powerset` });
  }

  let primaryPowerset = primaryId ? getPowerset(primaryId) : null;
  let secondaryPowerset = secondaryId ? getPowerset(secondaryId) : null;

  // 7. Resolve pool and epic powersets from PowerSets array
  const poolIds: string[] = [];
  let epicPoolId: string | null = null;

  for (let i = 2; i < mbd.PowerSets.length; i++) {
    const path = mbd.PowerSets[i];
    if (!path) continue;

    if (path.startsWith('Pool.')) {
      const poolId = resolvePoolId(path);
      if (poolId && getPowerPool(poolId)) {
        poolIds.push(poolId);
      } else if (poolId) {
        warnings.push({ type: 'pool', midsName: path, message: `Pool not found: ${poolId}` });
      }
    } else if (path.startsWith('Epic.')) {
      epicPoolId = resolveEpicPoolId(path, archetypeId);
      if (!epicPoolId) {
        warnings.push({ type: 'epic', midsName: path, message: `Could not resolve epic pool` });
      }
    }
  }

  // 7b. Build epic lookup (after resolving epicPoolId so it can be included)
  const epicLookup = buildEpicLookup(archetypeId, epicPoolId ? [epicPoolId] : undefined);

  // 8. Process PowerEntries
  const primaryPowers: SelectedPower[] = [];
  const secondaryPowers: SelectedPower[] = [];
  const poolPowersMap: Record<string, SelectedPower[]> = {};
  const epicPowers: SelectedPower[] = [];
  const inherentSlotData: SelectedPower[] = []; // Slot data from Inherent.* entries

  for (const poolId of poolIds) {
    poolPowersMap[poolId] = [];
  }

  for (const entry of mbd.PowerEntries) {
    if (!entry.PowerName) continue;

    const result = processEntry(
      entry,
      archetypeId,
      primaryId,
      primaryPowerset?.powers ?? [],
      secondaryId,
      secondaryPowerset?.powers ?? [],
      poolLookup,
      epicLookup,
      powersetLookup,
      warnings,
      summary,
    );

    if (!result) continue;

    switch (result.category) {
      case 'primary':
        primaryPowers.push(result.power);
        break;
      case 'secondary':
        secondaryPowers.push(result.power);
        break;
      case 'pool': {
        const poolId = result.poolId!;
        if (!poolPowersMap[poolId]) {
          poolPowersMap[poolId] = [];
          if (!poolIds.includes(poolId)) poolIds.push(poolId);
        }
        poolPowersMap[poolId].push(result.power);
        break;
      }
      case 'epic':
        epicPowers.push(result.power);
        break;
      case 'inherent':
        inherentSlotData.push(result.power);
        break;
    }
  }

  // 8b. Auto-detect primary/secondary powerset if initial resolution failed
  //     but powers were found via brute-force fallback
  if (!primaryId && primaryPowers.length > 0) {
    const detectedId = primaryPowers[0].powerSet;
    if (detectedId && detectedId !== 'Inherent') {
      const detected = getPowerset(detectedId);
      if (detected) {
        primaryId = detectedId;
        primaryPowerset = detected;
      }
    }
  }
  if (!secondaryId && secondaryPowers.length > 0) {
    const detectedId = secondaryPowers[0].powerSet;
    if (detectedId && detectedId !== 'Inherent') {
      const detected = getPowerset(detectedId);
      if (detected) {
        secondaryId = detectedId;
        secondaryPowerset = detected;
      }
    }
  }

  // 9. Build pool selections
  const pools: PoolSelection[] = poolIds.map((id) => {
    const pool = getPowerPool(id);
    return {
      id,
      name: pool?.name ?? id,
      powers: poolPowersMap[id] ?? [],
    };
  });

  // 10. Build epic pool selection
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

  // 11. Build inherent powers
  const inherents = getInherentSelectedPowers(
    archetype.name,
    archetype.inherent,
  );

  // 11b. Merge slot data from .mbd Inherent.* entries into the auto-populated inherents
  for (const slotPower of inherentSlotData) {
    const match = inherents.find(
      (inh) => inh.name.toLowerCase() === slotPower.name.toLowerCase()
    );
    if (match && slotPower.slots.length > 0) {
      match.slots = slotPower.slots;
    }
  }

  // 12. Construct the Build object
  const build: Build = {
    name: mbd.Name || `${archetype.name} Import`,
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
      globalIOLevel: 50,
      origin,
    },
    sets: {},
    incarnates: createEmptyIncarnateBuildState(),
    craftingChecklist: {},
  };

  // 13. Recompute set tracking
  build.sets = computeSetTracking(build);

  return {
    success: true,
    build,
    warnings,
    summary,
  };
}

// ============================================
// ENTRY PROCESSING
// ============================================

interface ProcessedEntry {
  category: 'primary' | 'secondary' | 'pool' | 'epic' | 'inherent';
  power: SelectedPower;
  poolId?: string;
}

function processEntry(
  entry: MbdPowerEntry,
  archetypeId: string,
  primaryId: string | null,
  primaryPowers: Power[],
  secondaryId: string | null,
  secondaryPowers: Power[],
  poolLookup: Map<string, PoolPowerMatch>,
  epicLookup: Map<string, EpicPowerMatch>,
  powersetLookup: Map<string, string>,
  warnings: MidsImportWarning[],
  summary: MidsImportSummary,
): ProcessedEntry | null {
  const { PowerName, Level: midsLevel, StatInclude, SlotEntries } = entry;
  const appLevel = midsLevel; // Mids Level is already 1-based

  // Extract segments: "Brute_Melee.Kinetic_Attack.Quick_Strike" → ["Brute_Melee", "Kinetic_Attack", "Quick_Strike"]
  const segments = PowerName.split('.');

  // Skip temporary powers
  if (PowerName.startsWith('Temporary_Powers.')) {
    return null;
  }

  // Process inherent powers for their slot data (powers are auto-populated,
  // but we need to preserve any slotted enhancements from the import)
  if (PowerName.startsWith('Inherent.')) {
    if (segments.length < 3 || !SlotEntries || SlotEntries.length <= 1) {
      return null; // No meaningful slot data to preserve
    }
    const powerInternalName = segments[2];
    // Build a minimal SelectedPower with just enough info to match and merge slots
    const slots: (Enhancement | null)[] = [];
    for (const slotEntry of SlotEntries) {
      summary.slotsImported++;
      if (!slotEntry.Enhancement) {
        slots.push(null);
        continue;
      }
      const { enhancement, warning } = mapEnhancementUid(
        slotEntry.Enhancement.Uid,
        slotEntry.Enhancement.IoLevel,
        slotEntry.Enhancement.RelativeLevel,
      );
      if (warning) { warnings.push(warning); summary.enhancementsFailed++; }
      if (enhancement) { summary.enhancementsImported++; }
      slots.push(enhancement);
    }
    return {
      category: 'inherent',
      power: {
        name: powerInternalName.replace(/_/g, ' '),
        powerSet: 'Inherent',
        level: 1,
        available: -1,
        maxSlots: 6,
        slots,
        effects: {},
      } as SelectedPower,
    };
  }

  // Try pool powers first (Pool.X.Y)
  if (PowerName.startsWith('Pool.')) {
    const poolMatch = poolLookup.get(PowerName);
    if (poolMatch) {
      const power = buildSelectedPower(
        poolMatch.power,
        poolMatch.poolId,
        appLevel,
        StatInclude,
        SlotEntries,
        warnings,
        summary,
      );
      summary.powersImported++;
      return { category: 'pool', power, poolId: poolMatch.poolId };
    }

    // Fallback: try to find by power name within the pool
    if (segments.length >= 3) {
      const poolId = segments[1].toLowerCase();
      const pool = getPowerPool(poolId);
      if (pool) {
        const powerDef = findPowerByMidsName(pool.powers, segments[2]);
        if (powerDef) {
          const power = buildSelectedPower(powerDef, poolId, appLevel, StatInclude, SlotEntries, warnings, summary);
          summary.powersImported++;
          return { category: 'pool', power, poolId };
        }
      }
    }

    warnings.push({ type: 'pool', midsName: PowerName, message: 'Pool power not found' });
    summary.powersFailed++;
    return null;
  }

  // Try epic powers (Epic.X.Y)
  if (PowerName.startsWith('Epic.')) {
    const epicMatch = epicLookup.get(PowerName);
    if (epicMatch) {
      const power = buildSelectedPower(
        epicMatch.power,
        epicMatch.epicPoolId,
        appLevel,
        StatInclude,
        SlotEntries,
        warnings,
        summary,
      );
      summary.powersImported++;
      return { category: 'epic', power };
    }

    // Fallback: search epic pool by power name if the fullName lookup failed
    if (segments.length >= 3) {
      const epicPoolId = resolveEpicPoolId(`Epic.${segments[1]}`, archetypeId);
      if (epicPoolId) {
        const epicPool = getEpicPool(epicPoolId);
        if (epicPool) {
          const powerDef = findPowerByMidsName(epicPool.powers, segments[2]);
          if (powerDef) {
            const power = buildSelectedPower(powerDef, epicPoolId, appLevel, StatInclude, SlotEntries, warnings, summary);
            summary.powersImported++;
            return { category: 'epic', power };
          }
        }
      }
    }

    warnings.push({ type: 'epic', midsName: PowerName, message: 'Epic power not found' });
    summary.powersFailed++;
    return null;
  }

  // Regular power: determine if primary or secondary
  if (segments.length < 3) {
    warnings.push({ type: 'power', midsName: PowerName, message: 'Unrecognized power format' });
    summary.powersFailed++;
    return null;
  }

  const powerInternalName = segments[2];

  // Try primary
  if (primaryId) {
    const match = findPowerByMidsName(primaryPowers, powerInternalName);
    if (match) {
      const power = buildSelectedPower(match, primaryId, appLevel, StatInclude, SlotEntries, warnings, summary);
      summary.powersImported++;
      return { category: 'primary', power };
    }
  }

  // Try secondary
  if (secondaryId) {
    const match = findPowerByMidsName(secondaryPowers, powerInternalName);
    if (match) {
      const power = buildSelectedPower(match, secondaryId, appLevel, StatInclude, SlotEntries, warnings, summary);
      summary.powersImported++;
      return { category: 'secondary', power };
    }
  }

  // Fallback 1: resolve the powerset directly from the power's path
  // Handles cross-archetype prefixes (e.g., "Tanker_Defense.Dark_Armor" for a Brute)
  const fallbackPowersetId = resolvePowerset(PowerName, archetypeId, powersetLookup);
  if (fallbackPowersetId) {
    const fallbackPowerset = getPowerset(fallbackPowersetId);
    if (fallbackPowerset) {
      const match = findPowerByMidsName(fallbackPowerset.powers, powerInternalName);
      if (match) {
        const category = fallbackPowerset.category === 'primary' ? 'primary' : 'secondary';
        const power = buildSelectedPower(match, fallbackPowersetId, appLevel, StatInclude, SlotEntries, warnings, summary);
        summary.powersImported++;
        return { category: category as 'primary' | 'secondary', power };
      }
    }
  }

  // Fallback 2: brute-force search all powersets for this archetype
  const allPowersets = getAllPowersets();
  for (const [psId, ps] of Object.entries(allPowersets)) {
    if (ps.archetype?.toLowerCase() !== archetypeId.toLowerCase()) continue;
    const match = findPowerByMidsName(ps.powers, powerInternalName);
    if (match) {
      const category = ps.category === 'primary' ? 'primary' : 'secondary';
      const power = buildSelectedPower(match, psId, appLevel, StatInclude, SlotEntries, warnings, summary);
      summary.powersImported++;
      return { category: category as 'primary' | 'secondary', power };
    }
  }

  warnings.push({ type: 'power', midsName: PowerName, message: `Power not found in any ${archetypeId} powerset` });
  summary.powersFailed++;
  return null;
}

// ============================================
// SELECTED POWER CONSTRUCTION
// ============================================

function buildSelectedPower(
  powerDef: Power,
  powerSetId: string,
  level: number,
  isActive: boolean,
  slotEntries: MbdPowerEntry['SlotEntries'],
  warnings: MidsImportWarning[],
  summary: MidsImportSummary,
): SelectedPower {
  // Build enhancement slots
  const slots: (Enhancement | null)[] = [];

  for (const slotEntry of slotEntries) {
    summary.slotsImported++;

    if (!slotEntry.Enhancement) {
      slots.push(null);
      continue;
    }

    const { enhancement, warning } = mapEnhancementUid(
      slotEntry.Enhancement.Uid,
      slotEntry.Enhancement.IoLevel,
      slotEntry.Enhancement.RelativeLevel,
    );

    if (warning) {
      warnings.push(warning);
      summary.enhancementsFailed++;
    }

    if (enhancement) {
      summary.enhancementsImported++;
    }

    slots.push(enhancement);
  }

  // Ensure at least one slot (the free first slot)
  if (slots.length === 0) {
    slots.push(null);
  }

  return {
    ...powerDef,
    powerSet: powerSetId,
    level,
    slots,
    isActive,
  };
}

// ============================================
// INHERENT POWERS
// ============================================

function createInherentSelectedPower(def: InherentPowerDef): SelectedPower {
  const slots: (Enhancement | null)[] = def.maxSlots === 0 ? [] : [null];

  return {
    name: def.name,
    fullName: def.fullName,
    description: def.description,
    icon: def.icon,
    powerType: def.powerType,
    powerSet: 'Inherent',
    level: 1,
    available: -1,
    maxSlots: def.maxSlots,
    allowedEnhancements: def.allowedEnhancements as SelectedPower['allowedEnhancements'],
    allowedSetCategories: def.allowedSetCategories as SelectedPower['allowedSetCategories'],
    slots,
    effects: {},
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

// ============================================
// SET TRACKING
// ============================================

function computeSetTracking(build: Build): Record<string, SetTracking> {
  const sets: Record<string, SetTracking> = {};

  const processSlots = (slots: (Enhancement | null)[]) => {
    for (const enh of slots) {
      if (enh && enh.type === 'io-set') {
        const setId = (enh as any).setId as string;
        const pieceNum = (enh as any).pieceNum as number;
        if (!sets[setId]) {
          sets[setId] = { count: 0, pieces: new Set<number>() };
        }
        if (!sets[setId].pieces.has(pieceNum)) {
          sets[setId].count++;
          sets[setId].pieces.add(pieceNum);
        }
      }
    }
  };

  build.primary.powers.forEach((p) => processSlots(p.slots));
  build.secondary.powers.forEach((p) => processSlots(p.slots));
  build.pools.forEach((pool) => pool.powers.forEach((p) => processSlots(p.slots)));
  if (build.epicPool) {
    build.epicPool.powers.forEach((p) => processSlots(p.slots));
  }
  build.inherents.forEach((p) => processSlots(p.slots));

  return sets;
}
