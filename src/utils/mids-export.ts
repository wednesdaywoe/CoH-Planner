/**
 * Export a CoH-Planner build to Mids Reborn .mbd (JSON) format.
 * This is the reverse of src/utils/mids-import/.
 */

import type { Build, Enhancement, IOSetEnhancement, GenericIOEnhancement, SpecialEnhancement, OriginEnhancement } from '@/types';
import type { MbdFile, MbdPowerEntry, MbdSlotEntry, MbdEnhancement } from '@/utils/mids-import/types';
import { AT_TABLES } from '@/data/at-tables';
import { getPowerset } from '@/data/powersets';
import { getPowerPool } from '@/data/power-pools';
import { getEpicPool } from '@/data/epic-pools';

// ============================================
// REVERSE ARCHETYPE MAP (app ID → Mids Class_*)
// ============================================

const REVERSE_ARCHETYPE_MAP: Record<string, string> = {
  blaster: 'Class_Blaster',
  brute: 'Class_Brute',
  controller: 'Class_Controller',
  corruptor: 'Class_Corruptor',
  defender: 'Class_Defender',
  dominator: 'Class_Dominator',
  mastermind: 'Class_Mastermind',
  scrapper: 'Class_Scrapper',
  sentinel: 'Class_Sentinel',
  stalker: 'Class_Stalker',
  tanker: 'Class_Tanker',
  peacebringer: 'Class_Peacebringer',
  warshade: 'Class_Warshade',
  'arachnos-soldier': 'Class_Arachnos_Soldier',
  'arachnos-widow': 'Class_Arachnos_Widow',
};

// ============================================
// REVERSE STAT MAP (app stat → Mids UID keyword)
// ============================================

const REVERSE_STAT_MAP: Record<string, string> = {
  Damage: 'Damage',
  Accuracy: 'Accuracy',
  Recharge: 'Recharge',
  EnduranceReduction: 'EndRdx',
  Range: 'Range',
  Defense: 'Defense_Buff',
  Resistance: 'Resistance',
  Healing: 'Heal',
  ToHit: 'ToHit_Buff',
  'ToHit Debuff': 'ToHit_Debuff',
  'Defense Debuff': 'Defense_Debuff',
  Hold: 'Hold',
  Stun: 'Stun',
  Immobilize: 'Immob',
  Sleep: 'Sleep',
  Confuse: 'Confuse',
  Fear: 'Fear',
  Knockback: 'Knockback',
  'Run Speed': 'Run_Speed',
  Jump: 'Jump',
  Fly: 'Fly',
  'Mez Duration': 'Mez',
  Taunt: 'Taunt',
  Slow: 'Slow',
  Intangible: 'Intangible',
  EnduranceModification: 'EndMod',
  Interrupt: 'Interrupt',
  Absorb: 'Absorb',
};

// ============================================
// HELPERS
// ============================================

/** Convert a lowercase_underscore string to Title_Case */
function titleCase(str: string): string {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');
}

/**
 * Get the Mids internal name for a powerset from its icon.
 * Icon "willpower_set.png" → "Willpower"
 * Icon "fire_blast_set.png" → "Fire_Blast"
 */
function getMidsSetName(icon: string): string {
  const stem = icon.replace(/_set\.png$/, '').replace(/\.png$/, '');
  return titleCase(stem);
}

/**
 * Build the Mids powerset path (first two segments):
 * e.g., "Tanker_DEFENSE.Willpower"
 */
function buildPowersetPath(
  archetypeId: string,
  powersetId: string,
  category: 'primary' | 'secondary',
): string {
  const at = AT_TABLES[archetypeId];
  const prefix = category === 'primary' ? at?.primaryCategory : at?.secondaryCategory;
  if (!prefix) return '';

  const powerset = getPowerset(powersetId);
  if (!powerset?.icon) return '';

  const midsName = getMidsSetName(powerset.icon);
  return `${prefix}.${midsName}`;
}

/**
 * Build the full Mids PowerName for a power.
 * For pool/epic powers: use fullName if available.
 * For primary/secondary: {Category}.{SetName}.{InternalName}
 */
