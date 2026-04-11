/**
 * MXD Build Importer
 *
 * Converts parsed MXD data into a MidsImportResult compatible with
 * the existing import flow (same shape as .mbd imports).
 */

import type { MxdParsedBuild, MxdParsedEnhancement } from './parser';
import type { MidsImportResult, MidsImportWarning } from '../mids-import/types';
import type { Build } from '@/types/build';
import type { Enhancement } from '@/types/enhancement';
import { createEmptyBuild } from '@/types/build';
import { getArchetype } from '@/data/archetypes';
import { getPowerset } from '@/data/powersets';
import { getIOSet } from '@/data/io-sets';
import { getIncarnateSlot, getIncarnateTree } from '@/data/incarnates';
import { SET_ABBREVIATIONS, GENERIC_ABBREVIATIONS, CLASS_TO_ARCHETYPE } from './abbreviations';
import type { ArchetypeId } from '@/types/archetype';
import type { Power } from '@/types/power';
import type { SelectedPower, SelectedIncarnatePower } from '@/types';
import { INCARNATE_SLOT_ORDER } from '@/types';

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

export function importMxdBuild(parsed: MxdParsedBuild): MidsImportResult {
  const warnings: MidsImportWarning[] = [];
  const build = createEmptyBuild();
  let powersImported = 0;
  let powersFailed = 0;
  let enhancementsImported = 0;
  let enhancementsFailed = 0;
  let slotsImported = 0;

  // --- Archetype ---
  const archetypeId = CLASS_TO_ARCHETYPE[parsed.className] as ArchetypeId | undefined;
  if (!archetypeId) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'archetype', midsName: parsed.className, message: `Unknown archetype: ${parsed.className}` }],
      summary: { powersImported: 0, powersFailed: 0, enhancementsImported: 0, enhancementsFailed: 0, slotsImported: 0 },
    };
  }

  const archetype = getArchetype(archetypeId);
  if (!archetype) {
    return {
      success: false,
      build: null,
      warnings: [{ type: 'archetype', midsName: archetypeId, message: `Archetype data not found: ${archetypeId}` }],
      summary: { powersImported: 0, powersFailed: 0, enhancementsImported: 0, enhancementsFailed: 0, slotsImported: 0 },
    };
  }

  build.archetype = { id: archetypeId, name: archetype.name, stats: archetype.stats, inherent: archetype.inherent };
  build.name = parsed.buildName || 'MXD Import';
  build.level = parsed.level;

  // --- Powersets ---
  const primaryId = findPowersetByDisplayName(parsed.primarySet, archetype.primarySets, archetype);
  const secondaryId = findPowersetByDisplayName(parsed.secondarySet, archetype.secondarySets, archetype);

  if (primaryId) {
    const ps = getPowerset(primaryId);
    if (ps) build.primary = { id: primaryId, name: ps.name, powers: [] };
  } else {
    warnings.push({ type: 'powerset', midsName: parsed.primarySet, message: `Could not find primary: ${parsed.primarySet}` });
  }

  if (secondaryId) {
    const ps = getPowerset(secondaryId);
    if (ps) build.secondary = { id: secondaryId, name: ps.name, powers: [] };
  } else {
    warnings.push({ type: 'powerset', midsName: parsed.secondarySet, message: `Could not find secondary: ${parsed.secondarySet}` });
  }

  // --- Pool powers ---
  for (const poolName of parsed.pools) {
    const poolId = findPoolByDisplayName(poolName);
    if (poolId) {
      build.pools.push({ id: poolId, name: poolName, powers: [] });
    } else {
      warnings.push({ type: 'powerset', midsName: poolName, message: `Could not find pool: ${poolName}` });
    }
  }

  // --- Epic pool ---
  if (parsed.epicPool) {
    const epicId = findEpicByDisplayName(parsed.epicPool, archetypeId);
    if (epicId) {
      const ps = getPowerset(epicId);
      build.epicPool = { id: epicId, name: ps?.name ?? parsed.epicPool, powers: [] };
    } else {
      warnings.push({ type: 'powerset', midsName: parsed.epicPool, message: `Could not find epic pool: ${parsed.epicPool}` });
    }
  }

  // --- Powers ---
  const mainPowers = parsed.powers.filter(p => !p.isInherent && p.level > 0);
  const inherentPowers = parsed.powers.filter(p => p.isInherent);

  for (const mxdPower of mainPowers) {
    const { power, category } = findPowerInBuild(mxdPower.name, build);
    if (!power || !category) {
      powersFailed++;
      warnings.push({ type: 'power', midsName: mxdPower.name, message: `Power not found: ${mxdPower.name}` });
      continue;
    }

    const slots: (Enhancement | null)[] = [];
    for (const enh of mxdPower.enhancements) {
      const resolved = resolveEnhancement(enh, warnings);
      slots.push(resolved);
      slotsImported++;
      if (resolved) enhancementsImported++;
      else if (!enh.isEmpty) enhancementsFailed++;
    }

    // Determine powerSet ID for this power
    let powerSetId = '';
    if (category === 'primary') powerSetId = build.primary.id || '';
    else if (category === 'secondary') powerSetId = build.secondary.id || '';
    else if (category === 'epic') powerSetId = build.epicPool?.id ?? '';
    else {
      const pool = build.pools.find(p => {
        const ps = getPowerset(p.id);
        return ps?.powers.some((pw: Power) => pw.internalName === power.internalName);
      });
      powerSetId = pool?.id ?? '';
    }

    const selectedPower: SelectedPower = {
      ...power,
      level: mxdPower.level,
      slots: slots.length > 0 ? slots : [null],
      powerSet: powerSetId,
    };

    switch (category) {
      case 'primary': build.primary.powers.push(selectedPower); break;
      case 'secondary': build.secondary.powers.push(selectedPower); break;
      case 'pool': {
        const pool = build.pools.find(p => {
          const ps = getPowerset(p.id);
          return ps?.powers.some((pw: Power) => pw.internalName === power.internalName);
        });
        if (pool) pool.powers.push(selectedPower);
        break;
      }
      case 'epic':
        if (build.epicPool) build.epicPool.powers.push(selectedPower);
        break;
    }
    powersImported++;
  }

  // --- Inherent powers (Health, Stamina) ---
  for (const mxdPower of inherentPowers) {
    if (mxdPower.name === 'Health' || mxdPower.name === 'Stamina') {
      const slots: (Enhancement | null)[] = [];
      for (const enh of mxdPower.enhancements) {
        const resolved = resolveEnhancement(enh, warnings);
        slots.push(resolved);
        slotsImported++;
        if (resolved) enhancementsImported++;
      }
      if (slots.some(s => s !== null)) {
        build.inherents.push({
          name: mxdPower.name,
          internalName: mxdPower.name,
          level: 1,
          slots,
        } as SelectedPower);
      }
    }
  }

  // --- Incarnate powers ---
  for (const mxdInc of parsed.incarnates) {
    const result = resolveIncarnateByDisplayName(mxdInc.name, warnings);
    if (result) {
      build.incarnates[result.slotId] = result;
      powersImported++;
    } else {
      powersFailed++;
    }
  }

  // Detect VEAT branch
  let detectedBranch: string | undefined;
  if (archetype.branches) {
    for (const [branchId, branch] of Object.entries(archetype.branches)) {
      if (!branch.primarySet) continue;
      const branchPrimary = getPowerset(branch.primarySet);
      if (branchPrimary?.name === parsed.primarySet) {
        detectedBranch = branchId;
        break;
      }
    }
  }

  return {
    success: true,
    build,
    warnings,
    summary: { powersImported, powersFailed, enhancementsImported, enhancementsFailed, slotsImported },
    detectedBranch,
  };
}

