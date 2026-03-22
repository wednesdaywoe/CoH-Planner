/**
 * External tool build import converter
 *
 * Converts JSON from an external CoH tool into our internal Build format.
 * The external format contains up to 3 interleaved builds; this module
 * splits them and converts the selected build via the shared game-import pipeline.
 */

import type { Build, Accolade, IncarnateSlotId, SelectedIncarnatePower } from '@/types';
import { createEmptyIncarnateBuildState } from '@/types';
import { importFromParsedData } from '@/utils/game-import';
import type {
  GameExportData,
  GameExportHeader,
  GameExportPower,
  GameExportEnhancement,
  GameImportWarning,
  GameImportSummary,
} from '@/utils/game-import';
import { getAccolades, getIncarnatePower, getIncarnateSlot } from '@/data';

// ============================================
// EXTERNAL JSON TYPES
// ============================================

interface ExternalCharacter {
  name: string;
  archetype: string;  // e.g., "class_scrapper"
  origin: string;     // e.g., "magic"
  level: number;
}

interface ExternalBoost {
  idx: number | null;  // null = unassigned/preview slot
  categoryName: string;
  powerSetName: string;
  boostName: string;
  level: number;       // 0 = attuned
}

interface ExternalPower {
  categoryName: string;
  powerSetName: string;
  powerName: string;
  powerLevelBought: number;
  powerNumBoostsBought: number;
  boosts: ExternalBoost[];
}

interface ExternalJSON {
  ok: boolean;
  build: {
    character: ExternalCharacter;
    powers: ExternalPower[];
  };
}

// ============================================
// RESULT TYPES
// ============================================

export interface BuildSegmentInfo {
  index: number;
  powerCount: number;
  enhancementCount: number;
  primarySet: string;
  secondarySet: string;
}

export interface ExternalImportResult {
  success: boolean;
  build: Build | null;
  warnings: GameImportWarning[];
  summary: GameImportSummary;
  /** Info about all detected builds for user selection */
  availableBuilds: BuildSegmentInfo[];
  /** Which build was selected (index into availableBuilds) */
  selectedBuild: number;
}

// ============================================
// TITLE-CASE NORMALIZATION
// ============================================

/**
 * Title-case each underscore-delimited segment.
 * "crafted_crushing_impact_b" → "Crafted_Crushing_Impact_B"
 */
function titleCase(s: string): string {
  return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
}

// Accolade IDs now match external tool powerNames directly — no mapping needed

// ============================================
// INCARNATE TIER ORDERING (for picking highest tier)
// ============================================

const TIER_RANK: Record<string, number> = {
  'common': 1,
  'uncommon': 2,
  'rare': 3,
  'veryrare': 4,
};

// ============================================
// HYBRID INCARNATE NAME RESOLUTION
// ============================================

/**
 * The Hybrid slot uses numbered internal names (melee_genome_2) in game data,
 * but our incarnate index uses descriptive names (melee_core_genome).
 * This only affects Melee and Support categories; Assault and Control already
 * use descriptive file names.
 */
const HYBRID_NUM_TO_SUFFIX: Record<number, string> = {
  1: '_genome',               // common
  2: '_core_genome',          // uncommon
  3: '_radial_genome',        // uncommon
  4: '_total_core_graft',     // rare
  5: '_partial_core_graft',   // rare
  6: '_partial_radial_graft', // rare
  7: '_total_radial_graft',   // rare
  8: '_core_embodiment',      // veryrare
  9: '_radial_embodiment',    // veryrare
};

function resolveHybridPowerName(powerName: string): string {
  const match = powerName.match(/^(\w+?)_genome_(\d)$/);
  if (!match) return powerName;

  const category = match[1];
  const num = parseInt(match[2]);
  const suffix = HYBRID_NUM_TO_SUFFIX[num];
  return suffix ? category + suffix : powerName;
}

// ============================================
// BUILD SPLITTING
// ============================================

interface BuildSegment {
  inherents: ExternalPower[];
  combatPowers: ExternalPower[];
}

/**
 * Separate inherent powers from combat powers into a single build segment.
 * HC sends a single pre-selected build — no multi-build splitting needed.
 */
function splitBuilds(powers: ExternalPower[]): BuildSegment[] {
  const inherentPowers: ExternalPower[] = [];
  const combatPowers: ExternalPower[] = [];

  for (const p of powers) {
    if (p.categoryName === 'inherent') {
      inherentPowers.push(p);
    } else {
      combatPowers.push(p);
    }
  }

  return [{ inherents: inherentPowers, combatPowers }];
}

/**
 * Score a build segment by counting slotted enhancements (non-null idx boosts).
 */
function scoreBuildSegment(segment: BuildSegment): { powerCount: number; enhancementCount: number } {
  let powerCount = 0;
  let enhancementCount = 0;

  for (const p of segment.combatPowers) {
    powerCount++;
    for (const b of p.boosts) {
      if (b.idx !== null) enhancementCount++;
    }
  }

  // Also count inherent enhancements (fitness slots, etc.)
  for (const p of segment.inherents) {
    for (const b of p.boosts) {
      if (b.idx !== null) enhancementCount++;
    }
  }

  return { powerCount, enhancementCount };
}