function buildPowerName(
  power: { name: string; internalName?: string; fullName?: string },
  powersetId: string,
  archetypeId: string,
  category: 'primary' | 'secondary' | 'pool' | 'epic',
): string {
  // Pool and epic powers typically have fullName already in Mids format
  if (power.fullName && (power.fullName.startsWith('Pool.') || power.fullName.startsWith('Epic.'))) {
    return power.fullName;
  }

  // For pool powers without fullName, try looking up from pool definition
  if (category === 'pool') {
    const pool = getPowerPool(powersetId);
    const def = pool?.powers.find((p) => p.name === power.name);
    if (def?.fullName) return def.fullName;
  }

  // For epic powers without fullName, try looking up from epic definition
  if (category === 'epic') {
    const epic = getEpicPool(powersetId);
    const def = epic?.powers.find((p) => p.name === power.name);
    if (def?.fullName) return def.fullName;
  }

  // Primary/secondary: construct from AT category + set name + power internal name
  const setPath = buildPowersetPath(archetypeId, powersetId, category as 'primary' | 'secondary');
  const internalName = power.internalName || power.name.replace(/\s+/g, '_');
  return setPath ? `${setPath}.${internalName}` : internalName;
}

// ============================================
// ENHANCEMENT UID CONSTRUCTION
// ============================================

/** Build boost RelativeLevel string from boost number */
function buildRelativeLevel(boost?: number): string {
  if (!boost || boost <= 0) return 'Even';
  const map: Record<number, string> = {
    1: 'PlusOne',
    2: 'PlusTwo',
    3: 'PlusThree',
    4: 'PlusFour',
    5: 'PlusFive',
  };
  return map[boost] || 'Even';
}

/** Build Mids enhancement UID and metadata from an app Enhancement */
function buildEnhancement(enh: Enhancement): MbdEnhancement {
  switch (enh.type) {
    case 'io-set':
      return buildIOSetEnhancement(enh);
    case 'io-generic':
      return buildGenericIOEnhancement(enh);
    case 'origin':
      return buildOriginEnhancement(enh);
    case 'special':
      return buildSpecialEnhancement(enh);
    default:
      return { Uid: '', Grade: 'IO', IoLevel: 49, RelativeLevel: 'Even', Obtained: false };
  }
}

