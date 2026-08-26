/**
 * Export a Sidekick build to Mids Reborn .mbd (JSON) format.
 * This is the reverse of src/utils/mids-import/.
 */

import type { Build, SelectedPower, Enhancement, IOSetEnhancement, GenericIOEnhancement, SpecialEnhancement, OriginEnhancement } from '@/types';
import { INCARNATE_SLOT_ORDER } from '@/types';
import type { MbdFile, MbdPowerEntry, MbdSlotEntry, MbdEnhancement } from '@/utils/mids-import/types';
import { AT_TABLES } from '@/data/at-tables';
import { getPowerset } from '@/data/powersets';
import { getPowerPool } from '@/data/power-pools';
import { getEpicPool } from '@/data/epic-pools';
import { getIOSet } from '@/data/io-sets';
import { getMidsGenericIOUid, getMidsIOSetPieceUid, getMidsOriginUid, getMidsSpecialUid } from '@/data/mids-uids';
import { MIDS_STAT_MAP } from '@/utils/mids-import/mappers';
import { getInherentPowers, getArchetypeInherentPowers } from '@/data';
import { computeAllSlotLevels, type SlotLevel } from '@/utils/slot-levels';
import { powerKey, type PowerCategory } from '@/utils/power-key';

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
// GENERIC IO STAT → MIDS UID SUFFIX
// ============================================

/**
 * Planner stat → the Mids UID suffix that names it, e.g. `EnduranceReduction`
 * → `Endurance_Discount` (Mids' spelling, not ours).
 *
 * Derived by inverting the import path's `MIDS_STAT_MAP` and keeping only the
 * spelling this dataset's Mids database actually ships. The hand-written
 * forward map that used to live here had drifted off Mids in seven places —
 * `EndRdx`, `Resistance`, `Immob`, `Run_Speed`, `Slow`, `EndMod` and the two
 * `Debuff`/`DeBuff` casings — and each one exported as an empty slot.
 *
 * Not memoized across datasets on purpose: the roster is per-server, and this
 * runs once per exported enhancement.
 */
function midsGenericIOSuffix(stat: string): string | null {
  for (const [suffix, mapped] of Object.entries(MIDS_STAT_MAP)) {
    if (mapped !== stat) continue;
    const uid = getMidsGenericIOUid(suffix);
    if (uid) return uid;
  }
  return null;
}

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
 * Icon "thermal_radiation_set.ico" → "Thermal_Radiation"
 * Rebirth and HC datasets store icons as .ico; the import mapper strips
 * either extension, so strip any extension here to keep the round-trip.
 */
function getMidsSetName(icon: string): string {
  const stem = icon
    .replace(/_set\.(?:png|ico|jpg|gif)$/, '')
    .replace(/\.(?:png|ico|jpg|gif)$/, '');
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

/**
 * Build a Mids `RelativeLevel` (`eEnhRelative`) from a signed level offset.
 *
 * The negative half matters for the round-trip: Mids can express a -3 SO, so
 * exporting one as "Even" would launder an under-level build into a fresh one
 * on the way out the same way the importer used to on the way in. Mids' enum
 * bottoms out at MinusThree and tops out at PlusFive, so anything beyond that
 * clamps to the nearest end rather than silently becoming even.
 */
const RELATIVE_LEVEL_NAMES: Record<number, string> = {
  [-3]: 'MinusThree',
  [-2]: 'MinusTwo',
  [-1]: 'MinusOne',
  0: 'Even',
  1: 'PlusOne',
  2: 'PlusTwo',
  3: 'PlusThree',
  4: 'PlusFour',
  5: 'PlusFive',
};

function buildRelativeLevel(boost?: number): string {
  if (!boost || !Number.isFinite(boost)) return 'Even';
  const clamped = Math.min(5, Math.max(-3, Math.trunc(boost)));
  return RELATIVE_LEVEL_NAMES[clamped] ?? 'Even';
}

/**
 * An enhancement Mids has no UID for.
 *
 * Mids fails silently on an unknown UID — `GetEnhancementByUIDName` returns -1
 * and `LoadEnhancementData` leaves the slot empty — so an export that guesses
 * hands the user a build with holes in it and no way to know why. We refuse to
 * guess and report the hole instead.
 */
export interface MidsExportWarning {
  power: string;
  slot: number;
  detail: string;
}

/** Build Mids enhancement UID and metadata from an app Enhancement */
function buildEnhancement(enh: Enhancement): MbdEnhancement | null {
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
      return null;
  }
}