// ============================================
// HELPERS
// ============================================

function findPowersetByDisplayName(
  displayName: string,
  setIds: string[],
  archetype: NonNullable<ReturnType<typeof getArchetype>>,
): string | null {
  for (const id of setIds) {
    const ps = getPowerset(id);
    if (ps && ps.name === displayName) return id;
  }

  if (archetype.branches) {
    for (const branch of Object.values(archetype.branches)) {
      for (const setId of [branch.primarySet, branch.secondarySet].filter(Boolean)) {
        const ps = getPowerset(setId!);
        if (ps?.name === displayName) return setId!;
      }
    }
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const target = normalize(displayName);
  for (const id of setIds) {
    const ps = getPowerset(id);
    if (ps && normalize(ps.name) === target) return id;
  }

  return null;
}

function findPoolByDisplayName(displayName: string): string | null {
  const poolNames: Record<string, string> = {
    'Leaping': 'leaping', 'Speed': 'speed', 'Fighting': 'fighting',
    'Flight': 'flight', 'Leadership': 'leadership', 'Teleportation': 'teleportation',
    'Concealment': 'invisibility', 'Medicine': 'medicine', 'Presence': 'presence',
    'Force of Will': 'force_of_will', 'Sorcery': 'sorcery',
    'Experimentation': 'experimentation',
  };
  return poolNames[displayName] || null;
}

function findEpicByDisplayName(_displayName: string, _archetypeId: string): string | null {
  // TODO: Build a comprehensive epic pool display name mapping
  return null;
}

type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic';

function findPowerInBuild(
  displayName: string,
  build: Build,
): { power: Power | null; category: PowerCategory | null } {
  const normalizeAll = (s: string) => s.toLowerCase().replace(/[-_\s]/g, '');

  const searchPowers = (powers: Power[], category: PowerCategory): { power: Power; category: PowerCategory } | null => {
    // Exact match
    const exact = powers.find(p => p.name === displayName);
    if (exact) return { power: exact, category };
    // Normalized match (handles hyphens vs spaces vs underscores)
    const normalized = normalizeAll(displayName);
    const fuzzy = powers.find(p => normalizeAll(p.name) === normalized);
    if (fuzzy) return { power: fuzzy, category };
    return null;
  };

  const primaryPs = build.primary?.id ? getPowerset(build.primary.id) : null;
  if (primaryPs) {
    const found = searchPowers(primaryPs.powers, 'primary');
    if (found) return found;
  }

  const secondaryPs = build.secondary?.id ? getPowerset(build.secondary.id) : null;
  if (secondaryPs) {
    const found = searchPowers(secondaryPs.powers, 'secondary');
    if (found) return found;
  }

  for (const pool of build.pools) {
    const poolPs = getPowerset(pool.id);
    if (poolPs) {
      const found = searchPowers(poolPs.powers, 'pool');
      if (found) return found;
    }
  }

  if (build.epicPool) {
    const epicPs = getPowerset(build.epicPool.id);
    if (epicPs) {
      const found = searchPowers(epicPs.powers, 'epic');
      if (found) return found;
    }
  }

  return { power: null, category: null };
}

/**
 * Resolve an incarnate power by its MXD display name (e.g., "Melee Core Embodiment").
 * Searches all slots and trees for a matching displayName.
 */
function resolveIncarnateByDisplayName(
  displayName: string,
  warnings: MidsImportWarning[],
): SelectedIncarnatePower | null {
  const lowerName = displayName.toLowerCase();

  for (const slotId of INCARNATE_SLOT_ORDER) {
    const slot = getIncarnateSlot(slotId);
    if (!slot) continue;

    for (const tree of slot.trees) {
      const power = tree.powers.find(p => p.displayName.toLowerCase() === lowerName);
      if (power) {
        const treeInfo = getIncarnateTree(slotId, power.treeId);
        return {
          slotId,
          powerId: power.id,
          powerName: power.id,
          displayName: power.displayName,
          icon: power.icon,
          tier: power.tier,
          treeId: power.treeId,
          treeName: treeInfo?.name || power.treeId,
        };
      }
    }
  }

  warnings.push({ type: 'power', midsName: displayName, message: `Incarnate power not found: ${displayName}` });
  return null;
}

function resolveEnhancement(
  enh: MxdParsedEnhancement,
  warnings: MidsImportWarning[],
): Enhancement | null {
  if (enh.isEmpty) return null;

  if (enh.isGeneric) {
    const stat = GENERIC_ABBREVIATIONS[enh.setAbbrev];
    if (stat) {
      return { type: 'io-generic', stat, level: 50 } as Enhancement;
    }
    warnings.push({ type: 'enhancement', midsName: `${enh.setAbbrev}-I`, message: `Unknown generic IO: ${enh.setAbbrev}` });
    return null;
  }

  if (enh.isHamidon) {
    warnings.push({ type: 'enhancement', midsName: `HO:${enh.pieceAbbrev}`, message: `Hamidon Origin import not yet supported` });
    return null;
  }

  const setId = SET_ABBREVIATIONS[enh.setAbbrev];
  if (!setId) {
    warnings.push({ type: 'enhancement', midsName: `${enh.setAbbrev}-${enh.pieceAbbrev}`, message: `Unknown IO set: ${enh.setAbbrev}` });
    return null;
  }

  const ioSet = getIOSet(setId);
  if (!ioSet) {
    warnings.push({ type: 'enhancement', midsName: `${enh.setAbbrev} (${setId})`, message: `IO set not found: ${setId}` });
    return null;
  }

  const pieceNum = matchPieceByAbbrev(ioSet, enh.pieceAbbrev);

  return {
    type: 'io-set',
    setId,
    pieceNum: pieceNum || 1,
    attuned: true,
  } as Enhancement;
}

function matchPieceByAbbrev(
  ioSet: NonNullable<ReturnType<typeof getIOSet>>,
  abbrev: string,
): number | null {
  const isProcLike = abbrev.includes('%') || abbrev.startsWith('+') ||
    abbrev.includes('Proc') || abbrev.includes('Global');

  if (isProcLike) {
    for (let i = ioSet.pieces.length - 1; i >= 0; i--) {
      if (ioSet.pieces[i].proc || ioSet.pieces[i].unique) return ioSet.pieces[i].num;
    }
    return ioSet.pieces[ioSet.pieces.length - 1]?.num ?? null;
  }

  const abbrevStats = abbrev.split('/').map(a => {
    const mapped = ASPECT_MAP[a.trim()];
    return mapped || a.trim().toLowerCase();
  });

  let bestMatch: { num: number; score: number } | null = null;

  for (const piece of ioSet.pieces) {
    if (piece.proc || piece.unique) continue;
    const pieceStats = piece.aspects.map((a: string) => a.toLowerCase());

    let matches = 0;
    for (const stat of abbrevStats) {
      if (pieceStats.some((ps: string) => ps.includes(stat) || stat.includes(ps))) {
        matches++;
      }
    }

    if (matches === abbrevStats.length && matches === pieceStats.length) {
      return piece.num;
    }

    const score = matches / Math.max(abbrevStats.length, pieceStats.length);
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { num: piece.num, score };
    }
  }

  if (bestMatch && bestMatch.score > 0.5) return bestMatch.num;
  return null;
}

const ASPECT_MAP: Record<string, string> = {
  'Acc': 'accuracy', 'Dmg': 'damage', 'Dam': 'damage',
  'EndRdx': 'endurancereduction', 'Rchg': 'recharge', 'Def': 'defense',
  'Rng': 'range', 'Heal': 'healing', 'ResDam': 'resistance',
  'EndMod': 'endurancemodification', 'ToHit': 'tohit',
  'Immob': 'immobilize', 'Hold': 'hold', 'Slow': 'slow',
  'Fear': 'fear', 'Cnf': 'confuse', 'KB': 'knockback',
  'Knock': 'knockback', 'Stun': 'stun', 'Dsrnt': 'stun',
  'Intrdct': 'interrupt', 'Taunt': 'taunt', 'Sleep': 'sleep',
  'Run': 'runspeed', 'Jump': 'jumpheight', 'Fly': 'flyspeed',
  'Rcvry': 'recovery', 'Regen': 'regeneration',
};