/**
 * Get a summary of the primary/secondary sets from a build segment.
 */
function getSegmentSetNames(segment: BuildSegment): { primary: string; secondary: string } {
  let primary = '';
  let secondary = '';

  for (const p of segment.combatPowers) {
    const cat = p.categoryName;
    // Primary categories contain _melee, _ranged, _control, _summon, _offensive
    if (!primary && (cat.includes('_melee') || cat.includes('_ranged') || cat.includes('_control') ||
        cat.includes('_summon') || cat.includes('_offensive'))) {
      primary = p.powerSetName;
    }
    // Secondary categories contain _defense, _buff, _support, _assault, _defensive
    if (!secondary && (cat.includes('_defense') || cat.includes('_buff') || cat.includes('_support') ||
        cat.includes('_assault') || cat.includes('_defensive'))) {
      secondary = p.powerSetName;
    }
    if (primary && secondary) break;
  }

  return { primary, secondary };
}

// ============================================
// CONVERSION TO GAME EXPORT FORMAT
// ============================================

/**
 * Convert an ExternalBoost to a GameExportEnhancement.
 */
function convertBoost(boost: ExternalBoost): GameExportEnhancement {
  const uid = titleCase(boost.powerSetName);
  const attuned = boost.level === 0;

  return {
    uid,
    level: attuned ? undefined : boost.level,
    boost: undefined,
    attuned,
  };
}

/**
 * Convert an ExternalPower to a GameExportPower.
 */
function convertPower(power: ExternalPower): GameExportPower {
  // Normalize category
  let category: string;
  const cat = power.categoryName;
  if (cat === 'pool') {
    category = 'Pool';
  } else if (cat === 'epic') {
    category = 'Epic';
  } else if (cat === 'inherent' || cat === 'fitness') {
    category = 'Inherent';
  } else {
    // Primary/secondary: "scrapper_melee" → "Scrapper_Melee"
    category = titleCase(cat);
  }

  // Convert enhancements using idx-based slot positioning.
  // External format: idx 1-5 = bought slots, idx null = free/default slot (position 0).
  const totalSlots = 1 + power.powerNumBoostsBought;
  const enhancements: (GameExportEnhancement | null)[] = new Array(totalSlots).fill(null);
  for (const boost of power.boosts) {
    if (boost.idx === null) {
      // Free/default slot at position 0
      enhancements[0] = convertBoost(boost);
    } else if (boost.idx >= 1 && boost.idx <= power.powerNumBoostsBought) {
      enhancements[boost.idx] = convertBoost(boost);
    }
  }

  return {
    level: power.powerLevelBought,
    category,
    powerset: titleCase(power.powerSetName),
    powerName: titleCase(power.powerName),
    enhancements,
  };
}

/**
 * Convert a build segment + character info into GameExportData.
 */
function convertToGameExportData(
  character: ExternalCharacter,
  segment: BuildSegment,
): GameExportData {
  const header: GameExportHeader = {
    characterName: character.name,
    level: character.level,
    origin: titleCase(character.origin),
    archetype: titleCase(character.archetype),
  };

  const powers: GameExportPower[] = [];

  // Add inherent powers (with slot data)
  for (const inh of segment.inherents) {
    powers.push(convertPower(inh));
  }

  // Add combat powers
  for (const cp of segment.combatPowers) {
    powers.push(convertPower(cp));
  }

  return { header, powers };
}

// ============================================
// INCARNATE AUGMENTATION
// ============================================

function augmentIncarnates(
  build: Build,
  incarnatePowers: ExternalPower[],
  warnings: GameImportWarning[],
): void {
  // Group by slot, tracking the best (highest tier) power per slot
  const slotBest = new Map<IncarnateSlotId, { power: SelectedIncarnatePower; rank: number }>();

  for (const ext of incarnatePowers) {
    const slotId = ext.powerSetName as IncarnateSlotId;
    const slot = getIncarnateSlot(slotId);
    if (!slot) {
      warnings.push({ type: 'general', name: ext.powerName, message: `Unknown incarnate slot: ${slotId}` });
      continue;
    }

    // Resolve numbered hybrid names (melee_genome_2 → melee_core_genome)
    const resolvedName = slotId === 'hybrid'
      ? resolveHybridPowerName(ext.powerName)
      : ext.powerName;

    const power = getIncarnatePower(slotId, resolvedName);
    if (!power) {
      warnings.push({ type: 'general', name: ext.powerName, message: `Incarnate power not found: ${ext.powerName} in ${slotId}` });
      continue;
    }

    // Resolve tree name from parent tree
    const tree = slot.trees.find(t => t.id === power.treeId);

    const selected: SelectedIncarnatePower = {
      slotId,
      powerId: power.id,
      powerName: power.fullName,
      displayName: power.displayName,
      icon: power.icon,
      tier: power.tier,
      treeId: power.treeId,
      treeName: tree?.name || power.treeId,
    };

    const rank = TIER_RANK[power.tier] || 0;
    const existing = slotBest.get(slotId);
    if (!existing || rank > existing.rank) {
      slotBest.set(slotId, { power: selected, rank });
    }
  }

  // Apply to build
  const incarnates = createEmptyIncarnateBuildState();
  for (const [slotId, { power }] of slotBest) {
    incarnates[slotId] = power;
  }
  build.incarnates = incarnates;
}

