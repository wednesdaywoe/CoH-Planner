/**
 * Mids Reborn .mbd import orchestrator
 *
 * Parses .mbd JSON, maps all powers/enhancements to app format,
 * and constructs a complete Build object.
 */

import type {
  Build,
  SelectedPower,
  SelectedIncarnatePower,
  IncarnateSlotId,
  Power,
  Enhancement,
  PoolSelection,
  SetTracking,
} from '@/types';
import { createEmptyIncarnateBuildState, INCARNATE_SLOT_ORDER } from '@/types';
import {
  getArchetype,
  getAllPowersets,
  getPowerset,
  getPowerPool,
  getEpicPool,
  getInherentPowers,
  createArchetypeInherentPower,
  getIncarnatePower,
  getIncarnateTree,
  GRANTED_POWER_GROUPS,
} from '@/data';
import { getActiveDataset, type DatasetId } from '@/data/dataset';
import type { InherentPowerDef } from '@/data';

// ============================================
// SERVER DETECTION
// ============================================
//
// Mids Reborn carries the source database in `BuiltWith.Database`. Two
// known values today:
//   - "Homecoming"
//   - "Rebirth"
// Anything else falls back to the active dataset (best effort) with a
// general warning.
//
// Imports are blocked when the .mbd's database doesn't match the active
// dataset because all powerset/power lookups read from the active
// dataset's registry — a Rebirth build dropped into an HC session would
// fail to find Guardian (or any other Rebirth-only powerset) and
// produce a corrupt build. Caller should switch servers via the picker
// (which reloads with the new dataset) before retrying the import.

const MBD_DATABASE_TO_SERVER: Record<string, DatasetId> = {
  'Homecoming': 'homecoming',
  'Rebirth':    'rebirth',
};

function detectServerFromMbd(database: string | undefined): DatasetId | null {
  if (!database) return null;
  return MBD_DATABASE_TO_SERVER[database] ?? null;
}

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
  mapEnhancementByDisplayName,
  MIDS_SILENT_SKIP_PATHS,
} from './mappers';

/**
 * Resolve a single Mids slot-entry enhancement to an app Enhancement.
 * Handles both the current Uid-based format and the legacy
 * display-name format used by older Mids versions.
 */