function buildIOSetEnhancement(enh: IOSetEnhancement): MbdEnhancement {
  const pieceLetter = String.fromCharCode('A'.charCodeAt(0) + enh.pieceNum - 1);
  const setName = titleCase(enh.setId);

  let uid: string;
  if (enh.attuned) {
    // Superior sets use Superior_Attuned_ prefix
    if (enh.setId.startsWith('superior_')) {
      uid = `Superior_Attuned_${setName}_${pieceLetter}`;
    } else {
      uid = `Attuned_${setName}_${pieceLetter}`;
    }
  } else {
    uid = `Crafted_${setName}_${pieceLetter}`;
  }

  return {
    Uid: uid,
    Grade: 'IO',
    IoLevel: enh.attuned ? 0 : Math.max(0, (enh.level ?? 50) - 1),
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

function buildGenericIOEnhancement(enh: GenericIOEnhancement): MbdEnhancement {
  const midsStat = REVERSE_STAT_MAP[enh.stat] || enh.stat.replace(/\s+/g, '_');
  return {
    Uid: `Crafted_${midsStat}`,
    Grade: 'IO',
    IoLevel: Math.max(0, (enh.level ?? 50) - 1),
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

function buildOriginEnhancement(enh: OriginEnhancement): MbdEnhancement {
  const midsStat = REVERSE_STAT_MAP[enh.stat] || enh.stat.replace(/\s+/g, '_');
  return {
    Uid: midsStat,
    Grade: enh.tier,
    IoLevel: 0,
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

function buildSpecialEnhancement(enh: SpecialEnhancement): MbdEnhancement {
  // Build UID from category prefix + aspect keywords
  const prefixMap: Record<string, string> = {
    hamidon: 'Hamidon',
    titan: 'Titan',
    hydra: 'Hydra',
    'd-sync': 'DSync',
  };
  const prefix = prefixMap[enh.category] || 'Hamidon';

  // Build keyword part from aspects
  const keywords = enh.aspects
    .map((a) => REVERSE_STAT_MAP[a.stat] || a.stat.replace(/\s+/g, '_'))
    .join('_');

  return {
    Uid: `${prefix}_${keywords}`,
    Grade: 'SingleO',
    IoLevel: 0,
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

// ============================================
// SLOT ENTRIES
// ============================================

function buildSlotEntries(slots: (Enhancement | null)[], powerLevel: number): MbdSlotEntry[] {
  return slots.map((slot, idx) => ({
    Level: idx === 0 ? powerLevel : powerLevel, // Slot level defaults to power level
    IsInherent: idx === 0,
    Enhancement: slot ? buildEnhancement(slot) : null,
    FlippedEnhancement: null,
  }));
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Export a CoH-Planner Build to Mids Reborn .mbd JSON format.
 * Returns the JSON string ready to save as a .mbd file.
 */
export function exportToMids(build: Build): string {
  const archetypeId = build.archetype.id || '';
  const midsClass = REVERSE_ARCHETYPE_MAP[archetypeId] || 'Class_Blaster';

  // Build PowerSets array: [primary, secondary, ...pools, epic]
  const powerSets: string[] = [];

  // Primary path
  const primaryPath = build.primary.id
    ? buildPowersetPath(archetypeId, build.primary.id, 'primary')
    : '';
  powerSets.push(primaryPath);

  // Secondary path
  const secondaryPath = build.secondary.id
    ? buildPowersetPath(archetypeId, build.secondary.id, 'secondary')
    : '';
  powerSets.push(secondaryPath);

  // Pool paths
  for (const pool of build.pools) {
    // Try to derive the pool path from a power's fullName
    const firstPower = pool.powers[0];
    const poolDef = getPowerPool(pool.id);
    const defPower = poolDef?.powers[0];
    const fullName = defPower?.fullName || (firstPower as any)?.fullName;
    if (fullName && fullName.startsWith('Pool.')) {
      // Extract "Pool.Speed" from "Pool.Speed.Hasten"
      const parts = fullName.split('.');
      powerSets.push(`${parts[0]}.${parts[1]}`);
    } else {
      // Fallback: construct from pool ID
      powerSets.push(`Pool.${titleCase(pool.id)}`);
    }
  }

  // Epic path
  if (build.epicPool) {
    const epicDef = getEpicPool(build.epicPool.id);
    const firstEpicPower = epicDef?.powers[0];
    const fullName = firstEpicPower?.fullName || (build.epicPool.powers[0] as any)?.fullName;
    if (fullName && fullName.startsWith('Epic.')) {
      const parts = fullName.split('.');
      powerSets.push(`${parts[0]}.${parts[1]}`);
    } else {
      powerSets.push(`Epic.${titleCase(build.epicPool.id)}`);
    }
  }

  // Build PowerEntries from all selected powers
  const powerEntries: MbdPowerEntry[] = [];

  // Primary powers
  for (const power of build.primary.powers) {
    const powerName = buildPowerName(power, build.primary.id || '', archetypeId, 'primary');
    powerEntries.push({
      PowerName: powerName,
      Level: power.level,
      StatInclude: power.isActive !== false,
      ProcInclude: false,
      VariableValue: 0,
      InherentSlotsUsed: 0,
      SubPowerEntries: [],
      SlotEntries: buildSlotEntries(power.slots, power.level),
    });
  }

  // Secondary powers
  for (const power of build.secondary.powers) {
    const powerName = buildPowerName(power, build.secondary.id || '', archetypeId, 'secondary');
    powerEntries.push({
      PowerName: powerName,
      Level: power.level,
      StatInclude: power.isActive !== false,
      ProcInclude: false,
      VariableValue: 0,
      InherentSlotsUsed: 0,
      SubPowerEntries: [],
      SlotEntries: buildSlotEntries(power.slots, power.level),
    });
  }

  // Pool powers
  for (const pool of build.pools) {
    for (const power of pool.powers) {
      const powerName = buildPowerName(power, pool.id, archetypeId, 'pool');
      powerEntries.push({
        PowerName: powerName,
        Level: power.level,
        StatInclude: power.isActive !== false,
        ProcInclude: false,
        VariableValue: 0,
        InherentSlotsUsed: 0,
        SubPowerEntries: [],
        SlotEntries: buildSlotEntries(power.slots, power.level),
      });
    }
  }

  // Epic powers
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      const powerName = buildPowerName(power, build.epicPool.id, archetypeId, 'epic');
      powerEntries.push({
        PowerName: powerName,
        Level: power.level,
        StatInclude: power.isActive !== false,
        ProcInclude: false,
        VariableValue: 0,
        InherentSlotsUsed: 0,
        SubPowerEntries: [],
        SlotEntries: buildSlotEntries(power.slots, power.level),
      });
    }
  }

  const mbdFile: MbdFile = {
    BuiltWith: {
      App: 'CoH Planner',
      Version: '1.0',
      Database: 'Homecoming',
      DatabaseVersion: '27.2025.1127.1',
    },
    Level: String(build.level - 1), // 0-based
    Class: midsClass,
    Origin: 'Science', // Origin not tracked in builds
    Alignment: 'Hero',
    Name: build.name || 'Unnamed Build',
    Comment: '',
    PowerSets: powerSets,
    LastPower: powerEntries.length - 1,
    PowerEntries: powerEntries,
  };

  return JSON.stringify(mbdFile, null, 2);
}