// ============================================
// ACCOLADE AUGMENTATION
// ============================================

function augmentAccolades(
  build: Build,
  accoladePowers: ExternalPower[],
): void {
  const allAccolades = getAccolades();
  const matched: Accolade[] = [];

  for (const ext of accoladePowers) {
    const accolade = allAccolades.find(a => a.id === ext.powerName);
    if (accolade && !matched.some(m => m.id === accolade.id)) {
      matched.push(accolade);
    }
  }

  build.accolades = matched;
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

/**
 * Import a build from external tool JSON.
 * @param json - Raw JSON string from the external tool
 * @param buildIndex - Which build to import (0-based). If not specified, auto-selects the best.
 */
export function importExternalBuild(json: string, buildIndex?: number): ExternalImportResult {
  const emptyResult = (message: string): ExternalImportResult => ({
    success: false,
    build: null,
    warnings: [{ type: 'general', name: '', message }],
    summary: { powersImported: 0, powersFailed: 0, enhancementsImported: 0, enhancementsFailed: 0, slotsImported: 0 },
    availableBuilds: [],
    selectedBuild: 0,
  });

  // 1. Parse JSON
  let data: ExternalJSON;
  try {
    data = JSON.parse(json);
  } catch {
    return emptyResult('Invalid JSON format');
  }

  if (!data?.build?.character || !Array.isArray(data.build.powers)) {
    return emptyResult('JSON does not match expected external build format (missing build.character or build.powers)');
  }

  const { character, powers } = data.build;

  // 2. Separate by category
  const buildPowers: ExternalPower[] = [];  // inherent + combat (for splitting)
  const accoladePowers: ExternalPower[] = [];
  const incarnatePowers: ExternalPower[] = [];
  const fitnessPowers: ExternalPower[] = [];

  for (const p of powers) {
    if (p.categoryName === 'prestige') continue;
    if (p.categoryName === 'incarnate') {
      incarnatePowers.push(p);
      continue;
    }
    if (p.categoryName === 'temporary_powers') {
      if (p.powerSetName === 'accolades') {
        accoladePowers.push(p);
      }
      continue;
    }
    if (p.categoryName === 'fitness') {
      fitnessPowers.push(p);
      continue;
    }
    // inherent + primary/secondary/pool/epic
    buildPowers.push(p);
  }

  // 3. Split into builds
  const segments = splitBuilds(buildPowers);

  // 4. Score and describe each build
  const availableBuilds: BuildSegmentInfo[] = segments.map((seg, i) => {
    const scores = scoreBuildSegment(seg);
    const sets = getSegmentSetNames(seg);
    return {
      index: i,
      powerCount: scores.powerCount,
      enhancementCount: scores.enhancementCount,
      primarySet: sets.primary,
      secondarySet: sets.secondary,
    };
  });

  // 5. Select best build (highest enhancement count, or user-specified)
  let selected = buildIndex ?? 0;
  if (buildIndex === undefined) {
    let bestScore = -1;
    for (let i = 0; i < availableBuilds.length; i++) {
      if (availableBuilds[i].enhancementCount > bestScore) {
        bestScore = availableBuilds[i].enhancementCount;
        selected = i;
      }
    }
  }

  if (selected < 0 || selected >= segments.length) {
    return emptyResult(`Build index ${selected} out of range (${segments.length} builds found)`);
  }

  // 6. Convert selected build to GameExportData
  const gameData = convertToGameExportData(character, segments[selected]);

  // 6b. Append best fitness powers (deduplicated across builds)
  const bestFitness = new Map<string, ExternalPower>();
  for (const fp of fitnessPowers) {
    const existing = bestFitness.get(fp.powerName);
    if (!existing || fp.powerNumBoostsBought > existing.powerNumBoostsBought) {
      bestFitness.set(fp.powerName, fp);
    }
  }
  for (const fp of bestFitness.values()) {
    gameData.powers.push(convertPower(fp));
  }

  // 7. Import via shared pipeline
  const result = importFromParsedData(gameData);

  // 8. Augment with incarnates and accolades
  const warnings = [...result.warnings];
  if (result.build) {
    augmentIncarnates(result.build, incarnatePowers, warnings);
    augmentAccolades(result.build, accoladePowers);
  }

  return {
    success: result.success,
    build: result.build,
    warnings,
    summary: result.summary,
    availableBuilds,
    selectedBuild: selected,
  };
}