function resolveSlotEnhancement(enh: {
  Uid?: string;
  Enhancement?: string;
  IoLevel: number;
  RelativeLevel: string;
  Grade?: string;
}): ReturnType<typeof mapEnhancementUid> {
  if (enh.Uid && enh.Uid.length > 0) {
    return mapEnhancementUid(enh.Uid, enh.IoLevel, enh.RelativeLevel, enh.Grade);
  }
  // Legacy 2023-era Mids: display-name string in `Enhancement` field.
  if (typeof enh.Enhancement === 'string' && enh.Enhancement.length > 0) {
    return mapEnhancementByDisplayName(enh.Enhancement, enh.IoLevel, enh.RelativeLevel, enh.Grade);
  }
  return { enhancement: null, warning: null };
}
import type { PoolPowerMatch, EpicPowerMatch } from './mappers';
import { warnFallback } from '@/utils/fallback-warnings';

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

  // 2a. Detect source server and require it to match the active dataset.
  // Rebirth builds reference Guardian / Composition / etc. that don't
  // exist in HC's registry (and vice-versa for HC's Sentinel sets), so
  // the importer can't proceed cross-dataset. Caller should switch the
  // server picker first.
  const detectedServer = detectServerFromMbd(mbd.BuiltWith?.Database);
  const activeServer = (() => {
    try { return getActiveDataset().id; } catch { return null; }
  })();
  if (detectedServer && activeServer && detectedServer !== activeServer) {
    const detectedLabel = detectedServer === 'rebirth' ? 'Rebirth' : 'Homecoming';
    const activeLabel = activeServer === 'rebirth' ? 'Rebirth' : 'Homecoming';
    return {
      success: false,
      build: null,
      warnings: [{
        type: 'general',
        midsName: mbd.BuiltWith?.Database ?? '',
        message: `This build was made for ${detectedLabel}, but the planner is currently running ${activeLabel}. Switch servers via the Build Identity picker and retry the import.`,
      }],
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
  // Mids top-level Level is 0-based, power entry levels are 1-based
  const origin = mapOrigin(mbd.Origin);
  const parsedLevel = (parseInt(mbd.Level, 10) || 49) + 1;
  // Also determine level from power entries — Mids Level may reflect the highest
  // power pick (0-based 48 = game level 49) rather than the character's actual level.
  // If any power is at the last pick level (49), the character is level 50.
  let maxPowerEntryLevel = 0;
  for (const entry of mbd.PowerEntries) {
    if (entry.Level > maxPowerEntryLevel) maxPowerEntryLevel = entry.Level;
  }
  const levelFromPowers = maxPowerEntryLevel >= 49 ? 50 : maxPowerEntryLevel;
  const level = Math.min(Math.max(parsedLevel, levelFromPowers, 1), 50);

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

  // 6b. VEAT branch detection: if the resolved primary/secondary is a branch powerset,
  //     normalize to the base powerset. The planner expects build.primary.id / secondary.id
  //     to always be the BASE powerset, with branch powers stored in the powers array.
  let detectedBranch: string | null = null;
  // Track branch powerset powers so we can include them in first-pass lookups
  let branchPrimaryPowers: Power[] = [];
  let branchSecondaryPowers: Power[] = [];
  // Build a set of all VEAT branch powerset IDs mapped to primary/secondary
  const branchPrimarySetIds = new Set<string>();
  const branchSecondarySetIds = new Set<string>();
  if (archetype.branches) {
    for (const branchDef of Object.values(archetype.branches)) {
      if (branchDef.primarySet) branchPrimarySetIds.add(branchDef.primarySet);
      if (branchDef.secondarySet) branchSecondarySetIds.add(branchDef.secondarySet);
    }
    for (const [branchId, branchDef] of Object.entries(archetype.branches)) {
      if (primaryId === branchDef.primarySet || secondaryId === branchDef.secondarySet) {
        detectedBranch = branchId;
        // Save branch powers before replacing with base
        branchPrimaryPowers = (branchDef.primarySet ? getPowerset(branchDef.primarySet)?.powers : undefined) ?? [];
        branchSecondaryPowers = (branchDef.secondarySet ? getPowerset(branchDef.secondarySet)?.powers : undefined) ?? [];
        // Replace with base powersets — keep the resolved IDs for power lookup
        primaryId = archetype.primarySets[0] ?? primaryId;
        secondaryId = archetype.secondarySets[0] ?? secondaryId;
        primaryPowerset = primaryId ? getPowerset(primaryId) : null;
        secondaryPowerset = secondaryId ? getPowerset(secondaryId) : null;
        break;
      }
    }
  }

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

  // Build reverse lookup: sub-power display name → parent power name
  // Only for non-slottable groups (e.g., Adaptation toggles, Swap Ammo)
  const grantedSubPowerParent = new Map<string, string>();
  for (const [parentName, group] of Object.entries(GRANTED_POWER_GROUPS)) {
    if (group.slottable) continue; // Slottable sub-powers (Kheldian forms) are imported normally
    for (const subName of group.grantedPowers) {
      grantedSubPowerParent.set(subName, parentName);
    }
  }
  // Track which sub-power is active (StatInclude: true) per parent
  const activeSubPowers = new Map<string, string>();

  const primaryPowers: SelectedPower[] = [];
  const secondaryPowers: SelectedPower[] = [];
  const poolPowersMap: Record<string, SelectedPower[]> = {};
  const epicPowers: SelectedPower[] = [];
  const inherentSlotData: SelectedPower[] = []; // Slot data from Inherent.* entries
  const incarnateResults: Partial<Record<IncarnateSlotId, SelectedIncarnatePower>> = {};

  for (const poolId of poolIds) {
    poolPowersMap[poolId] = [];
  }

  for (const entry of mbd.PowerEntries) {
    if (!entry.PowerName) continue;

    // Handle incarnate powers separately (Incarnate.Alpha.Musculature_Radial_Paragon)
    if (entry.PowerName.startsWith('Incarnate.')) {
      const incResult = processIncarnateEntry(entry, warnings, summary);
      if (incResult) {
        incarnateResults[incResult.slotId] = incResult;
      }
      continue;
    }

    // Skip non-slottable granted sub-powers (e.g., Defensive/Efficient/Offensive Adaptation)
    // These are auto-displayed under their parent power; importing them as separate entries
    // would cause them to appear as standalone picked powers.
    {
      const segments = entry.PowerName.split('.');
      const internalName = segments[segments.length - 1];
      const parentName = grantedSubPowerParent.get(internalName);
      if (parentName) {
        // Capture which sub-power is active (StatInclude: true)
        if (entry.StatInclude) {
          activeSubPowers.set(parentName, internalName);
        }
        summary.powersImported++;
        continue;
      }
    }

    const result = processEntry(
      entry,
      archetypeId,
      primaryId,
      [...(primaryPowerset?.powers ?? []), ...branchPrimaryPowers],
      secondaryId,
      [...(secondaryPowerset?.powers ?? []), ...branchSecondaryPowers],
      poolLookup,
      epicLookup,
      powersetLookup,
      branchPrimarySetIds,
      branchSecondarySetIds,
      warnings,
      summary,
    );

    if (!result) continue;

    // Deduplicate: skip if a power with the same internalName already exists
    // in the target list. Mids .mbd files can contain duplicate entries for the
    // same power, which would cause the power to appear twice (same slot, same level).
    const powerName = result.power.internalName;

    switch (result.category) {
      case 'primary':
        if (primaryPowers.some(p => p.internalName === powerName)) break;
        primaryPowers.push(result.power);
        break;
      case 'secondary':
        if (secondaryPowers.some(p => p.internalName === powerName)) break;
        secondaryPowers.push(result.power);
        break;
      case 'pool': {
        const poolId = result.poolId!;
        if (!poolPowersMap[poolId]) {
          poolPowersMap[poolId] = [];
          if (!poolIds.includes(poolId)) poolIds.push(poolId);
        }
        if (poolPowersMap[poolId].some(p => p.internalName === powerName)) break;
        poolPowersMap[poolId].push(result.power);
        break;
      }
      case 'epic':
        if (epicPowers.some(p => p.internalName === powerName)) break;
        epicPowers.push(result.power);
        break;
      case 'inherent':
        inherentSlotData.push(result.power);
        break;
    }
  }

  // 8b. Apply activeSubPower to parent powers from granted sub-power tracking
  for (const [parentName, activeSubName] of activeSubPowers) {
    const allPowerLists = [primaryPowers, secondaryPowers];
    for (const powers of allPowerLists) {
      const parent = powers.find(p => p.internalName === parentName);
      if (parent) {
        parent.activeSubPower = activeSubName;
        break;
      }
    }
  }

  // 8c. Auto-detect primary/secondary powerset if initial resolution failed
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
    // Server identifier — detected from `BuiltWith.Database` when present,
    // otherwise falls back to the active dataset. The dataset-mismatch
    // guard above (step 2a) ensures we never import a Rebirth build into
    // an HC session or vice-versa, so this stamps the right id either way.
    serverId: detectedServer ?? activeServer ?? 'homecoming',
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
    incarnates: {
      ...createEmptyIncarnateBuildState(),
      ...incarnateResults,
    },
    craftingChecklist: {},
    shoppingListAcquired: {},
    slotOrder: [],
  };

  // 13. Recompute set tracking
  build.sets = computeSetTracking(build);

  return {
    success: true,
    build,
    warnings,
    summary,
    detectedBranch,
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

/**
 * Determine whether a powerset should be categorized as primary or secondary.
 * VEAT branch powersets have category 'epic' in their definitions, so we check
 * if the powerset ID is a known branch primary/secondary set.
 */
function categorizePowerset(
  powersetId: string,
  rawCategory: string | undefined,
  branchPrimarySetIds: Set<string>,
  branchSecondarySetIds: Set<string>,
): 'primary' | 'secondary' {
  if (branchPrimarySetIds.has(powersetId)) return 'primary';
  if (branchSecondarySetIds.has(powersetId)) return 'secondary';
  return rawCategory === 'primary' ? 'primary' : 'secondary';
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
  branchPrimarySetIds: Set<string>,
  branchSecondarySetIds: Set<string>,
  warnings: MidsImportWarning[],
  summary: MidsImportSummary,
): ProcessedEntry | null {
  // Some Mids exports (Rebirth Guardian builds we've seen) emit power
  // names with trailing whitespace inside segments
  // ("Guardian_Composition.Energy_Composition .Kinetic_Shield"). Normalize
  // the whole name once so every downstream check (skip-prefix tests,
  // segment splits, lookup-map keys) sees a clean form.
  const PowerName = entry.PowerName
    .split('.')
    .map(s => s.trim())
    .join('.');
  const { Level: midsLevel, StatInclude, SlotEntries } = entry;
  const appLevel = midsLevel; // Mids Level is already 1-based

  // Extract segments: "Brute_Melee.Kinetic_Attack.Quick_Strike" → ["Brute_Melee", "Kinetic_Attack", "Quick_Strike"]
  const segments = PowerName.split('.');

  // Skip temporary powers
  if (PowerName.startsWith('Temporary_Powers.')) {
    return null;
  }

  // Silent skip list: Mids-only artifacts or auto-granted passives with no
  // user-selectable counterpart in HC. Drop them without a warning.
  if (MIDS_SILENT_SKIP_PATHS.has(PowerName.toLowerCase())) {
    return null;
  }

  // Mastermind pet shadow entries: older Mids exports duplicate every pet with
  // a `_H` suffix and zero slots. They're auto-granted "henchman" upgrade
  // references, not user picks. Skip them silently.
  if (PowerName.startsWith('Mastermind_Summon.') && PowerName.endsWith('_H')) {
    return null;
  }

  // Process inherent powers for their slot data (powers are auto-populated,
  // but we need to preserve any slotted enhancements from the import)
  if (PowerName.startsWith('Inherent.')) {
    if (segments.length < 3 || !SlotEntries || !SlotEntries.some(s => s.Enhancement)) {
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
      const { enhancement, warning } = resolveSlotEnhancement(slotEntry.Enhancement);
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
      // Determine correct powerset ID — may be a branch powerset, not the base
      let correctSetId = primaryId;
      for (const branchSetId of branchPrimarySetIds) {
        const branchSet = getPowerset(branchSetId);
        if (branchSet?.powers.some(p => p.internalName === match.internalName)) {
          correctSetId = branchSetId;
          break;
        }
      }
      const power = buildSelectedPower(match, correctSetId, appLevel, StatInclude, SlotEntries, warnings, summary);
      summary.powersImported++;
      return { category: 'primary', power };
    }
  }

  // Try secondary
  if (secondaryId) {
    const match = findPowerByMidsName(secondaryPowers, powerInternalName);
    if (match) {
      // Determine correct powerset ID — may be a branch powerset, not the base
      let correctSetId = secondaryId;
      for (const branchSetId of branchSecondarySetIds) {
        const branchSet = getPowerset(branchSetId);
        if (branchSet?.powers.some(p => p.internalName === match.internalName)) {
          correctSetId = branchSetId;
          break;
        }
      }
      const power = buildSelectedPower(match, correctSetId, appLevel, StatInclude, SlotEntries, warnings, summary);
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
        const category = categorizePowerset(fallbackPowersetId, fallbackPowerset.category, branchPrimarySetIds, branchSecondarySetIds);
        warnFallback('mids-import/processEntry', `power '${PowerName}' resolved via powerset path (fallback 1) to '${fallbackPowersetId}' as ${category}`);
        const power = buildSelectedPower(match, fallbackPowersetId, appLevel, StatInclude, SlotEntries, warnings, summary);
        summary.powersImported++;
        return { category, power };
      }
    }
  }

  // Fallback 2: brute-force search all powersets for this archetype
  const allPowersets = getAllPowersets();
  for (const [psId, ps] of Object.entries(allPowersets)) {
    if (ps.archetype?.toLowerCase() !== archetypeId.toLowerCase()) continue;
    const match = findPowerByMidsName(ps.powers, powerInternalName);
    if (match) {
      const category = categorizePowerset(psId, ps.category, branchPrimarySetIds, branchSecondarySetIds);
      warnFallback('mids-import/processEntry', `power '${PowerName}' resolved via brute-force search (fallback 2) — found in '${psId}' as ${category}`);
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
// INCARNATE POWER PROCESSING
// ============================================

function processIncarnateEntry(
  entry: MbdPowerEntry,
  warnings: MidsImportWarning[],
  summary: MidsImportSummary,
): SelectedIncarnatePower | null {
  // Silent skip: Mids-only incarnate artifacts with no HC counterpart.
  if (MIDS_SILENT_SKIP_PATHS.has(entry.PowerName.toLowerCase())) {
    return null;
  }

  // Hybrid `*_Genome_<n>` entries are Mids-only numeric indexes for Hybrid
  // tree tiers (e.g. Support_Genome_8, Melee_Genome_8). HC exposes Hybrid
  // powers under named tiers (Support_Core_Genome, Support_Total_Core_Graft,
  // etc.), not numeric suffixes. Drop the enumerated entries silently — the
  // build's actual selected power lives in its named entry elsewhere.
  if (/^Incarnate\.Hybrid\.[A-Za-z]+_Genome_\d+$/.test(entry.PowerName)) {
    return null;
  }

  const segments = entry.PowerName.split('.');
  if (segments.length < 3) return null;

  const slotName = segments[1].toLowerCase();
  // Validate slot ID
  if (!INCARNATE_SLOT_ORDER.includes(slotName as IncarnateSlotId)) {
    warnings.push({ type: 'power', midsName: entry.PowerName, message: `Unknown incarnate slot: ${slotName}` });
    summary.powersFailed++;
    return null;
  }

  const slotId = slotName as IncarnateSlotId;

  // Look up by fullName (e.g., "Incarnate.Alpha.Musculature_Radial_Paragon")
  const power = getIncarnatePower(slotId, entry.PowerName);
  if (!power) {
    warnings.push({ type: 'power', midsName: entry.PowerName, message: `Incarnate power not found` });
    summary.powersFailed++;
    return null;
  }

  const tree = getIncarnateTree(slotId, power.treeId);
  summary.powersImported++;

  return {
    slotId,
    powerId: power.id,
    powerName: power.id,
    displayName: power.displayName,
    icon: power.icon,
    tier: power.tier,
    treeId: power.treeId,
    treeName: tree?.name || power.treeId,
  };
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

    const { enhancement, warning } = resolveSlotEnhancement(slotEntry.Enhancement);

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

  // Set isActive for Toggle/Auto powers, and also for Click powers with long
  // buff durations (60s+) that provide self-buff effects (e.g., Hasten 120s,
  // Practiced Brawler 120s). Short clicks like Build Up (10s) are left unset.
  const powerType = powerDef.powerType?.toLowerCase();
  const buffDuration = (powerDef.effects as Record<string, unknown> | undefined)?.buffDuration;
  const isLongSelfBuff = powerType === 'click'
    && typeof buffDuration === 'number' && buffDuration >= 60
    && (powerDef.targetType?.toLowerCase() === 'self'
      || (powerDef.shortHelp?.toLowerCase().startsWith('self ') ?? false));
  const effectiveIsActive = (powerType === 'toggle' || powerType === 'auto' || isLongSelfBuff)
    ? isActive
    : undefined;

  return {
    ...powerDef,
    powerSet: powerSetId,
    level,
    slots,
    isActive: effectiveIsActive,
  };
}

// ============================================
// INHERENT POWERS
// ============================================

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
