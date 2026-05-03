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
import { getIOSet } from '@/data/io-sets';

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
 * Convert an IO set display name to its Mids UID stem.
 * "Luck of the Gambler" → "Luck_of_the_Gambler"
 * "Gaussian's Synchronized Fire-Control" → "Gaussians_Synchronized_FireControl"
 * "Superior Malice of the Corruptor" → "Superior_Malice_of_the_Corruptor"
 */
function displayNameToMidsUid(name: string): string {
  return name
    .replace(/['']/g, '')      // Remove apostrophes: Gaussian's → Gaussians
    .replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) // Fire-Control → FireControl
    .replace(/\s+/g, '_');     // Spaces → underscores
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
 * Normalize an AT category prefix to Title_Case for Mids compatibility.
 * "Corruptor_BUFF" → "Corruptor_Buff", "Brute_DEFENSE" → "Brute_Defense"
 */
function normalizeCategoryPrefix(prefix: string): string {
  return titleCase(prefix.toLowerCase());
}

/**
 * Build the Mids powerset path (first two segments):
 * e.g., "Tanker_Defense.Willpower"
 */
function buildPowersetPath(
  archetypeId: string,
  powersetId: string,
  category: 'primary' | 'secondary',
): string {
  const at = AT_TABLES[archetypeId];
  const rawPrefix = category === 'primary' ? at?.primaryCategory : at?.secondaryCategory;
  if (!rawPrefix) return '';

  const prefix = normalizeCategoryPrefix(rawPrefix);

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
    const def = pool?.powers.find((p) => p.internalName === power.internalName);
    if (def?.fullName) return def.fullName;
  }

  // For epic powers without fullName, try looking up from epic definition
  if (category === 'epic') {
    const epic = getEpicPool(powersetId);
    const def = epic?.powers.find((p) => p.internalName === power.internalName);
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
      return { Uid: '', Grade: 'None', IoLevel: 49, RelativeLevel: 'Even', Obtained: false };
  }
}

/**
 * Get the Mids UID stem for an IO set.
 * Looks up the set display name and converts it to Mids format.
 * Falls back to titleCase of the setId if not found.
 */
function getMidsSetUidStem(setId: string): string {
  const ioSet = getIOSet(setId);
  if (ioSet?.name) {
    return displayNameToMidsUid(ioSet.name);
  }
  return titleCase(setId);
}