/** Describe an enhancement for a warning message. */
function describeEnhancement(enh: Enhancement): string {
  switch (enh.type) {
    case 'io-set':
      return `${getIOSet(enh.setId)?.name ?? enh.setId} piece ${enh.pieceNum}`;
    case 'io-generic':
      return `${enh.stat} IO`;
    case 'origin':
      return `${enh.tier} ${enh.stat}`;
    case 'special':
      return enh.id;
    default:
      return 'enhancement';
  }
}

function buildIOSetEnhancement(enh: IOSetEnhancement): MbdEnhancement | null {
  const uid = getMidsIOSetPieceUid(enh.setId, enh.pieceNum);
  if (!uid) return null;

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

function buildGenericIOEnhancement(enh: GenericIOEnhancement): MbdEnhancement | null {
  const uid = midsGenericIOSuffix(enh.stat);
  if (!uid) return null;
  return {
    Uid: uid,
    Grade: 'None',
    IoLevel: Math.max(0, (enh.level ?? 50) - 1),
    RelativeLevel: buildRelativeLevel(enh.boost),
    Obtained: false,
  };
}

/**
 * Origin (TO/DO/SO) enhancements. The stat half is the suffix the crafted IOs
 * use; `getMidsOriginUid` turns it into the record Mids actually carries, and
 * `Grade` supplies the tier.
 */
function buildOriginEnhancement(enh: OriginEnhancement): MbdEnhancement | null {
  const crafted = midsGenericIOSuffix(enh.stat);
  const uid = crafted && getMidsOriginUid(crafted);
  if (!uid) return null;
  return {
    Uid: uid,
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

function buildSpecialEnhancement(enh: SpecialEnhancement): MbdEnhancement | null {
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

  if (!suffix) return null;

  // The suffix map is hand-inverted from the import side, so check the result
  // against the dataset's roster before shipping it — an unrecognised exotic
  // would otherwise leave an empty slot with no trace.
  const uid = getMidsSpecialUid(`${prefix}_${suffix}`);
  if (!uid) return null;

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

/**
 * `SlotEntry.Level` is the level the slot was PLACED, not the level of the
 * power holding it. Stamping every slot with the power's level made a
 * six-slotted level-2 power claim six slots at level 2, which Mids draws (with
 * "Slot Levels: On") as an illegal build.
 *
 * `computeAllSlotLevels` is the same solver the print and forum exports use, so
 * all three agree on what the build says.
 */
function buildSlotEntries(
  power: SelectedPower,
  levels: SlotLevel[] | undefined,
  inherentSlots: number,
  warnings: MidsExportWarning[],
): MbdSlotEntry[] {
  return power.slots.map((slot, index) => {
    const enhancement = slot ? buildEnhancement(slot) : null;
    if (slot && !enhancement) {
      warnings.push({
        power: power.name,
        slot: index + 1,
        detail: `${describeEnhancement(slot)} — Mids has no enhancement by that name`,
      });
    }
    return {
      Level: levels?.[index] ?? power.level,
      IsInherent: index > 0 && index <= inherentSlots,
      Enhancement: enhancement,
      FlippedEnhancement: null,
    };
  });
}

/** One .mbd power entry, with its slots resolved. */
function buildPowerEntry(
  power: SelectedPower,
  powerName: string,
  category: PowerCategory,
  slotLevels: Map<string, SlotLevel[]>,
  warnings: MidsExportWarning[],
): MbdPowerEntry {
  const inherentSlots = power.inherentSlotCount ?? 0;
  const levels = slotLevels.get(powerKey(category, power.internalName || power.name));
  return {
    PowerName: powerName,
    Level: power.level,
    StatInclude: power.isActive !== false,
    ProcInclude: false,
    VariableValue: 0,
    InherentSlotsUsed: inherentSlots,
    SubPowerEntries: [],
    SlotEntries: buildSlotEntries(power, levels, inherentSlots, warnings),
  };
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Export a Sidekick Build to Mids Reborn .mbd JSON format.
 *
 * Returns the JSON alongside every enhancement that could not be named, so the
 * caller can say what the file is missing. Mids drops an unresolvable slot in
 * silence, so an unreported warning here is a build the user gets back with
 * holes and no explanation.
 */
export function exportToMidsWithReport(build: Build): { json: string; warnings: MidsExportWarning[] } {
  const archetypeId = build.archetype.id || '';
  const midsClass = REVERSE_ARCHETYPE_MAP[archetypeId] || 'Class_Blaster';
  const warnings: MidsExportWarning[] = [];
  const slotLevels = computeAllSlotLevels(build);

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
    const fullName = defPower?.fullName || (pool.powers[0] as { fullName?: string } | undefined)?.fullName;
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
    const fullName = firstEpicPower?.fullName
      || (build.epicPool.powers[0] as { fullName?: string } | undefined)?.fullName;
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

  for (const power of build.primary.powers) {
    const powerName = buildPowerName(power, build.primary.id || '', archetypeId, 'primary');
    powerEntries.push(buildPowerEntry(power, powerName, 'primary', slotLevels, warnings));
  }

  for (const power of build.secondary.powers) {
    const powerName = buildPowerName(power, build.secondary.id || '', archetypeId, 'secondary');
    powerEntries.push(buildPowerEntry(power, powerName, 'secondary', slotLevels, warnings));
  }

  for (const pool of build.pools) {
    for (const power of pool.powers) {
      const powerName = buildPowerName(power, pool.id, archetypeId, 'pool');
      powerEntries.push(buildPowerEntry(power, powerName, 'pool', slotLevels, warnings));
    }
  }

  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      const powerName = buildPowerName(power, build.epicPool.id, archetypeId, 'epic');
      powerEntries.push(buildPowerEntry(power, powerName, 'epic', slotLevels, warnings));
    }
  }

  // `LastPower` is the index of the last CHOSEN power; Mids reads everything
  // past it as auto-granted. Inherents and incarnates therefore have to follow
  // the chosen powers, and the marker has to be taken before they are added.
  const lastPower = powerEntries.length - 1;

  // Inherents. Mids re-creates Health/Stamina/Swift/Hurdle itself, but only the
  // build file carries what the user slotted into them — and that is where a
  // build keeps Miracle, Panacea, Performance Shifter and Numina's. Dropping
  // these entries dropped those procs, and every set bonus they carried, from
  // the exported build.
  for (const power of build.inherents) {
    // Only the slotted ones. Mids rebuilds the inherent roster itself, so an
    // entry with nothing in it is noise — and the prestige sprints carry names
    // Mids may not recognise.
    if (!power.slots.some(Boolean)) continue;
    const fullName = inherentFullName(power, archetypeId);
    if (!fullName) {
      warnings.push({
        power: power.name,
        slot: 0,
        detail: 'inherent has no Mids power name — its slots were not exported',
      });
      continue;
    }
    powerEntries.push(buildPowerEntry(power, fullName, 'inherent', slotLevels, warnings));
  }

  // Incarnates. `powerName` is already Mids' own `Incarnate.<Slot>.<Power>`.
  for (const slot of INCARNATE_SLOT_ORDER) {
    const chosen = build.incarnates?.[slot];
    if (!chosen?.powerName) continue;
    powerEntries.push({
      PowerName: chosen.powerName,
      Level: 50,
      StatInclude: true,
      ProcInclude: false,
      VariableValue: 0,
      InherentSlotsUsed: 0,
      SubPowerEntries: [],
      SlotEntries: [],
    });
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
    Origin: build.settings?.origin || 'Science',
    Alignment: 'Hero',
    Name: build.name || 'Unnamed Build',
    Comment: '',
    PowerSets: powerSets,
    LastPower: lastPower,
    PowerEntries: powerEntries,
  };

  return { json: JSON.stringify(mbdFile, null, 2), warnings };
}

/**
 * Mids' full name for an inherent (`Inherent.Fitness.Stamina`).
 *
 * A stored inherent may not carry `fullName` — the .skif writer prunes it — so
 * fall back to the dataset's own inherent rosters by name.
 */
function inherentFullName(power: SelectedPower, archetypeId: string): string | null {
  const stored = (power as { fullName?: string }).fullName;
  if (stored?.startsWith('Inherent.')) return stored;

  const name = power.internalName || power.name;
  const match = [...getInherentPowers(), ...getArchetypeInherentPowers(archetypeId || undefined)]
    .find((def) => def.internalName === name || def.name === power.name);
  return match?.fullName ?? null;
}

/**
 * Export a Sidekick Build to Mids Reborn .mbd JSON format.
 * Returns the JSON string ready to save as a .mbd file.
 */
export function exportToMids(build: Build): string {
  return exportToMidsWithReport(build).json;
}