function buildIOSetEnhancement(enh: IOSetEnhancement): MbdEnhancement {
  const pieceLetter = String.fromCharCode('A'.charCodeAt(0) + enh.pieceNum - 1);
  const setName = getMidsSetUidStem(enh.setId);

  let uid: string;
  if (enh.setId.startsWith('superior_')) {
    // Superior sets use Superior_Attuned_ prefix.
    // Winter/purple sets that have a non-superior variant (e.g., "Blistering Cold"
    // exists alongside "Superior Blistering Cold") need "Superior_" stripped from
    // the stem — Mids uses "Superior_Attuned_Blistering_Cold_A".
    // ATOs that ONLY exist as Superior (e.g., "Superior Critical Strikes") keep
    // it — Mids uses "Superior_Attuned_Superior_Critical_Strikes_A".
    const nonSuperiorId = enh.setId.slice('superior_'.length);
    const hasNonSuperiorVariant = !!getIOSet(nonSuperiorId);
    const stem = hasNonSuperiorVariant && setName.startsWith('Superior_')
      ? setName.slice('Superior_'.length)
      : setName;
    uid = `Superior_Attuned_${stem}_${pieceLetter}`;
  } else {
    // All other sets: Crafted_SetName_X (Mids uses Crafted_ for all non-Superior IOs)
    uid = `Crafted_${setName}_${pieceLetter}`;
  }

  // Attuned IOs scale with level and don't have a fixed IoLevel — use 0.
  // Non-attuned IOs use their fixed level (0-based).
  const ioLevel = enh.attuned ? 0 : Math.max(0, (enh.level ?? 50) - 1);

  return {
    Uid: uid,
    Grade: 'None',
    IoLevel: ioLevel,
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

function buildGenericIOEnhancement(enh: GenericIOEnhancement): MbdEnhancement {
  const midsStat = REVERSE_STAT_MAP[enh.stat] || enh.stat.replace(/\s+/g, '_');
  return {
    Uid: `Crafted_${midsStat}`,
    Grade: 'None',
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

/**
 * Reverse mapping from special enhancement registry ID → Mids UID suffix.
 * Built from the import code's SPECIAL_SUFFIX_MAPS (inverted).
 */
const REVERSE_SPECIAL_SUFFIX: Record<string, Record<string, string>> = {
  hamidon: {
    nucleolus: 'Damage_Accuracy', centriole: 'Damage_Range',
    enzyme: 'DeBuff_Endurance_Discount', lysosome: 'DeBuff_Accuracy',
    membrane: 'Buff_Recharge', peroxisome: 'Damage_Mez',
    ribosome: 'Res_Damage_Endurance_Discount', golgi: 'Heal_Endurance_Discount',
    endoplasm: 'Accuracy_Mez', cytoskeleton: 'Buff_Endurance_Discount',
    microfilament: 'Travel_Endurance_Discount', vesicle: 'Endurance_Modification_Recharge',
    stereocilia: 'Slow_Recharge_Endurance_Discount', microtubule: 'Endurance_Modification_Accuracy',
    karyoplasm: 'Damage_Endurance_Discount', microvillus: 'Accuracy_Range',
    chromatin: 'Damage_Recharge', ectosome: 'Threat_Accuracy_Recharge',
    amyloplast: 'Heal_Recharge', chloroplast: 'Heal_Accuracy',
  },
  titan: {
    amethyst: 'Damage_Mez', calcite: 'Accuracy_Mez',
    citrine: 'Buff_Recharge', diamond: 'Damage_Accuracy',
    gypsum: 'DeBuff_Accuracy', kyanite: 'Heal_Endurance_Discount',
    peridont: 'Res_Damage_Endurance_Discount', quartz: 'Damage_Range',
    selenite: 'Travel_Endurance_Discount', tanzanite: 'Buff_Endurance_Discount',
    zeolite: 'DeBuff_Endurance_Discount',
  },
  hydra: {
    antiproton: 'DeBuff_Endurance_Discount', delta: 'DeBuff_Accuracy',
    electron: 'Res_Damage_Endurance_Discount', gluon: 'Damage_Mez',
    graviton: 'Accuracy_Mez', neutrino: 'Damage_Accuracy',
    neutron: 'Damage_Range', positron: 'Heal_Endurance_Discount',
    proton: 'Buff_Endurance_Discount', quark: 'Buff_Recharge',
    theta: 'Travel_Endurance_Discount',
  },
  'd-sync': {
    acceleration: 'Travel_Endurance_Discount', binding: 'Accuracy_Mez',
    conduit: 'Endurance_Modification_Recharge', containment: 'Damage_Mez',
    deceleration: 'Slow_Recharge_Endurance_Discount', drain: 'Endurance_Modification_Accuracy',
    efficiency: 'Damage_Endurance_Discount', elusivity: 'Buff_Endurance_Discount',
    empowerment: 'Damage_Accuracy', extension: 'Damage_Range',
    fortification: 'Res_Damage_Endurance_Discount', guidance: 'Accuracy_Range',
    marginalization: 'DeBuff_Endurance_Discount', obfuscation: 'DeBuff_Accuracy',
    optimization: 'Damage_Recharge', provocation: 'Threat_Accuracy_Recharge',
    reconstitution: 'Heal_Endurance_Discount', reconstruction: 'Heal_Recharge',
    shifting: 'Buff_Recharge', siphon: 'Heal_Accuracy',
  },
};

function buildSpecialEnhancement(enh: SpecialEnhancement): MbdEnhancement {
  const prefixMap: Record<string, string> = {
    hamidon: 'Hamidon',
    titan: 'Titan',
    hydra: 'Hydra',
    'd-sync': 'DSync',
  };
  const prefix = prefixMap[enh.category] || 'Hamidon';

  // Extract registry ID from enhancement ID (e.g., "hamidon-enzyme" → "enzyme")
  const registryId = enh.id.replace(`${enh.category}-`, '');
  const suffixMap = REVERSE_SPECIAL_SUFFIX[enh.category];
  const suffix = suffixMap?.[registryId];

  const uid = suffix ? `${prefix}_${suffix}` : `${prefix}_Unknown`;

  return {
    Uid: uid,
    Grade: 'None',
    IoLevel: 0,
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

// ============================================
// SLOT ENTRIES
// ============================================

function buildSlotEntries(slots: (Enhancement | null)[], powerLevel: number): MbdSlotEntry[] {
  return slots.map((slot) => ({
    Level: powerLevel,
    IsInherent: false,
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

  // Build PowerSets array: always 8 entries
  // [0]=primary, [1]=secondary, [2]="" (reserved), [3-6]=pools, [7]=epic
  const primaryPath = build.primary.id
    ? buildPowersetPath(archetypeId, build.primary.id, 'primary')
    : '';
  const secondaryPath = build.secondary.id
    ? buildPowersetPath(archetypeId, build.secondary.id, 'secondary')
    : '';

  // Collect pool paths (up to 4)
  const poolPaths: string[] = [];
  for (const pool of build.pools) {
    const poolDef = getPowerPool(pool.id);
    const defPower = poolDef?.powers[0];
    const fullName = defPower?.fullName || (pool.powers[0] as any)?.fullName;
    if (fullName && fullName.startsWith('Pool.')) {
      const parts = fullName.split('.');
      poolPaths.push(`${parts[0]}.${parts[1]}`);
    } else {
      poolPaths.push(`Pool.${titleCase(pool.id)}`);
    }
  }
  // Pad to exactly 4 pool slots
  while (poolPaths.length < 4) poolPaths.push('');

  // Epic path: derive from first epic power's fullName for correct Mids naming
  let epicPath = '';
  if (build.epicPool) {
    const epicDef = getEpicPool(build.epicPool.id);
    const firstEpicPower = epicDef?.powers[0];
    const fullName = firstEpicPower?.fullName || (build.epicPool.powers[0] as any)?.fullName;
    if (fullName && fullName.startsWith('Epic.')) {
      const parts = fullName.split('.');
      epicPath = `${parts[0]}.${parts[1]}`;
    } else {
      epicPath = `Epic.${titleCase(build.epicPool.id)}`;
    }
  }

  const powerSets = [primaryPath, secondaryPath, '', ...poolPaths, epicPath];

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

  // Database string mirrors what Mids Reborn writes for each server, so
  // round-tripping between us and Mids preserves the dataset on import.
  const databaseLabel = build.serverId === 'rebirth' ? 'Rebirth' : 'Homecoming';
  const mbdFile: MbdFile = {
    BuiltWith: {
      App: 'CoH Planner',
      Version: '1.0',
      Database: databaseLabel,
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
