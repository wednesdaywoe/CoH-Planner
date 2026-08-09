/**
 * Powerset Conversion Script
 *
 * Converts raw Homecoming power data to the new modular structure.
 * Usage: node scripts/convert-powerset.js <category> <powerset>
 * Example: node scripts/convert-powerset.js defender_buff radiation_emission
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, dataPath, datasetPath } = require('./_dataset-paths.cjs');
// Text fields that didn't resolve to text (message-store keys like
// `P2937209522`) must not reach the UI as if they had.
const { displayText } = require('./_display-text.cjs');

const datasetId = parseDatasetArg();

// Source: bin-crawler JSON export (tools/bin-crawler/bin_crawler/export_powers.py)
// reading live .pigg archives. The flat `exported_powers/<category>/...`
// layout is HC-only legacy. New datasets land at
// `exported_powers/<datasetId>/<category>/...` so they don't collide with
// HC's checked-in tree.
const RAW_DATA_BASE = path.join(__dirname, '../exported_powers');
const RAW_DATA_PATH = (datasetId === 'homecoming' && !fs.existsSync(path.join(RAW_DATA_BASE, datasetId)))
  ? RAW_DATA_BASE
  : path.join(RAW_DATA_BASE, datasetId);

// Pet lifespans (entity_def → seconds) harvested from each pet's bundled
// Self_Destruct power by convert-pet-entities.cjs. Used as fallback when a
// summoning power's EntCreate AttribMod has Duration=0 — the actual lifespan
// in that case lives on the pet's Self_Destruct.Silent_Kill.Delay rather
// than on the AttribMod. File is regenerated whenever convert-pet-entities
// runs; if missing, we silently skip the fallback (matches old behavior).
const PET_LIFESPANS_PATH = datasetPath(datasetId, 'pet-lifespans.json');
const PET_LIFESPANS = fs.existsSync(PET_LIFESPANS_PATH)
  ? JSON.parse(fs.readFileSync(PET_LIFESPANS_PATH, 'utf-8'))
  : {};

// Self_Destruct delays by fully-qualified power name. Covers the pseudopet
// case (PL_StaticObject patches, Vines pseudo-pets) where the parent power's
// `params.redirects` array names a `*.Self_Destruct` redirect rather than
// routing through a pet entity record. Built by convert-pet-entities.cjs's
// recursive scan over every category in the bin export.
const SELF_DESTRUCT_DELAYS_PATH = datasetPath(datasetId, 'self-destruct-delays.json');
const SELF_DESTRUCT_DELAYS = fs.existsSync(SELF_DESTRUCT_DELAYS_PATH)
  ? JSON.parse(fs.readFileSync(SELF_DESTRUCT_DELAYS_PATH, 'utf-8'))
  : {};

/**
 * Resolve the pet/pseudopet lifespan for an EntCreate template. Three-stage
 * cascade — first hit wins:
 *   1. entity_def in PET_LIFESPANS (named pet entities: Pets_Shade etc.)
 *   2. any *.Self_Destruct entry in params.redirects (pseudopets like
 *      PL_StaticObject + Redirects.Gravity_Control.Self_Destruct, Vines +
 *      Villain_Pets.Vines.Self_Destruct)
 *   3. priority_list in PET_LIFESPANS (Glue Arrow case: entity_def is an
 *      opaque P-hash but priority_list names a real pet entity)
 * Returns 0 when nothing matches (matches the pre-cascade behavior).
 */
function resolvePetLifespan(params) {
  if (!params) return 0;
  if (params.entity_def && PET_LIFESPANS[params.entity_def]) {
    return PET_LIFESPANS[params.entity_def];
  }
  if (Array.isArray(params.redirects)) {
    for (const r of params.redirects) {
      if (typeof r === 'string' && r.endsWith('.Self_Destruct') && SELF_DESTRUCT_DELAYS[r]) {
        return SELF_DESTRUCT_DELAYS[r];
      }
    }
  }
  if (params.priority_list && PET_LIFESPANS[params.priority_list]) {
    return PET_LIFESPANS[params.priority_list];
  }
  return 0;
}

// All datasets (HC + Rebirth + future) write into their own
// `src/data/datasets/<id>/{generated,overrides,powersets}/` tree.
const OUTPUT_GENERATED_PATH = datasetPath(datasetId, 'generated', 'powersets');
const OUTPUT_OVERRIDES_PATH = datasetPath(datasetId, 'overrides', 'powersets');
const OUTPUT_PATH = datasetPath(datasetId, 'powersets');

// Map raw category names to our folder structure
const CATEGORY_MAP = {
  // Heroes
  'defender_buff': { archetype: 'defender', type: 'primary' },
  'defender_ranged': { archetype: 'defender', type: 'secondary' },
  'controller_control': { archetype: 'controller', type: 'primary' },
  'controller_buff': { archetype: 'controller', type: 'secondary' },
  'blaster_ranged': { archetype: 'blaster', type: 'primary' },
  'blaster_support': { archetype: 'blaster', type: 'secondary' },
  'tanker_defense': { archetype: 'tanker', type: 'primary' },
  'tanker_melee': { archetype: 'tanker', type: 'secondary' },
  'scrapper_melee': { archetype: 'scrapper', type: 'primary' },
  'scrapper_defense': { archetype: 'scrapper', type: 'secondary' },
  // Villains
  'corruptor_ranged': { archetype: 'corruptor', type: 'primary' },
  'corruptor_buff': { archetype: 'corruptor', type: 'secondary' },
  'brute_melee': { archetype: 'brute', type: 'primary' },
  'brute_defense': { archetype: 'brute', type: 'secondary' },
  'dominator_control': { archetype: 'dominator', type: 'primary' },
  'dominator_assault': { archetype: 'dominator', type: 'secondary' },
  'mastermind_summon': { archetype: 'mastermind', type: 'primary' },
  'mastermind_buff': { archetype: 'mastermind', type: 'secondary' },
  'stalker_melee': { archetype: 'stalker', type: 'primary' },
  'stalker_defense': { archetype: 'stalker', type: 'secondary' },
  // Praetorian
  'sentinel_ranged': { archetype: 'sentinel', type: 'primary' },
  'sentinel_defense': { archetype: 'sentinel', type: 'secondary' },
  // Rebirth Guardian — primary "Assault" + secondary "Composition" sets.
  // HC has no equivalent AT (Sentinel is HC's ranged/armor hybrid; Guardian
  // is Rebirth's distinct take with its own powerset library).
  'guardian_assault': { archetype: 'guardian', type: 'primary' },
  'guardian_comp': { archetype: 'guardian', type: 'secondary' },
  // Thunderspy Primalist — Kheldian-style form-shifter with a single primary
  // (Feral_Might) and single secondary (Primal_Gifts) powerset.
  'feral_might': { archetype: 'primalist', type: 'primary' },
  'primal_gifts': { archetype: 'primalist', type: 'secondary' },
  // Kheldians — both the defensive and offensive categories live under
  // the same `epic` path in the composed tree (Luminous/Umbral Aura &
  // Blast), matching the existing Powerset.category = 'epic'.
  'peacebringer_defensive': { archetype: 'peacebringer', type: 'epic' },
  'peacebringer_offensive': { archetype: 'peacebringer', type: 'epic' },
  'warshade_defensive': { archetype: 'warshade', type: 'epic' },
  'warshade_offensive': { archetype: 'warshade', type: 'epic' },
  // Arachnos Soldiers / Widows — under HC's bin layout the SoA powers
  // span four source categories: arachnos_soldiers (core soldier sets),
  // training_gadgets (soldier training auxiliaries), widow_training
  // (widow training sets), and teamwork (shared widow leadership/buff).
  // All land under arachnos-soldier/epic or arachnos-widow/epic.
  'arachnos_soldiers': { archetype: 'arachnos-soldier', type: 'epic' },
  'training_gadgets': { archetype: 'arachnos-soldier', type: 'epic' },
  'widow_training': { archetype: 'arachnos-widow', type: 'epic' },
  'teamwork': { archetype: 'arachnos-widow', type: 'epic' },
};

// Enhancement type mapping
const BOOST_TYPE_MAP = {
  'Reduce Endurance Cost': 'EnduranceReduction',
  'Enhance Recharge Speed': 'Recharge',
  'Enhance Accuracy': 'Accuracy',
  'Enhance Range': 'Range',
  'Enhance Damage': 'Damage',
  'Enhance ToHit DeBuffs': 'ToHit Debuff',
  'Enhance Defense DeBuff': 'Defense Debuff',
  'Enhance Heal': 'Healing',
  'Enhance Defense Buff': 'Defense',
  'Enhance Resist Damage': 'Resistance',
  'Enhance Hold': 'Hold',
  'Enhance Hold Duration': 'Hold',
  'Enhance Stun': 'Stun',
  'Enhance Stun Duration': 'Stun',
  'Enhance Disorient': 'Stun',
  'Enhance Disorient Duration': 'Stun',
  'Enhance Immobilize': 'Immobilize',
  'Enhance Immobilize Duration': 'Immobilize',
  'Enhance Sleep': 'Sleep',
  'Enhance Sleep Duration': 'Sleep',
  'Enhance Confuse': 'Confuse',
  'Enhance Confuse Duration': 'Confuse',
  'Enhance Fear': 'Fear',
  'Enhance Fear Duration': 'Fear',
  'Enhance Knockback': 'Knockback',
  'Enhance ToHit Buff': 'ToHit',
  'Enhance Slow': 'Slow',
  'Enhance Slow Movement': 'Slow',
  'Enhance Fly Speed': 'Fly',
  'Enhance Run Speed': 'Run Speed',
  'Enhance Jump': 'Jump',
  'Enhance Intangible Duration': 'Intangible',
  'Enhance Taunt': 'Taunt',
  // Additional mappings found via audit (variant raw names)
  'Enhance Threat Duration': 'Taunt',
  'Enhance KnockBack': 'Knockback',
  'Enhance Endurance Modification': 'EnduranceModification',
  'Enhance Damage Resistance': 'Resistance',
  'Enhance Defense': 'Defense',
  'Enhance ToHit Buffs': 'ToHit',
  'Enhance Immobilization': 'Immobilize',
  'Reduce Interrupt Time': 'Interrupt',
  'Enhance Running Speed': 'Run Speed',
  'Enhance Flying Speed': 'Fly',
};

// Mapping for bin-crawler's boost-type enum names to the planner's
// EnhancementStatType. (Bin-crawler already uses short names close to the
// planner's format; a few still need translation.)
const BIN_BOOST_MAP = {
  'Accuracy': 'Accuracy',
  'Buff_Defense': 'Defense',
  'Buff_ToHit': 'ToHit',
  'Confuse': 'Confuse',
  'Damage': 'Damage',
  'Debuff_Defense': 'Defense Debuff',
  'Debuff_ToHit': 'ToHit Debuff',
  'Fear': 'Fear',
  'SpeedFlying': 'Fly',
  'Heal': 'Healing',
  'Immobilize': 'Immobilize',
  'Jump': 'Jump',
  'Knockback': 'Knockback',
  'Recharge': 'Recharge',
  'SpeedRunning': 'Run Speed',
  'Sleep': 'Sleep',
  'Stun': 'Stun',
  'Range': 'Range',
  'EnduranceDiscount': 'EnduranceReduction',
  'Taunt': 'Taunt',
  'Slow': 'Slow',
  'Hold': 'Hold',
  'Intangible': 'Intangible',
  'Interrupt': 'Interrupt',
  'Recovery': 'EnduranceModification',
  'Endurance_Drain': 'EnduranceModification',
  'Res_Damage': 'Resistance',
  // Origin tags (Science/Mutation/Magic/Technology/Natural) intentionally
  // unmapped — they aren't enhancement categories.
};

// Map bin-crawler's full effect-area enum to the planner's narrower
// EffectArea type. CoD2 used "AoE" for what bin-crawler labels "Sphere",
// and the planner only recognizes the canonical five values.
const EFFECT_AREA_MAP = {
  'SingleTarget': 'SingleTarget',
  'Cone': 'Cone',
  'Sphere': 'AoE',
  'Location': 'Location',
  'Chain': 'Chain',
  // Volume/NamedVolume/Map/Room/Touch/Box — not normally seen on player
  // powers; map to undefined so callers fall back to default behavior.
};

// IO Set category mapping
const SET_CATEGORY_MAP = {
  'Accurate Defense Debuff': 'Accurate Defense Debuff',
  'Accurate Healing': 'Accurate Healing',
  'Accurate ToHit Debuff': 'Accurate To-Hit Debuff',
  'Blaster Archetype Sets': 'Blaster Archetype Sets',
  'Confuse': 'Confuse',
  'Controller Archetype Sets': 'Controller Archetype Sets',
  'Corruptor Archetype Sets': 'Corruptor Archetype Sets',
  'Defender Archetype Sets': 'Defender Archetype Sets',
  'Defense': 'Defense Sets',
  'Defense Debuff': 'Defense Debuff',
  'Dominator Archetype Sets': 'Dominator Archetype Sets',
  'Endurance Modification': 'Endurance Modification',
  'Fear': 'Fear',
  'Flight': 'Flight',
  'Healing': 'Healing',
  'Hold': 'Hold',
  'Immobilize': 'Immobilize',
  'Jumping': 'Jumping',
  'Knockback': 'Knockback',
  'Mastermind Archetype Sets': 'Mastermind Archetype Sets',
  'Melee Damage': 'Melee Damage',
  'PBAoE Damage': 'PBAoE Damage',
  'Pet Damage': 'Pet Damage',
  'Ranged Damage': 'Ranged Damage',
  'Ranged AoE Damage': 'Ranged AoE Damage',
  'Resist Damage': 'Resist Damage',
  'Running': 'Running',
  'Running & Sprints': 'Running & Sprints',
  'Sleep': 'Sleep',
  'Slow Movement': 'Slow Movement',
  'Sniper Attacks': 'Sniper Attacks',
  'Stuns': 'Stuns',
  'Targeted AoE Damage': 'Targeted AoE Damage',
  'Taunt': 'Taunt',
  'To Hit Buff': 'To Hit Buff',
  'To Hit Debuff': 'To Hit Debuff',
  'Travel': 'Travel',
  'Universal Damage Sets': 'Universal Damage Sets',
  'Universal Travel': 'Universal Travel',
};

// Allow-list for raw allowed_boostset_cats values that already match the
// IOSetCategory union directly (i.e. don't need translation through
// SET_CATEGORY_MAP). New categories added by HC patches can be added here
// without touching the type union immediately.
const KNOWN_IO_SET_CATEGORIES = new Set([
  ...Object.values(SET_CATEGORY_MAP),
  'Defense Sets', 'Resist Damage',
  'Holds', 'Confuse', 'Fear', 'Sleep', 'Knockback', 'Immobilize',
  'Healing', 'Endurance Modification',
  'Pet Damage', 'Recharge Intensive Pets',
  'Sniper Attacks', 'PBAoE Damage',
  'Threat Duration',
  'Leaping', 'Leaping & Sprints', 'Flight', 'Teleport',
  'Blaster Archetype Sets', 'Brute Archetype Sets', 'Controller Archetype Sets',
  'Corruptor Archetype Sets', 'Defender Archetype Sets', 'Dominator Archetype Sets',
  'Mastermind Archetype Sets', 'Scrapper Archetype Sets', 'Stalker Archetype Sets',
  'Tanker Archetype Sets', 'Sentinel Archetype Sets',
]);

// ============================================================================
// inferAllowedSetCategories — derive IO set categories from boost types
// ----------------------------------------------------------------------------
// The bin parser's `allowed_boostset_cats` field is broken (always empty or
// corrupted FX-path fragments — see the binparser-bug audit). Until that's
// fixed at the parser level, we infer the categories from boosts_allowed plus
// the power's targeting/effect-area context. The patterns were derived
// empirically from the previously-correct generated data and verified across
// every archetype.
//
// Inputs:
//   boosts          — bin BOOST_TYPE names from boosts_allowed (e.g. ['Damage', 'Accuracy'])
//   archetypeId     — kebab-case AT id from CATEGORY_MAP (e.g. 'tanker', 'stalker')
//   powerType       — 'primary' | 'secondary' | 'epic' | 'pool' | …
//   effectArea      — 'SingleTarget' | 'AoE' | 'Cone' | 'Location' | 'Character'
//   range           — power range in feet (0 for melee/self)
// Output: list of IOSetCategory values, deduped + alphabetized for stable diffs.
// ============================================================================

// Boost types that map 1:1 to a single IOSetCategory (no context needed).
const BOOST_TO_CATEGORY = {
  Buff_Defense: 'Defense Sets',
  Defense: 'Defense Sets',
  Res_Damage: 'Resist Damage',
  Resistance: 'Resist Damage',
  Heal: 'Healing',
  Healing: 'Healing',
  Buff_ToHit: 'To Hit Buff',
  ToHit: 'To Hit Buff',
  Debuff_ToHit: 'To Hit Debuff',
  Debuff_Defense: 'Defense Debuff',
  Hold: 'Holds',
  Stun: 'Stuns',
  Confuse: 'Confuse',
  Sleep: 'Sleep',
  Fear: 'Fear',
  Immobilize: 'Immobilize',
  Knockback: 'Knockback',
  Slow: 'Slow Movement',
  Taunt: 'Threat Duration',
  EnduranceModification: 'Endurance Modification',
  Recovery: 'Endurance Modification',
  Endurance_Drain: 'Endurance Modification',
};

// Whether this dataset's boostsets.bin encodes ATO categories in the per-power
// allowed_powers lists. Homecoming and Rebirth do (their export's
// `allowed_set_categories` already carries e.g. "Controller Archetype Sets"),
// so the preferred path below trusts them. Thunderspy's bin does NOT — ZERO of
// its exported powers carry any "Archetype Sets" category — so for it the ATO
// index below supplies each power's own ATO categories, or no Thunderspy
// power would ever accept its ATOs (reported for Illusion Control's holds).
const BINS_OMIT_PER_POWER_ATOS = datasetId === 'thunderspy';

// AT ATO categories, derived from the dataset's own export (SOURCE-1 item 4;
// replaces the hand DAMAGE_ATO_BY_AT/CONTROL_ATO_BY_AT tables): an ATO set is
// any boostsets.json record with an ATO rarity tier, its display category
// comes from the dataset's io-sets extraction (io-sets-raw.ts `type`), and its
// `allowed_powers` list is the game's own statement of which powers slot it —
// the truer source the wrong-AT filter below has always deferred to. Complete
// on every dataset (every ATO set carries a non-empty allowed_powers list,
// Thunderspy and the Primalist form variants included).
const ATO_RARITIES = new Set(['ECATO', 'ECSATO', 'ECATO2', 'ECSATO2']);
let _atoIndexCache = null;
function getAtoIndex() {
  if (_atoIndexCache) return _atoIndexCache;
  const boostsets = JSON.parse(fs.readFileSync(path.join(RAW_DATA_PATH, 'boostsets.json'), 'utf-8'));
  const ioSetsText = fs.readFileSync(datasetPath(datasetId, 'io-sets-raw.ts'), 'utf-8');
  const ioSets = JSON.parse(ioSetsText.slice(ioSetsText.indexOf('= {') + 2, ioSetsText.lastIndexOf(';')));
  const categoriesByPower = new Map(); // lowercased full_name -> Set(category display name)
  const allCategories = new Set();
  for (const record of boostsets) {
    if (!ATO_RARITIES.has(record.rarity)) continue;
    const setId = record.name.toLowerCase().replace(/-/g, '').replace(/__/g, '_');
    const category = ioSets[setId]?.type;
    if (!category) {
      throw new Error(`ATO set ${record.name}: no io-sets-raw entry/type — regenerate io-sets-raw.ts first`);
    }
    allCategories.add(category);
    for (const powerName of record.allowed_powers) {
      const key = powerName.toLowerCase();
      if (!categoriesByPower.has(key)) categoriesByPower.set(key, new Set());
      categoriesByPower.get(key).add(category);
    }
  }
  if (allCategories.size === 0) throw new Error('No ATO sets found in boostsets.json');
  _atoIndexCache = { categoriesByPower, allCategories };
  return _atoIndexCache;
}

/** The AT ATO categories this power's own AT sets actually slot into it. */
function ownAtoCategories(fullName) {
  if (!fullName) return new Set();
  return getAtoIndex().categoriesByPower.get(fullName.toLowerCase()) ?? new Set();
}

function inferAllowedSetCategories(boosts, effectArea, range, powersetHint, hasTeleportAttrib) {
  const cats = new Set();
  const boostSet = new Set(boosts || []);

  // Simple 1:1 mappings
  for (const b of boostSet) {
    if (BOOST_TO_CATEGORY[b]) cats.add(BOOST_TO_CATEGORY[b]);
  }

  // Travel categories — keyed off the bin's movement-boost types. SpeedFlying
  // appears on Fly/Hover, Jump on Combat Jumping/Long Jump, SpeedRunning on
  // Super Speed. Each travel power also accepts Universal Travel sets.
  // Teleport powers don't expose a boost flag (their Range boost is generic),
  // so we use the powersetHint to catch Teleport/Translocation/etc.
  let isTravel = false;
  if (boostSet.has('SpeedFlying') || boostSet.has('Fly')) {
    cats.add('Flight'); isTravel = true;
  }
  if (boostSet.has('Jump')) {
    cats.add('Leaping'); isTravel = true;
  }
  if (boostSet.has('SpeedRunning') || boostSet.has('Run')) {
    cats.add('Running'); isTravel = true;
  }
  // Teleport powers accept Teleport sets (Warp, Blessing of the Zephyr).
  // Detect by Teleport AttribMod in templates (catches Recall Friend, Team
  // Teleport, Translocation, Fold Space, Combat Teleport). For the bare
  // Teleport power — which exposes no AttribMods because the actual teleport
  // is engine-handled — fall back to the powerset name.
  if (hasTeleportAttrib || (powersetHint && /\bteleport(ation)?\b/i.test(powersetHint))) {
    cats.add('Teleport'); isTravel = true;
  }
  if (isTravel) cats.add('Universal Travel');

  // "Accurate" debuff/heal categories: a power that also carries Accuracy
  // alongside a Debuff/Heal boost typically accepts the "Accurate X" set
  // in addition to the plain X set (e.g. Touch of Fear → ToHit Debuff +
  // Accurate ToHit Debuff). Damage boost isn't required — many control
  // powers with secondary -ToHit (foe-target attacks) get this.
  const hasAccuracy = boostSet.has('Accuracy');
  if (hasAccuracy || boostSet.has('Damage')) {
    if (boostSet.has('Debuff_Defense') || boostSet.has('Defense Debuff')) cats.add('Accurate Defense Debuff');
    if (boostSet.has('Debuff_ToHit') || boostSet.has('ToHit Debuff')) cats.add('Accurate To-Hit Debuff');
    if (boostSet.has('Heal') || boostSet.has('Healing')) cats.add('Accurate Healing');
  }

  // Damage is context-sensitive
  if (boostSet.has('Damage')) {
    const hasRange = boostSet.has('Range');
    cats.add('Universal Damage Sets');
    const area = effectArea || 'SingleTarget';
    if (area === 'SingleTarget') {
      if (hasRange) {
        cats.add('Ranged Damage');
        // Sniper attacks: range typically >= 150. Plain ranged caps around 80.
        if (range && range >= 150) cats.add('Sniper Attacks');
      } else {
        cats.add('Melee Damage');
      }
    } else if (area === 'Cone' || area === 'AoE') {
      cats.add(hasRange ? 'Ranged AoE Damage' : 'Melee AoE Damage');
    }
    // Location-targeted attacks (Trip Mine, Caltrops, etc.) typically get
    // Targeted/Ranged AoE Damage. Pet Damage applies to summon powers handled below.
    else if (area === 'Location') {
      cats.add('Ranged AoE Damage');
    }
    // Chain attacks bounce between targets. Ranged chains (Focused Burst,
    // Chain Lightning) accept both Ranged Damage and Targeted AoE (Ranged
    // AoE Damage) sets. Melee chains (Chain Induction) just accept Melee
    // Damage — the chain jump doesn't count as an AoE in slotting rules.
    else if (area === 'Chain') {
      if (hasRange) {
        cats.add('Ranged Damage');
        cats.add('Ranged AoE Damage');
      } else {
        cats.add('Melee Damage');
      }
    }
  }

  // AT ATO categories are NOT inferred here: they come from the boostsets
  // reverse index (`ownAtoCategories`) at both call paths.

  return [...cats].sort();
}


/**
 * Resolve a redirect/power reference name to a file path.
 * The first segment is the category directory (e.g., "Redirects", "Pets", "Villain_Pets").
 * Remaining segments form the powerset/power path within that category.
 *
 * Examples:
 *   "Redirects.Regeneration.Second_Wind_Awake" → ".../powers/redirects/regeneration/second_wind_awake.json"
 *   "Pets.Defender_Archery_Snipe.Ranged_Shot_Normal" → ".../powers/pets/defender_archery_snipe/ranged_shot_normal.json"
 *   "Villain_Pets.Broad_Sword_Assassins_Strike.Assassins_Slash_Stealth" → ".../powers/villain_pets/..."
 */
function resolveRedirectPath(powerName) {
  const parts = powerName.split('.');
  // All segments form the path: Category/Powerset/PowerName
  const filePath = parts.map(p => p.toLowerCase()).join('/') + '.json';
  return path.join(RAW_DATA_PATH, filePath);
}

/**
 * For a redirect-only power (empty base effects + a top-level `redirect` array),
 * load the JSON of its default/unconditional redirect target. Prefers the
 * `Always` condition, else the first non-dead-state target — mirroring the
 * selection `collectRedirectTemplates`/extractEffects already used, so stacking
 * detection sees exactly the templates that produced the effects. Returns the
 * parsed redirect JSON or null.
 */
function loadDefaultRedirectJson(powerJson) {
  if (!powerJson.redirect?.length) return null;
  const def = powerJson.redirect.find(r => r.condition_expression === 'Always')
    || powerJson.redirect.find(r => !(r.condition_expression || '').includes('kHitPoints'))
    || powerJson.redirect[0];
  if (!def?.name) return null;
  const p = resolveRedirectPath(def.name);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return null; }
}

/**
 * True when a resolved redirect JSON carries at least one Self-targeted,
 * RefreshToCount, stack_limit>1 template that classifies as a real buff.
 * This is the narrow signature of the accumulate-per-foe self-buff mechanic
 * (Consume/Devour Psyche) that the base-effects stacking detector can't see —
 * gating the redirect substitution on it keeps ordinary Stack/Replace redirect
 * powers (rezzes, utility) out of the AoE per-target heuristic entirely.
 */
function redirectHasSelfRefreshStacking(redirectJson) {
  const templates = collectTemplatesWithMeta(redirectJson.effects || []);
  return templates.some(({ template: t }) =>
    t.target === 'Self' &&
    t.stack === 'RefreshToCount' &&
    (t.stack_limit || 0) > 1 &&
    classifyTemplateForStacking(t).length > 0
  );
}

/**
 * Some powers redirect to `<AT>_Aux.<Set>.<Power>_AoE`-style refs (Savage
 * Leap, Feral Charge, etc.) — those auxiliary categories aren't in the bin
 * export, but the bin parser rewrites them to `Redirects.<AT>.<Power>` and
 * stores them under `redirects/<at>/<power>.json`. Try the rewrite when a
 * non-Redirects path doesn't exist.
 */
function resolveAuxRedirectPath(powerName) {
  const parts = powerName.split('.');
  if (parts.length !== 3) return null;
  const [category, powerset, powerLeaf] = parts;
  if (!/_Aux$/i.test(category)) return null;

  // Preferred path: the bin exporter writes Aux categories to
  // <category_lower>/<powerset_lower>/<leaf_lower>.json (e.g.
  // dominator_assault_aux/savage_assault/feral_charge_hit.json).
  const auxPath = path.join(
    RAW_DATA_PATH,
    category.toLowerCase(),
    powerset.toLowerCase(),
    powerLeaf.toLowerCase() + '.json',
  );
  if (fs.existsSync(auxPath)) return auxPath;

  // Legacy fallback: some Aux redirects also get rewritten under
  // redirects/<category_minus_aux>/<leaf>.json. Try with and without
  // the _AoE/_Hit suffix.
  const cleanCategory = category.replace(/_Aux$/i, '').toLowerCase();
  const candidates = [
    powerLeaf.toLowerCase(),
    powerLeaf.replace(/_(AoE|Hit|Cone|Patch|Pet)$/i, '').toLowerCase(),
  ];
  for (const leaf of candidates) {
    const filePath = path.join(RAW_DATA_PATH, 'redirects', cleanCategory, leaf + '.json');
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

/**
 * For powers whose main file says effect_area=SingleTarget but actually
 * deliver damage via an Execute_Power redirect (e.g. Savage Leap → leaps
 * to a target then explodes in an AoE), peek at the redirected file's
 * effect_area to decide the *effective* damage delivery.
 *
 * Returns the normalized effective area (e.g. "AoE", "Cone") if the power
 * has a redirect with broader area than its main file, or null when the
 * main file's area should be used as-is.
 */
function inferEffectiveArea(powerJson) {
  // Only relevant when the main power claims SingleTarget but has an
  // Execute_Power redirect. For powers whose own effect_area is already
  // AoE/Cone/Location, no probe needed.
  const mainArea = EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area;
  if (mainArea !== 'SingleTarget') return null;

  const queue = [...(powerJson.effects || [])];
  while (queue.length > 0) {
    const eff = queue.shift();
    for (const t of (eff.templates || [])) {
      const attrib = (t.attribs?.[0] || '').toLowerCase();
      if (attrib !== 'execute_power') continue;
      const powerNames = t.params?.power_names || [];
      for (const pName of powerNames) {
        const isStandardRedirect = pName.toLowerCase().startsWith('redirects.');
        const auxPath = isStandardRedirect ? null : resolveAuxRedirectPath(pName);
        if (!isStandardRedirect && !auxPath) continue;
        const redirectPath = isStandardRedirect ? resolveRedirectPath(pName) : auxPath;
        if (!fs.existsSync(redirectPath)) continue;
        try {
          const redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
          const redirectArea = EFFECT_AREA_MAP[redirectJson.effect_area] ?? redirectJson.effect_area;
          // Only override when the redirect actually broadens the area.
          if (redirectArea && redirectArea !== 'SingleTarget') {
            return redirectArea;
          }
        } catch (_) { /* ignore */ }
      }
    }
    if (eff.child_effects) queue.push(...eff.child_effects);
  }
  return null;
}

// Combat-suppressing events from EVENT_NAME (parser/_enums.py). When an
// AttribMod's Suppress array lists any of these, the buff is suppressed
// during combat (the In-Combat toggle in the planner removes it from totals).
// ActivateAttackClick (the caster clicking an attack) is the ONLY suppress
// event on travel-power speed buffs (Super Speed run, Super Jump jump, Fly
// speed, Afterburner's cap raise: `Suppress ActivateAttackClick 4 Always`) —
// omitting it left every travel buff un-suppressible in combat mode.
const COMBAT_SUPPRESS_EVENTS = new Set([
  'Attacked', 'Damaged', 'MissionObjectClick', 'PseudoPetAttacked',
  'PseudoPetHelped', 'Helped', 'HitByFoe', 'CommandedPet',
  'ActivateAttackClick',
]);

/**
 * Recursively collect templates from effects, following Execute_Power references
 * to redirect files and filtering out dead-state conditionals.
 *
 * @param {Array} effects - Array of effect objects
 * @param {Set} visited - Set of already-visited power names (prevents infinite loops)
 * @param {number} depth - Current recursion depth
 * @returns {Array} - Flat array of all template objects
 */
// A PvE/PvP `enttype` pair is split into `enttype target> critter eq` (PvE) and
// `enttype target> player eq` (PvP) groups, BOTH tagged is_pvp='EITHER', so the
// PVP_ONLY flag never catches the PvP half — this requires clause does. The planner
// has no PvP mode, so the `player eq` variant is always dropped in favor of its PvE
// twin (GAME-DATA-PRINCIPLES §3). SINGLE SOURCE for every collector — base,
// redirect, AND conditional/special. The conditional pipeline used to omit this
// check, so a conditional PvE/PvP pair (Beam Rifle's Disintegrate -regen) kept the
// PvP -3/Ranged_Res_Boolean value instead of the PvE -0.75/Ranged_Ones one.
function isPvpEnttypeVariant(requiresExpression) {
  return /\benttype\s+target>\s+player\s+eq/.test(requiresExpression || '');
}

// DSH6 Phase 0a — stamp the enclosing effect group's context onto each template
// as it is collected. `collectAllTemplates`/`collectTemplatesDeep` return a FLAT
// template list, discarding the group wrapper (is_pvp / chance / ppm /
// requires_expression) that the atomic model needs per record. Same mutate-the-
// template convention as `_tagCombatGated`; first stamp wins (a template object
// can be walked by more than one collector, always under the same group).
function _tagGroupContext(template, effect) {
  if (template._groupPv === undefined) template._groupPv = effect.is_pvp;
  if (template._groupChance === undefined) template._groupChance = effect.chance;
  if (template._groupPpm === undefined) template._groupPpm = effect.ppm;
  if (template._groupRequires === undefined) template._groupRequires = effect.requires_expression;
}

/**
 * Stamp the OWNING power's timing scalars onto templates pulled out of a redirect
 * target's file, so a `magnitude_expression` reading `activatetime power.base>` /
 * `rechargetime power.base>` resolves against the power the AttribMod actually lives
 * on — not the shell that redirected to it.
 *
 * The distinction is real and load-bearing: a snipe shell's `activation_time` mirrors
 * the Quick anim, while its Normal target carries the slow interruptible cast.
 * `penetrating_ray_normal.json` (activation 3.4, recharge 12.0) evaluates
 * `activatetime power.base> 0.70 * rechargetime power.base> 0.04 * + 0.40 +` to 3.26 —
 * confirmed by the same file's non-Expression PvP sibling, a literal scale 3.26 —
 * whereas the Quick file's 1.67 gives 2.049, and ITS sibling is a literal 2.049.
 * Reading the shell's number instead would land on neither.
 *
 * Same mutate-the-template, first-stamp-wins convention as `_tagGroupContext`: a
 * template object can be walked by more than one collector, but it only ever belongs
 * to one power file.
 */
function _stampOwnerScalars(templates, ownerJson) {
  if (!ownerJson) return templates;
  for (const t of templates) {
    if (!t) continue;
    if (t._ownerActivationTime === undefined) t._ownerActivationTime = ownerJson.activation_time;
    if (t._ownerRechargeTime === undefined) t._ownerRechargeTime = ownerJson.recharge_time;
  }
  return templates;
}

function collectTemplatesDeep(effects, visited = new Set(), depth = 0, parentCombatGated = false) {
  const templates = [];
  const MAX_DEPTH = 3;

  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    // Drop the PvP variant of a PvE/PvP `enttype` pair. HC splits many powers
    // into `enttype target> critter eq` (PvE) and `enttype target> player eq`
    // (PvP) groups, both tagged is_pvp='EITHER', so the PVP_ONLY skip above
    // never catches them. Because extractEffects writes single-valued keyed
    // slots (last-write-wins) and the PvP group is emitted last, its scale/
    // table/duration would clobber the correct PvE values (Flash Arrow showed
    // the PvP -0.5/20s ToHit instead of -0.75/60s; Ice Arrow inherited the PvP
    // 10s -Special + a Ranged_Special runSpeed; EMP's -regen took the PvP copy).
    // `continue` drops the whole subtree (child_effects + redirect follows),
    // matching collectInfoRedirectTemplates (~line 1023) and
    // GAME-DATA-PRINCIPLES §3 "prefer PvE". There is no per-power PvP mode in
    // the planner, so PvP-only content is correctly omitted, not surfaced.
    if (isPvpEnttypeVariant(effect.requires_expression)) continue;
    // Skip chance=0 ONLY when the effect carries nothing real — those
    // are proc placeholders the binary leaves around. Effects with
    // chance=0 plus actual templates or child_effects are Tag-gated
    // (e.g. Evasive Maneuvers' "FlightActive" outer Effect, Hypersonic-
    // style conditionals) and would otherwise drop their entire payload
    // — Fly speed / movement control / knockback protection / etc.
    if ((effect.chance === 0 || effect.chance === 0.0)
        && (!effect.templates || effect.templates.length === 0)
        && (!effect.child_effects || effect.child_effects.length === 0)) continue;
    if (effect.tags && effect.tags.includes('Containment')) continue;
    // `Tag "Domination"` groups carry the Dominator inherent's control bonus.
    // Skip them here (like Containment) — `collectConditionalsGrouped` collects
    // them into the shared 'Domination Active' conditional (the same Mechanic
    // Adjuster Rebirth/tspy get from their `kStealth source>` gate), instead of
    // the retired `MezEffect.domination` sub-field. Skipping keeps the bonus
    // template out of the base mez; the untagged base mez template is unaffected.
    if (effect.tags && effect.tags.includes('Domination')) continue;
    // Skip conditional effects that represent archetype inherent mechanics
    // (these are handled separately by the planner's toggle system)
    let combatGated = parentCombatGated;
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      // Dead-state conditionals (rez effects when HP == 0)
      if (req.includes('kHitPoints == 0')) continue;
      // Stalker hidden-state bonus damage (kMeter > 0 = in hide mode)
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      // Scourge/proc-based bonus damage (random chance expressions)
      if (req.includes('rand()')) continue;
      // Out-of-combat gating (pool Stealth, Invisibility) — propagate downward.
      // Use `else` for the conditional-gate skip below: combat-gated effects
      // also match `_isConditionalGate` (non-empty, doesn't end with `!`) and
      // would otherwise be dropped along with all their child_effects, losing
      // the suppressible defense buried in nested PvE/PvP children.
      const outOfCombat = _isOutOfCombatGate(req);
      if (outOfCombat) combatGated = true;
      // Generic positive-state-gate skip — covers Parse6's per-template gates
      // (drowning, Domination boost, etc.). Negated gates pass through as
      // the base case.
      if (!outOfCombat && _isConditionalGate(req)) continue;
    }

    // Collect templates from this level
    if (effect.templates && effect.templates.length > 0) {
      for (const template of effect.templates) {
        const attrib = template.attribs && template.attribs[0] ? template.attribs[0].toLowerCase() : null;

        // Follow Execute_Power references to redirect files (up to MAX_DEPTH).
        // Two redirect shapes are followed: explicit `Redirects.*` paths and
        // `*_Aux.*` paths that the bin parser rewrites under `redirects/`.
        if (attrib === 'execute_power' && depth < MAX_DEPTH) {
          const powerNames = (template.params && template.params.power_names) || [];
          for (const pName of powerNames) {
            const isStandardRedirect = pName.toLowerCase().startsWith('redirects.');
            const auxPath = isStandardRedirect ? null : resolveAuxRedirectPath(pName);
            if (!isStandardRedirect && !auxPath) continue;
            if (visited.has(pName)) continue;
            visited.add(pName);

            const redirectPath = isStandardRedirect ? resolveRedirectPath(pName) : auxPath;
            if (fs.existsSync(redirectPath)) {
              const redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
              if (redirectJson.effects && redirectJson.effects.length > 0) {
                templates.push(..._stampOwnerScalars(collectTemplatesDeep(
                  redirectJson.effects, visited, depth + 1, combatGated
                ), redirectJson));
              }
            }
          }
        } else {
          // Event-gated mods are conditional (see collectAllTemplates).
          if (_hasRequiredEvents(template)) continue;
          if (combatGated) _tagCombatGated(template);
          _tagGroupContext(template, effect);
          templates.push(template);
        }
      }
    }

    // Recurse into child_effects
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectTemplatesDeep(effect.child_effects, visited, depth, combatGated));
    }
  }

  return templates;
}

/**
 * Detect a snipe power's fast-snipe (Quick) variant in its redirect array and
 * extract its damage + cast stats. Returns null if this isn't a snipe-style
 * pattern.
 *
 * Snipes carry two top-level redirects:
 *   1. `Pets.<...>_Quick` with condition `kEngaged Source.Mode? ... Experienced_Marksman ... ||`
 *      — fires while in combat OR while the global Marksman buff is active
 *      (faster cast, lower damage).
 *   2. `Pets.<...>_Normal` with condition `Always` — the charged variant
 *      (slower cast with interrupt window, higher damage).
 *
 * `collectRedirectTemplates` already pulls the Normal variant for the main
 * `damage` field. The Quick variant is exposed via `power.quickSnipe`, which
 * the InfoPanel swaps in when the user has the In-Combat toggle on.
 */
function extractQuickSnipeData(powerJson) {
  if (!powerJson.redirect || powerJson.redirect.length < 2) return null;

  const quickRedirect = powerJson.redirect.find(r => {
    const cond = r.condition_expression || '';
    return cond.includes('kEngaged') || cond.includes('Experienced_Marksman');
  });
  if (!quickRedirect) return null;

  const redirectPath = resolveRedirectPath(quickRedirect.name);
  if (!fs.existsSync(redirectPath)) return null;

  const quickJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
  if (!quickJson.effects || quickJson.effects.length === 0) return null;

  const templates = _stampOwnerScalars(
    collectTemplatesDeep(quickJson.effects, new Set([quickRedirect.name])), quickJson,
  );
  const damage = extractDamage(templates, quickJson);
  if (!damage) return null;

  // Only the fields that change between Normal and Quick. Recharge is
  // identical; range and accuracy generally are too. Cast time and the
  // (now-zero) interrupt are the differentiators.
  const stats = {};
  if (quickJson.activation_time != null) stats.castTime = quickJson.activation_time;
  if (quickJson.range != null && quickJson.range !== 0) stats.range = quickJson.range;

  return {
    stats,
    damage: Array.isArray(damage) ? damage : [damage],
  };
}

/** A redirect that fires while exactly one caster mode is live: `kNovaMode Source.Mode?`. */
const MODE_REDIRECT_CONDITION = /^k(\w+)\s+[Ss]ource\.Mode\?$/;

/**
 * The same redirect negated, one or more times ANDed: the branch that fires while NONE of the
 * power's modes is live. That is the power's own base record, so it needs no variant.
 */
const NO_MODE_REDIRECT_CONDITION =
  /^k\w+\s+[Ss]ource\.Mode\?\s+!(\s+k\w+\s+[Ss]ource\.Mode\?\s+!)*(\s+&&)*$/;

/**
 * Classify one redirect entry's condition. `mode` names the mode that selects it, `default` is
 * the no-mode branch, and `null` means this is not a mode-shaped condition at all.
 */
function classifyModeRedirect(conditionExpression) {
  const expression = (conditionExpression || '').trim();
  if (expression === 'Always') return { kind: 'default' };
  const positive = expression.match(MODE_REDIRECT_CONDITION);
  if (positive) return { kind: 'mode', mode: positive[1] };
  if (NO_MODE_REDIRECT_CONDITION.test(expression)) return { kind: 'default' };
  return null;
}

/**
 * Display fields a mode variant replaces on the base power. The base keeps its identity (name,
 * icon, allowedEnhancements, maxSlots) because the slots live there and every form shares them —
 * only what the power DOES changes with the mode.
 */
const MODE_VARIANT_FIELDS = [
  'stats', 'damage', 'damageTypes', 'effects',
  'shortHelp', 'description', 'effectArea', 'targetType', 'powerType',
];

/**
 * `Disable_All` is stamped on nearly every power (it is how the game blanks the tray), and
 * `ServerTrayOverride` is mode index 0 — the system tray slot, with no gameplay meaning.
 * Neither is a caster state a build can be in, so both are stripped from every mode array.
 */
const MODE_NOISE = new Set(['Disable_All', 'ServerTrayOverride']);
const dropNoiseMode = (m) => m && !MODE_NOISE.has(m);

/**
 * Stamp a power's four game-"mode" arrays (combat states: Kheldian Nova/Dwarf forms, Titan
 * Momentum, Domination, Granite, Swap-Ammo, travel toggles). The exporter resolves the
 * per-server mode registry from attrib_names.bin and stamps three power-level arrays plus a
 * `mode_name` on each Set_Mode template.
 *
 *   setsModes        modes this power ACTIVATES (from Set_Mode `mode_name`).
 *   modesSuspended   modes that SUSPEND this power's own effects (Granite suspends the other
 *                    Stone toggles; forms suspend human toggles).
 *   modesRequired    modes the power needs to be USABLE.
 *   modesDisallowed  modes that make the power UNCASTABLE.
 *
 * Shared by the powerset, pool and epic converters so a power's mode gating does not depend on
 * which tree it was converted through — the pools carry the Kheldian form modes too, and a
 * pool-only omission read as "Hasten is castable in Nova form".
 *
 * Empty arrays are left unset rather than emitted, so the shape matches the rest of the
 * converter and an absent field means "no gating" everywhere.
 */
function assignModes(power, powerJson) {
  const setsModes = [];
  for (const grp of powerJson.effects || []) {
    if (grp?.is_pvp === 'PVP_ONLY') continue; // PvE planner default — PvP-only setters excluded
    for (const t of grp?.templates || []) {
      if (t?.mode_name && (t.attribs || []).includes('Set_Mode') && dropNoiseMode(t.mode_name)) {
        if (!setsModes.includes(t.mode_name)) setsModes.push(t.mode_name);
      }
    }
  }
  if (setsModes.length) power.setsModes = setsModes;
  const modesSuspended = (powerJson.modes_suspended || []).filter(dropNoiseMode);
  if (modesSuspended.length) power.modesSuspended = modesSuspended;
  const modesRequired = (powerJson.modes_required || []).filter(dropNoiseMode);
  if (modesRequired.length) power.modesRequired = modesRequired;
  const modesDisallowed = (powerJson.modes_disallowed || []).filter(dropNoiseMode);
  if (modesDisallowed.length) power.modesDisallowed = modesDisallowed;
}

/**
 * Mode-gated redirect variants: `power.modeVariants[<Mode>]` is what the power becomes while that
 * caster mode is live. The game decides this at activation time through the PowerRedirector, and
 * the binary carries the whole table — a Kheldian attack in Nova form, a Titan Weapons attack under
 * Momentum, Seismic Blast under Seismic Power all read the same way.
 *
 * Each variant is converted by `convertPower`, so it carries the same atoms, bag and stat
 * treatment as any other power rather than a parallel extraction.
 *
 * Returns null when the power has no mode-gated redirect. A power whose redirect set mixes mode
 * conditions with ones this cannot read (a distance test, a target test, a second mode ANDed in)
 * yields null WITH a warning: which branch is the default depends on conditions we cannot
 * evaluate, so half a table would be worse than none.
 */
function extractModeVariants(powerJson, archetypeId, powerType) {
  const entries = powerJson.redirect || [];
  const classified = entries.map((entry) => ({ entry, kind: classifyModeRedirect(entry.condition_expression) }));
  if (!classified.some((c) => c.kind?.kind === 'mode')) return null;

  const unreadable = classified.filter((c) => !c.kind);
  if (unreadable.length) {
    console.warn(
      `  [mode-variants] ${powerJson.name}: mode redirect skipped — unreadable condition(s): ` +
        unreadable.map((c) => JSON.stringify(c.entry.condition_expression)).join(', '),
    );
    return null;
  }

  const variants = {};
  for (const { entry, kind } of classified) {
    if (kind.kind !== 'mode') continue;
    const variantPath = resolveRedirectPath(entry.name);
    if (!fs.existsSync(variantPath)) {
      console.warn(`  [mode-variants] ${powerJson.name}: ${entry.name} has no exported record`);
      continue;
    }
    const variantJson = JSON.parse(fs.readFileSync(variantPath, 'utf-8'));
    // A variant record redirects no further (verified across all three forks); the guard keeps a
    // future data drop from recursing rather than discovering it as a stack overflow.
    if (variantJson.redirect?.length) delete variantJson.redirect;
    const converted = convertPower(variantJson, 1, archetypeId, powerType);
    const variant = { internalName: converted.internalName };
    for (const field of MODE_VARIANT_FIELDS) {
      if (converted[field] !== undefined) variant[field] = converted[field];
    }
    variants[kind.mode] = variant;
  }
  return Object.keys(variants).length ? variants : null;
}

/**
 * Assassin's Strike (every Stalker primary's AS) delivers all its damage through
 * a redirect whose targets gate damage on `kMeter` (Hide state): Hidden
 * (`kMeter >= .9`) does the big "Assassination" hit, not-hidden (`kMeter < .9`)
 * the normal hit. `collectTemplatesDeep` deliberately skips `kMeter` groups (the
 * Stalker hidden-state bonus), so the normal path extracts NO damage at all —
 * AS reads as 0 damage everywhere.
 *
 * Pull the NOT-HIDDEN branch as the base damage: that's the sustained hit, and
 * the Hidden guaranteed-crit is layered on at calc time by the assassination AT
 * mechanic — exactly like the `InherentDamage` entries the damage calc filters
 * out (damage.ts: "Stalker assassinations … added separately").
 *
 * Also derive the from-Hide bonus. The Hidden branch carries its own visible
 * Melee damage PLUS a much larger `Melee_InherentDamage` entry (the
 * "Assassination" hit). The generic assassination mechanic only models a normal
 * crit (+100%); the real from-Hide multiplier is bigger and per-power. Express
 * it as a ratio over the displayed (not-hidden) base:
 *   fromHideBonus = (hiddenVisible + hiddenInherent) / notHiddenVisible − 1
 * The ratio is enhancement-invariant (both sides scale by the same AT-scale ×
 * (1+enh)), and applying it to the displayed base reconstructs the exact from-
 * Hide total — the not-hidden base cancels, so the lower hidden visible split is
 * absorbed into the bonus. PvE tables only (the planner is PvE-focused).
 *
 * Returns `{ damage: ScaledDamageEntry[], fromHideBonus: number|null }`, or null
 * when this isn't an AS-pattern (kMeter redirect). Scoped to the kMeter-redirect
 * shape, so inline-kMeter powers (Arachnos Soldiers' attacks have no redirect)
 * are untouched.
 */
function extractAssassinStrikeDamage(powerJson) {
  // Two data shapes hold the kMeter (Hide) branches:
  //   1. Homecoming — a `kMeter` redirect to a *_Stealth target that carries
  //      both branches (walk that target's effects).
  //   2. Rebirth — no redirect; the branches are inline on the power itself.
  // Shape 2 is gated on the Assassin's Strike name so unrelated inline-kMeter
  // powers (Arachnos/critter attacks) are untouched.
  let sourceEffects = null;
  // The power these templates belong to, for `power.base>` reads in a
  // magnitude_expression — the *_Stealth redirect target in shape 1, the power
  // itself in shape 2.
  let sourceJson = powerJson;
  const hasKMeterRedirect = Array.isArray(powerJson.redirect) &&
    powerJson.redirect.some(r => (r.condition_expression || '').includes('kMeter'));
  if (hasKMeterRedirect) {
    const stealth = powerJson.redirect.find(r => r.condition_expression === 'Always');
    if (!stealth) return null;
    const stealthPath = resolveRedirectPath(stealth.name);
    if (!fs.existsSync(stealthPath)) return null;
    sourceJson = JSON.parse(fs.readFileSync(stealthPath, 'utf-8'));
    sourceEffects = sourceJson.effects;
  } else if (/^assassins?_/i.test(powerJson.name || '')) {
    sourceEffects = powerJson.effects;
  } else {
    return null;
  }

  // Split templates into three buckets by their kMeter gate:
  //   always   — ungated, applies in both states (some sets keep the base here)
  //   notHidden — kMeter < .9 (the mid-combat hit)
  //   hidden    — kMeter >= .9 (the from-Hide "Assassination" hit)
  const always = [];
  const notHidden = [];
  const hidden = [];
  const walk = (effects, branch) => {
    for (const e of effects || []) {
      if (e.is_pvp === 'PVP_ONLY') continue;
      let b = branch;
      const req = e.requires_expression || '';
      if (req.includes('kMeter')) {
        if (req.includes('>=') || /> 0(\b|\s)/.test(req)) b = 'hidden';
        else if (req.includes('<')) b = 'nothidden';
      }
      if (Array.isArray(e.templates)) {
        if (b === 'hidden') hidden.push(...e.templates);
        else if (b === 'nothidden') notHidden.push(...e.templates);
        else always.push(...e.templates);
      }
      walk(e.child_effects, b);
    }
  };
  walk(sourceEffects, null);

  // Base (mid-combat) damage = the not-hidden branch, when present. Some sets
  // (e.g. Sonic Melee) keep the base ungated and surface it via the normal
  // path instead — there the caller already has power.damage, and we only add
  // the from-Hide bonus below.
  const damage = notHidden.length > 0 ? extractDamage(notHidden, sourceJson) : null;

  // Derive the from-Hide bonus from the branches' PvE damage scales:
  //   notHiddenTotal = visible(always) + visible(notHidden)
  //   fromHideTotal  = visible(always) + visible(hidden) + inherent(hidden)
  //   bonus          = fromHideTotal / notHiddenTotal − 1
  // The always branch is shared across states; the not-hidden InherentDamage
  // (a chance-based mid-combat crit) is excluded, while the hidden branch's
  // InherentDamage (the guaranteed Assassination hit) is included. The ratio is
  // enhancement-invariant. PvE tables only.
  const pveDamage = (templates) => {
    const d = extractDamage(templates, sourceJson) || [];
    return (Array.isArray(d) ? d : [d]).filter((e) => e && !/pvp/i.test(e.table || ''));
  };
  const sumVisible = (d) => d.filter((e) => !/inherentdamage/i.test(e.table || ''))
    .reduce((s, e) => s + (e.scale || 0), 0);
  const sumInherent = (d) => d.filter((e) => /inherentdamage/i.test(e.table || ''))
    .reduce((s, e) => s + (e.scale || 0), 0);

  const alwaysVisible = sumVisible(pveDamage(always));
  const notHiddenVisible = sumVisible(pveDamage(notHidden));
  const hiddenPve = pveDamage(hidden);
  const hiddenTotal = sumVisible(hiddenPve) + sumInherent(hiddenPve);

  const notHiddenTotal = alwaysVisible + notHiddenVisible;
  const fromHideTotal = alwaysVisible + hiddenTotal;

  let fromHideBonus = null;
  if (notHiddenTotal > 0 && fromHideTotal > notHiddenTotal) {
    fromHideBonus = fromHideTotal / notHiddenTotal - 1;
  }
  if (!damage && fromHideBonus == null) return null;
  return { damage, fromHideBonus };
}

/**
 * A snipe's BASE (not-in-combat) timing lives on its Normal redirect target, not
 * on the redirect shell. The shell's `activation_time` mirrors the Quick anim
 * (~1.67s), so reading it makes the slotted snipe look instant even when slow.
 * The Normal variant carries the real interruptible cast (Ranged Shot: 3.67s
 * activation, 2.0s interrupt). Returns `{ castTime, interruptTime }` from the
 * Normal target, or null when this isn't a two-redirect snipe.
 */
function extractSnipeBaseTiming(powerJson) {
  if (!powerJson.redirect || powerJson.redirect.length < 2) return null;
  const isQuick = (r) => {
    const cond = r.condition_expression || '';
    return cond.includes('kEngaged') || cond.includes('Experienced_Marksman');
  };
  if (!powerJson.redirect.some(isQuick)) return null; // not a snipe pattern
  const normal = powerJson.redirect.find((r) => !isQuick(r));
  if (!normal) return null;
  const normalPath = resolveRedirectPath(normal.name);
  if (!fs.existsSync(normalPath)) return null;
  const normalJson = JSON.parse(fs.readFileSync(normalPath, 'utf-8'));
  const out = {};
  if (normalJson.activation_time != null) out.castTime = normalJson.activation_time;
  if (normalJson.interrupt_time) out.interruptTime = normalJson.interrupt_time;
  if (normalJson.time_to_root != null && normalJson.time_to_root !== normalJson.activation_time) {
    out.timeToRoot = normalJson.time_to_root;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Assassin's Strike's displayed (base) cast is its slow, interruptible from-Hide
 * animation (~3s + 2s interrupt — the iconic alpha strike). But fired mid-combat
 * it uses a much faster Quick animation (the `kMeter < .9` redirect target,
 * ~0.67–1.77s depending on set). Pull that Quick activation so the attack-chain
 * builder can default AS to its fast mid-combat form and reserve the slow form
 * for the from-Hide opener / post-Placate. Returns the Quick cast (seconds) or
 * null when this isn't a two-redirect AS (e.g. Rebirth's single-form AS).
 */
function extractAssassinStrikeFastCast(powerJson) {
  if (!Array.isArray(powerJson.redirect)) return null;
  const quick = powerJson.redirect.find((r) => {
    const cond = r.condition_expression || '';
    return cond.includes('kMeter') && cond.includes('<');
  });
  if (!quick) return null;
  const quickPath = resolveRedirectPath(quick.name);
  if (!fs.existsSync(quickPath)) return null;
  const quickJson = JSON.parse(fs.readFileSync(quickPath, 'utf-8'));
  return quickJson.activation_time != null ? quickJson.activation_time : null;
}

/**
 * Collect templates from a power's redirect chain.
 * Follows the "Always" condition redirect and any Execute_Power references within,
 * filtering out dead-state conditionals.
 *
 * @param {Object} powerJson - The raw power JSON object
 * @returns {Array} - Flat array of template objects from the redirect chain
 */
function collectRedirectTemplates(powerJson) {
  if (!powerJson.redirect || powerJson.redirect.length === 0) return [];

  // Find the best redirect to follow:
  // 1. Prefer "Always" condition (default fallback behavior)
  // 2. If no "Always", use the first non-dead-state redirect (normal/base behavior)
  let defaultRedirect = powerJson.redirect.find(
    r => r.condition_expression === 'Always'
  );
  if (!defaultRedirect) {
    // Dead-state exclusion — the CoD2 infix form was 'kHitPoints == 0'; the
    // bin-parser form is RPN tokens ('kHitPoints 0 =='). Match either by
    // checking for the kHitPoints token alone, which is specific enough.
    defaultRedirect = powerJson.redirect.find(
      r => !r.condition_expression.includes('kHitPoints')
    );
  }
  if (!defaultRedirect) return [];

  const redirectPath = resolveRedirectPath(defaultRedirect.name);
  if (!fs.existsSync(redirectPath)) {
    console.warn(`  [redirect] File not found: ${redirectPath}`);
    return [];
  }

  const redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
  if (!redirectJson.effects || redirectJson.effects.length === 0) return [];

  // Collect templates, following Execute_Power references and filtering dead-state conditionals
  return _stampOwnerScalars(
    collectTemplatesDeep(redirectJson.effects, new Set([defaultRedirect.name])), redirectJson,
  );
}

/**
 * A power's BASE template set: its own `effects`, or — when it has none — whatever its
 * redirect chain resolves to (with the `*_Info` display-damage fallback behind it).
 *
 * Shared by all three power converters. It exists as a function because it did NOT used
 * to: this logic lived inline in `convertPower` here, so `convert-pool-powers.cjs` and
 * `convert-epic-pools.cjs` — which run their own shortened pipelines — collected
 * `collectTemplatesDeep(rawJson.effects)` unconditionally and simply produced NOTHING for
 * a redirect-only power. That silently shipped 6 epic snipes (Psionic Lance, LRM Rocket,
 * Frozen Spear, Mace Beam, Zapp, Moonbeam) with **no damage at all**, plus Aid Other /
 * Teleport / Teleport Target with no effects, for as long as those converters have
 * existed. The snipes are the tell that this is a divergence bug and not a data quirk:
 * Blaster Dark Blast's Moonbeam is the SAME redirect-only shape and resolves fine, purely
 * because it happens to be converted by this file.
 *
 * Callers must not reimplement the branch. Following a redirect correctly is not
 * `JSON.parse(target).effects` — the chain carries PvE/PvP `enttype` twins, gated
 * variants, `*_InherentDamage` twins and dead-state conditionals that
 * `collectTemplatesDeep` + `extractDamage` already know how to fold. A hand-rolled
 * follower in a second converter is how this class of bug reproduces.
 *
 * @param {Object} powerJson - raw power JSON
 * @returns {{templates: Array, usedInfoRedirect: boolean}} `usedInfoRedirect` tells the
 *   caller the damage came from a declared `*_Info` display power, so it must skip the
 *   Fiery-Embrace-bonus heuristic (see `_filterFieryEmbraceBonus`).
 */
function collectBaseTemplates(powerJson) {
  if (powerJson.effects?.length) {
    return { templates: collectTemplatesDeep(powerJson.effects), usedInfoRedirect: false };
  }
  if (!powerJson.redirect?.length) return { templates: [], usedInfoRedirect: false };

  // Power has empty effects but redirects to other powers — follow the redirect chain.
  let templates = collectRedirectTemplates(powerJson);
  let usedInfoRedirect = false;
  // If the mechanical redirect carried no real damage (Remote Bomb's Self/Target
  // detonation is just a scale-0 placeholder + the bomb-pet summon), fall back to
  // the `*_Info` display power the game uses to surface the damage numbers.
  if (!extractDamage(templates, powerJson)) {
    const infoTemplates = collectInfoRedirectTemplates(powerJson);
    if (infoTemplates.length > 0) {
      templates = templates.concat(infoTemplates);
      usedInfoRedirect = true;
      console.log(`  [redirect] Used _Info display damage for ${powerJson.display_name}`);
    }
  }
  if (templates.length > 0) {
    console.log(`  [redirect] Resolved ${templates.length} templates from redirect chain for ${powerJson.display_name}`);
  }
  return { templates, usedInfoRedirect };
}

/**
 * Pull damage templates from a power's `*_Info` display redirect.
 *
 * Some pure-redirect powers apply their damage through a summoned pet / multi-stage
 * detonation the planner can't compute, so the game carries the player-facing numbers
 * on a dedicated display power (`<name>_Info` / `<name>_Blaster_Info`, marked
 * `show_in_info` with a never-true `'0'` condition — it never fires mechanically, it
 * exists purely to show the damage). Remote Bomb (Blaster Devices + all Traps ATs) is
 * the case: its Self/Target/detonation redirects carry only a scale-0 placeholder + the
 * bomb-pet summon, while `Remote_Bomb_Blaster_Info` holds the real Fire/Lethal damage.
 * The right info power for the AT is already paired in this power's own redirect list,
 * so just follow it. Gated by the caller on "the mechanical redirect produced no
 * damage," so it only fires for these display-damage shells.
 */
function collectInfoRedirectTemplates(powerJson) {
  if (!powerJson.redirect) return [];
  const infoRedirect = powerJson.redirect.find(
    r => /_Info$/.test(r.name || '') && (r.condition_expression === '0' || r.show_in_info)
  );
  if (!infoRedirect) return [];
  const p = resolveRedirectPath(infoRedirect.name);
  if (!fs.existsSync(p)) return [];
  const j = JSON.parse(fs.readFileSync(p, 'utf-8'));
  if (!j.effects?.length) return [];
  // The info power's damage sits in a group gated `arch source> Class_<AT> eq` — the
  // AT-variant selector. But the info power is ALREADY AT-specific (the per-AT info
  // power is the one paired in THIS power's redirect list — Blaster→_Blaster_Info),
  // so that gate is redundant and would make collectTemplatesDeep drop the whole
  // group. Strip just the arch-class selector (not other gates) before collecting.
  // Also drop the PvP variant of any PvE/PvP `enttype` pair — `enttype target>
  // player eq` is the PvP-only copy (Remote Bomb's KB is split critter/player at
  // 4.0 each; collecting both sums to 8). Prefer PvE, matching the rest of the
  // converter (GAME-DATA-PRINCIPLES §3).
  const clean = (effs) => effs
    .filter(e => !isPvpEnttypeVariant(e.requires_expression))
    .map(e => {
      const c = { ...e };
      if (typeof c.requires_expression === 'string'
          && /\barch\s+source>\s+Class_\w+\s+eq/.test(c.requires_expression)) {
        c.requires_expression = '';
      }
      if (c.child_effects?.length) c.child_effects = clean(c.child_effects);
      return c;
    });
  return _stampOwnerScalars(
    collectTemplatesDeep(clean(j.effects), new Set([infoRedirect.name])), j,
  );
}

// ============================================
// PSEUDO-PET REDIRECT RESOLUTION
// ============================================
// A large class of location/patch/storm powers (Storm Cell, Category Five,
// Freezing Rain, Bonfire, Trip Mine, the Trick-Arrow patches, …) deliver ALL
// of their damage and debuffs through a pseudo-pet that runs a *list* of
// redirect powers (the parent EntCreate's `params.redirects`). The pet's
// entity_def is a generic shell (`PL_StaticObject`, `Pet_NoCollision`, …) with
// no entity file, so there is nothing to look up in PET_ENTITIES — the real
// content lives only in the redirect list. This resolves that list into a
// synthesized, PET_ENTITIES-shaped ability list at convert time so the runtime
// pseudo-pet unify (pet-damage.ts) can surface DoT + enhanceable debuffs, and
// the IgnoreStrength debuffs as informational. See PSEUDO-PET-POWER-RESOLUTION.md.

// attrib → pseudo-pet effect type. Mirrors convert-pet-entities.cjs so the
// synthesized PetEffect.type values match what the runtime already renders.
const PSEUDOPET_MEZ_ATTRIBS = {
  sleep: 'Sleep', held: 'Hold', stunned: 'Stun', terrorized: 'Fear',
  afraid: 'Fear', confused: 'Confuse', immobilized: 'Immobilize',
  knockback: 'Knockback', knockup: 'Knockup', taunt: 'Taunt',
};
const PSEUDOPET_DEBUFF_ATTRIBS = {
  endurance: 'EndDrain', recovery: 'RecoveryDebuff', tohit: 'ToHitDebuff',
  base_defense: 'DefenseDebuff', runningspeed: 'Slow', flyingspeed: 'Slow',
  jumpingspeed: 'Slow', jumpheight: 'Slow',
  // -Recharge is a distinct debuff from movement -Speed (the planner's registry
  // and the in-cell attack bonuses track them separately). Keeping them apart
  // also lets the Tempest→WindSpeed empowered swap show each doubling cleanly
  // (−Rech 7%→14%, −Speed 14%→28%) instead of collapsing to one ambiguous "Slow".
  rechargetime: 'RechargeDebuff',
};
// Ally debuff-RESISTANCE (aspect=Resistance, positive scale) → protection from
// the matching debuff, NOT an offensive debuff. EMP Field grants End-drain and
// recovery/recharge-debuff resistance to friends; without this they'd be read as
// foe -Recovery/-Recharge via PSEUDOPET_DEBUFF_ATTRIBS.
const PSEUDOPET_DEBUFF_RESIST = {
  endurance: 'EndDrainResist', recovery: 'RecoveryDebuffResist',
  regeneration: 'RegenDebuffResist', rechargetime: 'RechargeDebuffResist',
};

/**
 * Classify a single (already deep-collected, AT-deduped, PvP-excluded) template
 * into pseudo-pet effects. Returns an ARRAY of {type, scale?, table?, magnitude?,
 * ignoreStrength?} — one entry per surfaced attrib (ally protection / debuff
 * resistance templates carry several), or [] when the template is not a
 * recognized ally buff / protection / foe mez/debuff.
 *
 * Discriminates enhanceable vs not via the IgnoreStrength flag (GAME-DATA §4):
 * Storm Cell's Tempest debuffs are all IgnoreStrength → informational only;
 * Glue Arrow's slow is not → enhanceable.
 */
function classifyPseudoPetEffect(template) {
  if (!template.attribs || template.attribs.length === 0) return [];
  // Foe-facing only — Self templates are pet self-buffs (ResistAll survivability,
  // self-root immob that keeps a pseudo-pet stationary, etc.).
  if (template.target === 'Self') return [];
  const ignoreStrength = (template.flags || []).includes('IgnoreStrength');
  const scale = template.scale;
  const table = template.table;
  // Prefer PvE: the binary often carries a `*_PvPMez` / `*_PvPDamage` sibling
  // alongside the PvE table, both ungated once `_stripIgnoredClauses` removes
  // the `enttype` clause. The PvE planner shows the PvE variant (GAME-DATA §3).
  if (table && /pvp/i.test(table)) return [];

  const aspectL = (template.aspect || '').toLowerCase();
  const tableL = (table || '').toLowerCase();
  const attribsL = template.attribs.map((a) => (a || '').toLowerCase());
  const a0 = attribsL[0] || '';
  const withScale = (eff) => {
    if (scale && table) { eff.scale = Math.abs(scale); eff.table = table; }
    if (ignoreStrength) eff.ignoreStrength = true;
    return eff;
  };

  // ---- Ally-facing BUFFS & PROTECTION (discriminate by aspect + sign, not
  // attrib name — GAME-DATA §3). Ally auras like EMP Field / Faraday Cage grant
  // a resistance buff, mez/knock protection, and debuff resistance to friends
  // (target=AnyAffected, so they pass the Self check above). The foe-debuff
  // allowlist below would otherwise DROP the +res buff and INVERT the ally
  // protection into offensive Hold/-Recovery. These expand PER attrib so a
  // [Held, Stunned, Sleep] template surfaces all three protections.
  //
  // +Resistance BUFF: aspect=Resistance, POSITIVE scale, damage-type attribs, on
  // a non-debuff table (a −resistance DEBUFF is aspect=Resistance too but negative
  // / on a *_debuff table — kept for the ResistanceDebuff branch).
  if ((scale || 0) > 0 && aspectL === 'resistance' && isDamageTypeAttrib(a0) && !tableL.includes('debuff')) {
    return [withScale({ type: 'ResistanceBuff' })];
  }
  // Debuff RESISTANCE: aspect=Resistance, POSITIVE scale, on a resource/recharge
  // attrib → protection from that debuff, one per attrib.
  if ((scale || 0) > 0 && aspectL === 'resistance') {
    const resists = attribsL.map((a) => PSEUDOPET_DEBUFF_RESIST[a]).filter(Boolean);
    if (resists.length) return resists.map((type) => withScale({ type }));
  }
  // Mez / knock PROTECTION: aspect=Current, NEGATIVE scale, mez/knock attrib is a
  // protection magnitude (reduces incoming control), NOT offensive control. Value
  // is computed scale × table at display time, same as any mez. One per attrib.
  if ((scale || 0) < 0 && aspectL === 'current') {
    const prot = attribsL.filter((a) => PSEUDOPET_MEZ_ATTRIBS[a]);
    if (prot.length) return prot.map((a) => withScale({ type: PSEUDOPET_MEZ_ATTRIBS[a] + 'Protection' }));
  }

  // ---- Foe debuffs (first matching attrib; unchanged) ----
  // Typed resistance / defense debuffs (Tar Patch −res, Disruption/EMP Arrow,
  // Faraday Cage) are a SINGLE template carrying all 8 damage-type (or position)
  // attribs at aspect=Resistance / on a `*_Debuff_Def` table — not in the flat
  // attrib→type map. Discriminate by aspect/table, NOT attrib name (GAME-DATA §3:
  // an aspect=Resistance template using `*_Dmg` attribs is a −resistance debuff,
  // not the player's damage). Check once, before the per-attrib loop.
  {
    const typed = isDamageTypeAttrib(a0) || isDefensePosition(a0);
    const isDebuff = (scale || 0) < 0 || tableL.includes('debuff');
    if (typed && aspectL === 'resistance' && isDebuff) {
      return [withScale({ type: 'ResistanceDebuff' })];
    }
    if (typed && tableL.includes('debuff_def')) {
      return [withScale({ type: 'DefenseDebuff' })];
    }
  }

  for (const a of attribsL) {
    if (!a) continue;

    const mezType = PSEUDOPET_MEZ_ATTRIBS[a];
    if (mezType) {
      const eff = { type: mezType };
      if (template.magnitude && template.magnitude > 0) eff.magnitude = template.magnitude;
      return [withScale(eff)];
    }

    const debuffType = PSEUDOPET_DEBUFF_ATTRIBS[a];
    if (debuffType) {
      // EndDrain only when actually draining (negative scale).
      if (a === 'endurance' && !(scale < 0)) continue;
      // Slow tag rows carry scale ~0 — not a real slow.
      if (debuffType === 'Slow' && Math.abs(scale || 0) < 0.001) continue;
      // Skip the aspect=Maximum movement-speed cap (−max run speed): it's a niche
      // secondary debuff distinct from the regular (Current) movement Slow we
      // surface, and including it makes the Slow value inconsistent (it would win
      // the single Slow slot in some redirects but not others). The Current-aspect
      // movement slow is the representative one.
      if (debuffType === 'Slow' && aspectL === 'maximum') continue;
      return [withScale({ type: debuffType })];
    }
  }
  return [];
}

/**
 * Like collectTemplatesDeep, but returns `{ template, chance, gated }` per leaf —
 * preserving the cumulative group chance and a mode-gate flag the flat collector
 * discards. The binary gates pseudo-pet damage AND effects: storm-strength
 * escalation carries a `chance:0` sentinel (Storm Cell's `Lightning_Proc` /
 * the 33% lightning stun — "only while High Winds is active"), proc lightning a
 * `chance:0.25` group (`Category_Five_Lightning`), base storm `chance:1`. A
 * `chance:0` group is a mode GATE (sets `gated`, keeps the cumulative chance so a
 * within-mode 33% stun survives), not literal 0%. Follows Execute_Power; mirrors
 * collectTemplatesDeep's skips (PvP-only, dead-state, AT-dup gates, empty procs).
 */
function collectTemplatesWithChance(effects, visited = new Set(), depth = 0, cumChance = 1, gated = false) {
  const MAX_DEPTH = 3;
  const out = []; // { template, chance, gated }

  for (const effect of effects || []) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    // chance:0 with NO payload = proc placeholder → skip; WITH payload it's a
    // storm-strength/mode GATE (mirrors collectTemplatesDeep keeping it).
    const hasPayload = (effect.templates && effect.templates.length > 0)
      || (effect.child_effects && effect.child_effects.length > 0);
    if ((effect.chance === 0 || effect.chance === 0.0) && !hasPayload) continue;
    if (effect.tags && effect.tags.includes('Containment')) continue;
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      if (req.includes('kHitPoints == 0')) continue;
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      if (req.includes('rand()')) continue;
      if (_isConditionalGate(req)) continue; // AT-dup / state branch
    }
    // A chance:0 group is a mode-gate SENTINEL, not literal 0% — mark `gated` and
    // keep the cumulative chance (so the within-mode proc rate, e.g. a 33% stun,
    // survives) rather than zeroing it. Real proc chances (0<chance<1) multiply.
    //
    // EXCEPTION: an `IncreaseStormStrength` chance:0 group is a storm-strength
    // ACCUMULATOR, not a mode SUPPRESSOR — its payload (Storm Cell's base lightning
    // aura) always runs (verified in-game: the aura fires continuously from the
    // moment the cell exists, like a Death Shroud / Quills damage aura, not only
    // while "High Winds"). So it must NOT gate its children to conditional; the
    // empowered Strong variant is surfaced separately via poweredUpDamage.
    const isAccumulator = (effect.tags || []).includes('IncreaseStormStrength');
    const raw = (effect.chance === undefined || effect.chance === null) ? 1 : effect.chance;
    const childGated = (raw === 0 && !isAccumulator) ? true : gated;
    const c = raw === 0 ? cumChance : cumChance * raw;

    for (const t of effect.templates || []) {
      const a = t.attribs && t.attribs[0] ? t.attribs[0].toLowerCase() : null;
      // Follow both Execute_Power (params.power_names) and nested Create_Entity
      // (params.redirects) — some powers deliver damage one Create_Entity hop
      // removed (Meteor → creates a "Meteor" entity that runs MeteorHit; Vines →
      // a nested entity running its pulse). The pet self-buff redirect (ResistAll)
      // is skipped. Cycle-guarded + depth-bounded like the Execute_Power follow.
      const followNames = a === 'execute_power'
        ? ((t.params && t.params.power_names) || [])
        : a === 'create_entity'
          ? ((t.params && t.params.redirects) || []).filter(r => !/resistall/i.test(r))
          : null;
      if (followNames && depth < MAX_DEPTH) {
        for (const pName of followNames) {
          if (visited.has(pName)) continue;
          const isStd = pName.toLowerCase().startsWith('redirects.');
          const aux = isStd ? null : resolveAuxRedirectPath(pName);
          const p = isStd ? resolveRedirectPath(pName) : (aux || resolveRedirectPath(pName));
          if (!fs.existsSync(p)) continue;
          visited.add(pName);
          try {
            const j = JSON.parse(fs.readFileSync(p, 'utf-8'));
            const followed = collectTemplatesWithChance(j.effects, visited, depth + 1, c, childGated);
            _stampOwnerScalars(followed.map((r) => r.template), j);
            out.push(...followed);
          } catch { /* unreadable redirect — skip */ }
        }
      } else {
        // Event-gated mods (RequiredEvents tail) are conditional like a
        // chance:0 mode gate — kept in the list so the pseudo-pet path can
        // surface them, but never counted as guaranteed.
        out.push({ template: t, chance: c, gated: childGated || _hasRequiredEvents(t) });
      }
    }
    out.push(...collectTemplatesWithChance(effect.child_effects, visited, depth, c, childGated));
  }
  return out;
}

/**
 * Resolve one EntCreate's redirect list into a synthesized pseudo-pet ability
 * list (PET_ENTITIES `PetAbility[]` shape). Each named redirect becomes one
 * ability carrying its damage[] + effects[]; abilities with neither (pet
 * self-buffs like ResistAll) are dropped. Reuses collectTemplatesDeep (deep
 * Execute_Power following, AT-conditional dedup, PvP exclusion, cycle guard)
 * and extractDamage (Current/Absolute damage, buff/debuff-table exclusion).
 *
 * Damage that lands at < 100% chance (storm-strength gated / proc) is flagged
 * `conditionalDamage` (+ `damageChance`) so the runtime keeps it OUT of the
 * guaranteed headline DoT and surfaces it as a conditional effect instead.
 *
 * @param {string[]} redirectNames - the EntCreate's params.redirects
 * @returns {Array} synthesized PetAbility[]
 */
function resolveSummonRedirects(redirectNames) {
  const abilities = [];
  for (const name of redirectNames || []) {
    const isStandardRedirect = name.toLowerCase().startsWith('redirects.');
    const auxPath = isStandardRedirect ? null : resolveAuxRedirectPath(name);
    const redirectPath = isStandardRedirect ? resolveRedirectPath(name) : (auxPath || resolveRedirectPath(name));
    if (!fs.existsSync(redirectPath)) continue;

    let json;
    try { json = JSON.parse(fs.readFileSync(redirectPath, 'utf-8')); } catch { continue; }
    if (!json.effects || json.effects.length === 0) continue;

    const collected = collectTemplatesWithChance(json.effects, new Set([name]));
    const templates = collected.map(c => c.template);

    // Damage (reuse the converter's damage extractor — Current/Absolute aspects,
    // excludes buff/debuff tables). Normalize to PetAbility damage shape. Gated
    // leaves (a chance:0 mode group like Burn's FieryEmbrace bonus) stay in the
    // array — the armor Burns deliberately surface the FE-active variant
    // (0.14 + 0.063); the gating only governs the conditionalDamage flag below.
    const dmg = extractDamage(templates, json);
    const dmgArr = dmg ? (Array.isArray(dmg) ? dmg : [dmg]) : [];
    // Dedup identical (type, scale, table) hits and drop PvP damage tables.
    // The duplicate is the storm "powered-up" copy: redirects carry the base
    // hit AND an `IncreaseStormStrength`-tagged copy at the same scale; summing
    // them double-counts (we don't model the powered-up state as a separate mode
    // in the prototype). PvP damage tables are excluded for the PvE planner.
    const seenDmg = new Set();
    const damage = [];
    for (const d of dmgArr) {
      if (d.table && /pvp/i.test(d.table)) continue;
      const key = `${d.type}|${d.scale}|${d.table}`;
      if (seenDmg.has(key)) continue;
      seenDmg.add(key);
      damage.push({ damageType: d.type, scale: d.scale, table: d.table });
    }

    // Debuffs / mez — one per type (mirrors convert-pet-entities seenTypes dedup),
    // carrying the proc chance the binary gates them with (e.g. the 33% stun) and
    // a `conditional` flag for mode-gated branches (Storm Cell's lightning effects
    // only apply "while powered up" / High Winds — `gated` via the chance:0 mode
    // sentinel). Prefer a NON-conditional occurrence of a type if one exists.
    const effects = [];
    const seen = new Map(); // type -> index in effects
    for (const { template, chance, gated } of collected) {
      for (const e of classifyPseudoPetEffect(template)) {
        if (chance < 1) e.chance = Math.round(chance * 100) / 100;
        if (gated) e.conditional = true;
        if (!seen.has(e.type)) {
          seen.set(e.type, effects.length);
          effects.push(e);
        } else if (!gated) {
          // An always-on occurrence supersedes a previously-seen gated one.
          const prev = effects[seen.get(e.type)];
          if (prev.conditional) effects[seen.get(e.type)] = e;
        }
      }
    }

    if (damage.length === 0 && effects.length === 0) continue; // ResistAll etc.

    // How often does this redirect's damage actually land? Classify from the
    // per-template chance/gated flags of the damage leaves.
    //  • A redirect with NO always-on hit — every damage leaf is mode-gated
    //    (storm-strength "while High Winds") — has no computable rate ⇒
    //    `conditionalDamage`, surfaced informationally not summed (else Storm
    //    Cell's bogus 1908).
    //  • 0 < chance < 1, not gated → a PROC: the runtime counts EXPECTED value
    //    (chance × per-hit), matching the planner's proc convention.
    //  • chance >= 1 → guaranteed DoT (enhanceable headline damage).
    //
    // CRITICAL: a gated bonus sitting BESIDE an always-on hit (Burn's
    // FieryEmbrace 0.063 beside the base 0.14 DoT; Lightning Rod's FE Fire beside
    // its base Energy) must NOT flip the whole ability to conditionalDamage — that
    // zeroed the guaranteed headline damage entirely (Burn/Lightning Rod showed
    // NOTHING). So conditionalDamage requires that there be no guaranteed damage
    // at all; the gated bonus stays in `damage` as part of the FE-active variant.
    let conditionalDamage = false;
    let damageChance;
    if (damage.length > 0) {
      let maxGuaranteedChance = 0, hasGuaranteed = false, hasGated = false;
      for (const { template, chance, gated } of collected) {
        const a = template.attribs && template.attribs[0] ? template.attribs[0].toLowerCase() : null;
        if (!(a && isDamageTypeAttrib(a) && extractDamage([template], json))) continue;
        if (gated) { hasGated = true; continue; }
        hasGuaranteed = true;
        if (chance > maxGuaranteedChance) maxGuaranteedChance = chance;
      }
      if (!hasGuaranteed && hasGated) conditionalDamage = true;
      else if (hasGuaranteed && maxGuaranteedChance < 1) damageChance = Math.round(maxGuaranteedChance * 100) / 100;
    }

    abilities.push({
      name: json.name,
      displayName: json.display_name || json.name,
      type: json.type,
      damage,
      ...(conditionalDamage ? { conditionalDamage: true } : {}),
      ...(damageChance !== undefined ? { damageChance } : {}),
      ...(effects.length > 0 ? { effects } : {}),
      recharge: json.recharge_time || 0,
      castTime: json.activation_time || 0,
      ...(json.activate_period > 0 ? { activatePeriod: json.activate_period } : {}),
      ...(json.effect_area ? { effectArea: json.effect_area } : {}),
      ...(json.radius > 0 ? { radius: json.radius } : {}),
      ...(json.max_targets_hit > 0 ? { maxTargets: json.max_targets_hit } : {}),
    });
  }

  // Empowered "High Winds" variants: Storm Cell's Tempest debuffs upgrade to the
  // WindSpeed values (~2×) while the storm is powered up. WindSpeed isn't in the
  // summon graph (it's triggered by Storm Blast attacks in the cell), so link it
  // explicitly and attach as the base ability's `poweredUpEffects`; the runtime
  // swaps to these when the "Storm Cell Active" toggle is on.
  for (const ab of abilities) {
    const variant = POWERED_UP_VARIANT[ab.name];
    if (!variant) continue;
    const vp = resolveRedirectPath(variant);
    if (!fs.existsSync(vp)) continue;
    let vjson;
    try { vjson = JSON.parse(fs.readFileSync(vp, 'utf-8')); } catch { continue; }
    const vCollected = collectTemplatesWithChance(vjson.effects, new Set([variant]));

    // Damage escalation (the Strong lightning). Mirror the main damage dedup:
    // Current/Absolute aspects, drop PvP tables (inherent is runtime-skipped).
    const vDmg = extractDamage(vCollected.map(c => c.template), vjson);
    const vDmgArr = vDmg ? (Array.isArray(vDmg) ? vDmg : [vDmg]) : [];
    const vSeenDmg = new Set();
    const vDamage = [];
    for (const d of vDmgArr) {
      if (d.table && /pvp/i.test(d.table)) continue;
      const key = `${d.type}|${d.scale}|${d.table}`;
      if (vSeenDmg.has(key)) continue;
      vSeenDmg.add(key);
      vDamage.push({ damageType: d.type, scale: d.scale, table: d.table });
    }

    if (vDamage.length > 0) {
      // A damage-bearing variant is a DAMAGE escalation (Lightning_Proc →
      // StormCell_LightningAura): swap the ability's damage when powered up and
      // leave its already-verified conditional effects (33% stun, etc.) alone.
      ab.poweredUpDamage = vDamage;
    } else {
      // A debuff-only variant is an EFFECT escalation (Tempest → WindSpeed).
      const vEffects = [];
      const vSeen = new Set();
      for (const { template, chance } of vCollected) {
        for (const e of classifyPseudoPetEffect(template)) {
          if (vSeen.has(e.type)) continue;
          vSeen.add(e.type);
          if (chance < 1) e.chance = Math.round(chance * 100) / 100;
          vEffects.push(e);
        }
      }
      if (vEffects.length > 0) ab.poweredUpEffects = vEffects;
    }
  }

  return abilities;
}

// Powered-up ("High Winds") variant of a pseudo-pet ability — the empowered
// debuff redirect that replaces the base one while the storm is at full strength.
// Storm-Cell-specific link (the variant isn't reachable from the summon graph).
const POWERED_UP_VARIANT = {
  StormCell_Tempest: 'Redirects.Storm_Blast.StormCell_WindSpeed',
  StormCell_Tempest_Sentinel: 'Redirects.Storm_Blast.StormCell_WindSpeed_Sentinel',
  // Storm-strength escalation for the lightning: the cell's base aura
  // (Lightning_Proc → StormCell_LightningAura2, Energy 0.5) becomes the "Strong
  // Storm Cell Lightning" (StormCell_LightningAura, Energy 1.0 ≈ 2×) once storm
  // strength builds from attacking in the cell — exactly what the in-game combat
  // log shows (base aura 20.81 → strong 41.62 at lvl 50). Surfaced as the
  // Lightning_Proc ability's powered-up DAMAGE so the "Storm Cell Active" toggle
  // escalates the lightning the same way it escalates the Tempest debuffs to
  // WindSpeed. One redirect covers every AT (its Sentinel-crit branch is internal).
  Lightning_Proc: 'Redirects.Storm_Blast.StormCell_LightningAura',
};

// "Ignited" variant of a summoned pet entity — a SEPARATE PET_ENTITIES entity
// created when the base patch is triggered (Oil Slick Arrow: the inert oil slick
// `Pets_OilSlickOil` becomes the burning damage patch `Pets_OilSlickBurn` when
// ignited by a fire/energy power). The burn entity isn't in the summon graph
// (the igniting power spawns it), so link it explicitly. Surfaced as a
// conditional ("Oil Slick Ignited") entity whose enhanceable Fire damage folds
// into the totals when the toggle is on. Keyed by the resolved (priority_list)
// entity name; covers the AT variants.
const IGNITED_ENTITY_VARIANT = {
  Pets_OilSlickOil: 'Pets_OilSlickBurn',
  Pets_OilSlickOil_Blaster: 'Pets_OilSlickBurn_Blaster',
  Pets_OilSlickOil_Corruptor: 'Pets_OilSlickBurn_Corruptor',
};

// Generic location-shell entity_defs that are NOT backed by a PET_ENTITIES
// record — their content lives entirely in the EntCreate redirect list. Scoped
// deliberately to the pure-location markers verified absent from PET_ENTITIES;
// this keeps resolution double-count-safe (it never overlaps a real pet entity
// whose damage the existing PET_ENTITIES path already computes). Generalization
// to named-after-power shells (Sleet/Meteor/Vines) and the PET_ENTITIES-overlap
// cases (Bonfire/Burn/Rain of Fire) is a follow-up — see
// PSEUDO-PET-POWER-RESOLUTION.md.
const PSEUDOPET_SHELL_ENTITIES = new Set([
  'PL_StaticObject', 'PL_FightPreferMelee', 'Pet_NoCollision',
  'PL_Untargetable_FightPreferRanged',
  // Named shells: same shape (generic entity_def + redirects carrying the real
  // content), just named after the power/class. Verified absent from PET_ENTITIES
  // (no `Pets_Meteor`/`Pets_Vines`/`Pets_Mine`/`Pets_Class_Minion_Pets`), so
  // resolving them is double-count-safe. Covers Meteor, Vines, Trip Mine (Arsenal),
  // Sleep Grenade, Smoke Canister/Grenade, Geode.
  'Meteor', 'Vines', 'Mine', 'Class_Minion_Pets',
]);

function _parseDurationSeconds(str) {
  if (typeof str !== 'string') return undefined;
  const m = str.match(/([\d.]+)\s*seconds?/i);
  return m ? parseFloat(m[1]) : undefined;
}

/**
 * Walk a raw power's effect tree for every EntCreate AttribMod whose summoned
 * entity is a generic location shell, resolve each one's redirect list into a
 * synthesized ability list, and attach them as `summon.resolvedEntities`.
 *
 * Distinguishes pseudo-pets by effective-entity + redirect-list signature so a
 * power that summons two DIFFERENT shells (Category Five's 20s storm + 17s
 * lightning "Eye") keeps BOTH — fixing the EntCreate collapse where the
 * converter treated a repeated entity_def as one pet with entityCount=2 and
 * dropped the second redirect list. Identical lists (true multi-copy summons)
 * collapse to a count.
 *
 * Resolution must see exactly what the runtime sees, so it matches the main
 * summon builder on two points it previously missed:
 *  - **activation_effects.** Some patches put the EntCreate there, not in
 *    `effects` (Burn's flame patch). Walk both arrays.
 *  - **Absent / P-hash entity_def.** When entity_def is null or an opaque
 *    P-hash, the real shell name lives in `priority_list` (Freezing Rain /
 *    Sleet / Sentinel Rain of Fire → PL_StaticObject, Voltaic Sentinel →
 *    PL_Untargetable_FightPreferRanged). Resolve the effective entity the same
 *    way before testing it against the shell set.
 *
 * Double-count-safe by construction: a shell is only resolved when the effective
 * entity is in PSEUDOPET_SHELL_ENTITIES, which are verified absent from
 * PET_ENTITIES — so powers whose P-hash resolves to a real pet (non-Sentinel
 * Rain of Fire → Pets_RainofFire, Bonfire → Pets_Bonfire, Liquefy → Pets_Liquefy)
 * are NOT matched here and keep the existing pet-damage path untouched.
 *
 * One exception: a real-pet chassis whose content is delivered by an EXTERNAL
 * Redirects.* override (Burn → entity_def "Burn" but runs Redirects.Fiery_Aura.Burn)
 * IS resolved here, and its chassis is then normalized off the pet-damage path so
 * the stale intrinsic damage isn't double-counted. Intrinsic redirects that name
 * the chassis's own power (Bonfire → Pets.Bonfire.Bonfire) are left alone.
 */
/**
 * Correct multi-pet summon COUNTS from the EntCreate template list.
 *
 * The flat EntCreate handler counts one pet per template, which is wrong for two
 * shapes (HOMECOMING_PARSER "Pseudo-pet summon residuals"):
 *
 *  1. **Mutually-exclusive FX-variant groups** — Phantom Army ("Decoy") carries
 *     its 3 staggered decoys in TWO effect groups with complementary requires
 *     (`@CustomFX … ||` and the same `… || !`): a visual branch, only one fires.
 *     The handler counts both → 6 decoys instead of 3. Drop the negated branch.
 *  2. **Cosmetic pose variants + chance-weighted spawns** — Gang War's gang is 13
 *     `Pets_Thug_Pose_01..09` (the same Thug, different costume poses) firing at
 *     decreasing chances (1.0×6, .75×2, .5×2, .25, .10×2). Collapse the
 *     `_Pose_NN` variants to one entity and count the chance-weighted expected
 *     value (≈9), matching the planner's expected-value proc convention. Gang
 *     War's EntCreates also live in `activation_effects` with `IgnoreStrength`,
 *     so the buff-oriented drop filter discards them and the summon is missing
 *     entirely — rebuilt here from powerJson.
 *
 * Scoped to be rain-safe: only complementary-FX groups, `_Pose_NN` variants, and
 * dropped multi-template summons are touched. Rains / location pseudo-pets (Rain
 * of Arrows, Whirlpool — a single rain represented as P-hash + named) have none
 * of these patterns, so they are left exactly as the existing path produced them.
 * Single-template summons (incl. attacks' incidental EntCreates like Necromancy
 * Dark Blast → a specter, or Thugs Pistols → a pose) are below the 2-instance
 * threshold and untouched. The P-hash→named display merge fires only when the
 * named base appears ≥2× (Phantom Army decoys, Fire Imps) — never on the
 * ambiguous 1+1 shape (Gremlins, rains), so counts that were already correct
 * (Gremlins 2, Fire Imps 3 — the P-hash was just an unresolved display entity)
 * are preserved.
 */
const _PHASH_RE = /^P\d+$/;
const _POSE_RE = /^(.+)_Pose_(\d+)$/;

function _complementaryReq(a, b) {
  const x = (a || '').trim(), y = (b || '').trim();
  return x !== '' && (x === `${y} !` || y === `${x} !`);
}

function normalizeSummonEntities(powerJson, effects) {
  if (!effects) return;
  // Collect EntCreate instances with group context. Mirror the main builder's
  // target rules: main `effects` use any target (Phantom Army decoys are
  // AnyAffected); `activation_effects` use Self only (matches the buff path).
  const insts = [];
  const collect = (groups, selfOnly) => {
    const visit = (g) => {
      if (g.is_pvp === 'PVP_ONLY') return;
      const chance = typeof g.chance === 'number' ? g.chance : 1;
      const req = (g.requires_expression || '').trim();
      for (const t of (g.templates || [])) {
        if (!(t.attribs || []).includes('Create_Entity')) continue;
        if (!t.params || t.params.type !== 'EntCreate' || !t.params.entity_def) continue;
        if (selfOnly && t.target !== 'Self') continue;
        insts.push({
          entity: t.params.entity_def, chance, req,
          duration: _parseDurationSeconds(t.duration),
          flags: t.flags || [],
        });
      }
      for (const c of (g.child_effects || [])) visit(c);
    };
    for (const g of (groups || [])) visit(g);
  };
  collect(powerJson.effects, false);
  collect(powerJson.activation_effects, true);

  if (insts.length < 2) return;                       // single summons / attack incidentals
  if (insts.every(i => PSEUDOPET_SHELL_ENTITIES.has(i.entity))) return;  // pseudo-pet path

  // Strict scoping: only the two genuine count bugs trigger a rewrite —
  //   - complementary FX-variant groups (Phantom Army's @CustomFX Mirror branch
  //     double-counts the gang), and
  //   - cosmetic `_Pose_NN` variants (Gang War's 13 thug poses).
  // Every other multi-template summon (MM henchmen with level/tier gating —
  // Battle Drones, Soul Extraction, Call Thugs, …) is left EXACTLY as the
  // existing handler produced it. Recounting those here would mis-model their
  // level-gated / tier-conditional counts (e.g. Soul Extraction summons ONE
  // tier-matched ghost, not all three) — the "make it worse" trap.
  const reqs = [...new Set(insts.map(i => i.req))];
  const dropReqs = new Set();
  for (let i = 0; i < reqs.length; i++)
    for (let j = i + 1; j < reqs.length; j++)
      if (_complementaryReq(reqs[i], reqs[j]))
        dropReqs.add(reqs[i].endsWith('!') ? reqs[i] : reqs[j]);
  const fxApplied = dropReqs.size > 0;
  const hasPoses = insts.some(i => _POSE_RE.test(i.entity));
  if (!fxApplied && !hasPoses) return;                // no bug pattern → no-op
  // A dropped summon is only safe to REBUILD when we can collapse it correctly
  // (poses). A dropped non-pose summon (Soul Extraction's tier ghosts) stays
  // dropped — its correct count isn't derivable from template counting.
  if (!effects.summon && !hasPoses) return;

  // (1) FX-variant dedup: drop the negated branch of any complementary req pair.
  let kept = dropReqs.size ? insts.filter(i => !dropReqs.has(i.req)) : insts;
  if (!kept.length) kept = insts;

  // (2) pose-collapse: map X_Pose_NN to the lowest-numbered pose present.
  const poseRep = {};
  for (const i of kept) {
    const m = i.entity.match(_POSE_RE);
    if (!m) continue;
    const base = m[1], n = parseInt(m[2], 10);
    if (!(base in poseRep) || n < poseRep[base].n) poseRep[base] = { n, name: i.entity };
  }
  const resolvePose = (e) => {
    const m = e.match(_POSE_RE);
    return m ? poseRep[m[1]].name : e;
  };

  // (3) P-hash→named display merge — only when exactly one named base that
  // appears ≥2× (proves a genuine multi-of-same summon, not a 1+1 rain).
  const resolved = kept.map(i => ({ ...i, base: resolvePose(i.entity) }));
  const namedCounts = {};
  for (const r of resolved) if (!_PHASH_RE.test(r.base)) namedCounts[r.base] = (namedCounts[r.base] || 0) + 1;
  const namedBases = Object.keys(namedCounts);
  const mergeTarget = (namedBases.length === 1 && namedCounts[namedBases[0]] >= 2) ? namedBases[0] : null;
  const identity = (b) => (mergeTarget && _PHASH_RE.test(b)) ? mergeTarget : b;

  // (4) chance-weighted expected count per resolved identity.
  const counts = {};
  for (const r of resolved) {
    const id = identity(r.base);
    counts[id] = (counts[id] || 0) + r.chance;
  }
  const entities = Object.entries(counts).map(([entity, sum]) => ({
    entity, count: Math.max(1, Math.round(sum)),
  }));

  // Build the corrected entity descriptor (single vs multi).
  const apply = (summon) => {
    delete summon.entity; delete summon.entityCount; delete summon.entities;
    delete summon._phashPriorityList;
    if (entities.length === 1) {
      summon.entity = entities[0].entity;
      if (entities[0].count > 1) summon.entityCount = entities[0].count;
    } else {
      summon.entities = entities;
    }
  };

  if (effects.summon) {
    apply(effects.summon);
  } else {
    // Dropped pure-summon (Gang War): build the summon from scratch.
    const first = kept[0];
    const summon = { isPseudoPet: first.flags.some(f => f.includes('PseudoPet')) };
    apply(summon);
    const dur = kept.map(i => i.duration).find(d => d && d > 0);
    if (dur) summon.duration = dur;
    if (kept.some(i => i.flags.some(f => f.includes('CopyBoosts')))) summon.copyBoosts = true;
    effects.summon = summon;
  }
}

/**
 * Resolve a P-hash entity that IS one of its named siblings, and merge the count.
 *
 * Fire Imps / Gremlins summon their FIRST pet through an opaque P-hash entity_def
 * (`P1757360070`, delay 0) and the rest through the named entity directly
 * (`Pets_FireImp_Controller`, delay 1/3). The multi-entity builder keys on the raw
 * entity_def, so the P-hash never merges and the planner shows a garbage
 * "P1757360070 ×1" entity alongside the real imps (count was right, identity wasn't).
 *
 * The P-hash's OWN `priority_list` is the ground-truth resolution: Fire Imps'
 * `P1757360070.priority_list === "Pets_FireImp_Controller"` — the same name as its
 * siblings → they are the same pet, merge. This is the discriminator that makes the
 * merge rain-safe: Rain of Arrows' `P4047293352.priority_list === "Pets_RainofArrows_
 * Visual"`, which is NOT its sibling `Pets_RainofArrows` (a visual vs the static
 * object) → no match → left exactly as before, no double-count.
 *
 * Runs AFTER normalizeSummonEntities, which owns the FX-variant / pose count bugs
 * (Phantom Army, Gang War) and rewrites those to a single `entity` form — so by the
 * time this sees an `entities[]` array, it's the genuine multi-type case.
 */
function resolvePhashSiblings(powerJson, effects) {
  const summon = effects && effects.summon;
  if (!summon || !summon.entities || summon.entities.length < 2) return;

  // entity_def -> priority_list, harvested from every EntCreate in the raw power.
  const plOf = {};
  const collect = (groups) => {
    for (const g of groups || []) {
      for (const t of g.templates || []) {
        const p = t.params || {};
        if (p.type === 'EntCreate' && p.entity_def) plOf[p.entity_def] = p.priority_list;
      }
      collect(g.child_effects);
    }
  };
  collect(powerJson.effects);
  collect(powerJson.activation_effects);

  const names = new Set(summon.entities.map((e) => e.entity));
  let changed = false;
  for (const item of [...summon.entities]) {
    if (!_PHASH_RE.test(item.entity)) continue;
    const resolved = plOf[item.entity];
    // Merge ONLY when the P-hash resolves (via its own priority_list) to a name
    // that is also a sibling entity — proven same pet (Fire Imps, Gremlins).
    if (!resolved || resolved === item.entity || !names.has(resolved)) continue;
    const dest = summon.entities.find((e) => e.entity === resolved);
    dest.count += item.count;
    summon.entities.splice(summon.entities.indexOf(item), 1);
    changed = true;
  }
  if (!changed) return;
  // Collapsed to one type → use the compact single-entity form.
  if (summon.entities.length === 1) {
    const only = summon.entities[0];
    delete summon.entities;
    summon.entity = only.entity;
    if (only.count > 1) summon.entityCount = only.count;
  }
}

/**
 * Rebuild a tier-conditional summon that the gate filter dropped entirely.
 *
 * Soul Extraction summons ONE spectral Ghost whose tier matches the Undead
 * henchman you sacrifice — the binary lists all three tiers as separate EntCreate
 * templates, each gated by a target-identity `requires` (`MastermindPets_Lich
 * target.VillainName>` → Boss, `…Skeletal_Warrior` → Lt, `…Zombie` → Minion). The
 * converter treats `.VillainName>` as an undisplayable NPC gate and drops all
 * three, so the power renders no pet at all.
 *
 * These aren't NPC-only gates — they're the player's OWN henchman types (the gate
 * names a `MastermindPets_*` entity), i.e. the tier-selection mechanic. Surface the
 * summon as mutually-exclusive variants (exactly one materializes) so the display
 * can show "1 of: Ghost (Boss/Lt/Minion)" without inflating the count to 3 or
 * summing three ghosts' damage. Runs only when the summon was dropped; a normal
 * summon is left untouched. Scoped tight: ALL EntCreates must carry the
 * `MastermindPets_* …VillainName>` henchman-identity gate (Soul Extraction alone).
 */
function rebuildTierConditionalSummon(powerJson, effects) {
  if (!effects || effects.summon) return;        // only when the summon was dropped
  const insts = [];
  const collect = (groups) => {
    for (const g of groups || []) {
      const req = (g.requires_expression || '').trim();
      for (const t of g.templates || []) {
        if (!(t.attribs || []).includes('Create_Entity')) continue;
        const p = t.params || {};
        if (p.type !== 'EntCreate' || !p.entity_def) continue;
        insts.push({ entity: p.entity_def, req, duration: _parseDurationSeconds(t.duration), flags: t.flags || [] });
      }
      collect(g.child_effects);
    }
  };
  collect(powerJson.effects);
  collect(powerJson.activation_effects);

  if (insts.length < 2) return;
  // Every variant gated by a check on which of the PLAYER's own henchmen is
  // sacrificed — the tier selector, not an enemy-NPC gate. The two servers
  // encode it differently:
  //   HC (Parse7):     `MastermindPets_Lich target.VillainName>`  (pet identity)
  //   Rebirth (Parse6): `arch target> Class_Boss_Henchman eq`     (henchman class)
  const TIER_GATE = /MastermindPets_\w+\s+target\.VillainName>|arch\s+target>\s+Class_\w+_Henchman\s+eq/;
  if (!insts.every(i => TIER_GATE.test(i.req))) return;
  const names = [...new Set(insts.map(i => i.entity))];
  if (names.length < 2) return;

  const summon = {
    isPseudoPet: insts[0].flags.some(f => f.includes('PseudoPet')),
    mutuallyExclusive: true,
    entities: names.map(entity => ({ entity, count: 1 })),
  };
  const dur = insts.map(i => i.duration).find(d => d && d > 0);
  if (dur) summon.duration = dur;
  if (insts.some(i => i.flags.some(f => f.includes('CopyBoosts')))) summon.copyBoosts = true;
  effects.summon = summon;
}

function attachResolvedPseudoPets(powerJson, effects) {
  if (!effects || !effects.summon) return;

  const shells = []; // { signature, displayName, duration, redirects, chance, override? }
  const walk = (effs) => {
    for (const e of effs || []) {
      const chance = (e.chance === undefined || e.chance === null) ? 1 : e.chance;
      for (const t of e.templates || []) {
        if (!(t.attribs || []).includes('Create_Entity')) continue;
        const p = t.params || {};
        if (p.type !== 'EntCreate') continue;
        // Effective shell name: priority_list when entity_def is absent or an
        // opaque P-hash, otherwise entity_def itself. HC's shell summons carry
        // entity_def:null + Pets.* redirects (Freezing Rain, Sleet, Voltaic
        // Sentinel, Sentinel Rain of Fire — SHELL-1); rebirth/thunderspy name a
        // real pet entity with no redirects and resolve on the pet-damage path.
        const effectiveEntity = (!p.entity_def || /^P\d+$/.test(p.entity_def))
          ? p.priority_list : p.entity_def;
        // Drop non-content redirects before signing: ResistAll (pet
        // survivability) and *.Avoid (an AI hint that makes foes path around the
        // patch). Neither is ever the payload.
        //
        // *_Info is dropped too, but kept ASIDE rather than discarded. An Info
        // redirect normally mirrors a sibling's numbers for the tooltip, so
        // resolving it alongside that sibling double-counts. It is not always
        // redundant though: the Dominator/Epic Trip Mine redirects ONLY to
        // `TripMine_Resistance` (a survivability buff — real, but no payload) and
        // `TripMine_Info`. The actual `TripMine` is never redirected at all; the
        // pet's Self_Destruct executes it via `Execute_Power`. Dropping Info there
        // left nothing that resolves to an ability, so the planner showed the
        // Dominator's Trip Mine doing NO damage (report 2026-07-26).
        //
        // A name test can't tell the two cases apart — `TripMine_Resistance` reads
        // like a payload and isn't one — so the fallback is decided on CONTENT
        // below: `infoRedirects` is consulted only when the primary set resolves
        // to zero abilities, which an Info mirroring a live sibling never does.
        const redirects = (p.redirects || []).filter(r => !/(resistall|\.avoid$|_info$)/i.test(r));
        const infoRedirects = (p.redirects || [])
          .filter(r => /_info$/i.test(r) && !/(resistall|\.avoid$)/i.test(r));
        if (redirects.length === 0 && infoRedirects.length === 0) continue;
        const isShell = PSEUDOPET_SHELL_ENTITIES.has(effectiveEntity);
        // Override case: a NAMED pet chassis (entity_def resolves to a real
        // PET_ENTITIES pet) whose content is delivered by an EXTERNAL Redirects.*
        // power that supersedes the chassis's intrinsic abilities. Burn's
        // entity_def "Burn" → Pets_Burn (Fire 0.06), but it actually runs
        // Redirects.Fiery_Aura.Burn (Fire 0.08) — the same redirect the
        // PL_StaticObject-chassis Burns (tanker/brute/scrapper) use. The chassis's
        // stale 0.06 must NOT also be counted (double-count), so resolve the
        // redirect AND record the chassis to normalize away below. The
        // discriminator is the Redirects.* namespace: intrinsic redirects name the
        // chassis's own power (Bonfire → Pets.Bonfire.Bonfire, Liquefy →
        // Pets.Liquefy.Liquefy) and are correctly left on the pet-damage path.
        // Gated on a SHELL priority_list: a genuine "chassis replaced by redirect"
        // summon falls back to a generic location shell (Burn → PL_StaticObject),
        // whereas a real nested-pet chain falls back to another pet (Geode's
        // Carin_Beacon → "Geode") and must be left untouched.
        const override = (!isShell && PSEUDOPET_SHELL_ENTITIES.has(p.priority_list)
          && redirects.some(r => /^redirects\./i.test(r)))
          ? { chassis: p.entity_def, shell: p.priority_list }
          : null;
        if (!isShell && !override) continue;
        shells.push({
          // Group key uses the effective shell (or chassis for overrides) +
          // redirect signature so distinct payloads stay separate.
          signature: `${isShell ? effectiveEntity : p.entity_def}|${redirects.join(',')}`,
          displayName: p.display_name,
          duration: _parseDurationSeconds(t.duration),
          redirects,
          infoRedirects,
          chance,
          override,
          shellName: isShell ? effectiveEntity : override.shell,
        });
      }
      walk(e.child_effects);
    }
  };
  walk(powerJson.effects);
  walk(powerJson.activation_effects);

  if (shells.length === 0) return;

  // Group by effective entity + redirect signature. Identical signatures collapse
  // to a count — but only chance>0 occurrences count as real simultaneous copies.
  // A chance:0 EntCreate sharing a base shell's signature is a conditional variant
  // (Burn's Fiery-Embrace bonus patch fires only while FE is active), NOT a second
  // permanent patch, so it must not inflate the count.
  const byKey = new Map();
  for (const s of shells) {
    if (byKey.has(s.signature)) { byKey.get(s.signature).occurrences.push(s); continue; }
    byKey.set(s.signature, { ...s, occurrences: [s] });
  }

  const resolved = [];
  const overrides = []; // { chassis, shell } for pet-path normalization
  const resolvedShellNames = [];
  for (const g of byKey.values()) {
    // Content-decided Info fallback (see the redirect filter above): a summon
    // whose only payload-bearing redirect is `*_Info` resolves off that, and
    // nothing else does — so this can never double-count a live sibling.
    let abilities = resolveSummonRedirects(g.redirects);
    if (abilities.length === 0 && g.infoRedirects?.length) {
      abilities = resolveSummonRedirects(g.infoRedirects);
    }
    if (abilities.length === 0) continue;
    if (g.shellName) resolvedShellNames.push(g.shellName);
    const count = g.occurrences.filter(o => o.chance > 0).length || 1;
    // Per-entity lifespan: prefer the EntCreate's own Duration (Category Five's
    // two shells have distinct 20s/17s windows); fall back to the summon-level
    // duration the main builder already resolved (pet-lifespan cascade).
    const duration = g.duration || effects.summon.duration;
    if (g.override) overrides.push(g.override);
    resolved.push({
      displayName: g.displayName || effects.summon.displayName
        || powerJson.display_name || powerJson.name || 'Summoned Effect',
      ...(duration ? { duration } : {}),
      ...(count > 1 ? { count } : {}),
      // Location pseudo-pets created by a player power inherit the summoner's
      // modifiers: no explicit CopyBoosts flag on these shells, but the parent
      // powers allow Damage enhancement and in-game numbers scale off the
      // SUMMONER's archetype (verified vs Storm Cell / Category Five in-game).
      // So the runtime computes damage off the summoner's AT, not a pet class.
      copyCreatorMods: true,
      abilities,
    });
  }

  if (resolved.length === 0) return;
  effects.summon.resolvedEntities = resolved;

  // Normalize an overridden pet chassis off the pet-damage path so its stale
  // intrinsic damage isn't counted alongside the resolved redirect (the runtime
  // renders summon.entity AND resolvedEntities as separate lists). Point the
  // single-entity summon at the generic shell fallback (priority_list) — which
  // resolves to nothing in PET_ENTITIES — making the six Burn variants identical
  // (entity=PL_StaticObject + resolved redirect). Drop the entity outright if the
  // fallback isn't a known shell. Only touches single-entity summons that match a
  // detected override; multi-entity summons (summon.entities) are left untouched.
  if (!effects.summon.entities) {
    for (const { chassis, shell } of overrides) {
      if (effects.summon.entity !== chassis) continue;
      if (PSEUDOPET_SHELL_ENTITIES.has(shell)) effects.summon.entity = shell;
      else delete effects.summon.entity;
      delete effects.summon.entityCount;
    }
    // A shell summon with an absent entity_def has no entity at all (the main
    // builder had nothing to stamp). Surface the shell name so the runtime has
    // a lookup key alongside the resolved abilities — it resolves to nothing in
    // PET_ENTITIES, so the pet-damage path stays untouched (no double-count).
    if (!effects.summon.entity && resolvedShellNames.length > 0) {
      effects.summon.entity = resolvedShellNames[0];
    }
  }
}

/**
 * Convert a power name to kebab-case filename
 */
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Valid target types (mapped from raw data to our TypeScript types).
// The raw bin format uses some short names ('Friend', 'Position', 'MyPet')
// where CoD2 used longer ones ('Ally (Alive)', 'Location', 'Ally'). Map both.
const TARGET_TYPE_MAP = {
  'Self': 'Self',
  'Foe': 'Foe',
  'Ally': 'Ally',
  'Ally (Alive)': 'Ally (Alive)',
  'Enemy': 'Foe',
  'Teammate': 'Teammate',
  'Teammate (Alive)': 'Teammate (Alive)',
  'Location': 'Location',
  'DeadFoe': 'DeadFoe',
  'DeadOrAlive Teammate': 'DeadOrAlive Teammate',
  'Any': 'Any',
  'Dead Teammate': 'Dead Teammate',
  'Teleport': 'Teleport',
  // Bin-format short names (CoD2 used the longer forms above).
  'Friend': 'Ally (Alive)',                   // alive friendly target (most heal/buff powers)
  'DeadOrAliveFoe': 'Foe',                    // Foe regardless of alive/dead state
  'DeadPlayerFriend': 'Dead Teammate',        // resurrect-on-dead-ally powers
  'DeadMyPet': 'Dead Teammate',               // resurrect-on-dead-pet
  'DeadOrAliveMyPet': 'Ally',                 // pet manipulation, dead or alive
  'MyPet': 'Own Pet (Alive)',                 // caster's own henchman (MM pet buffs)
  'MyOwner': 'Ally',                          // pet power targeting its owner
  'MyCreator': 'Self',                        // pet powers referencing summoner
  'MyCreation': 'Ally',                       // pet's own pet/summon
  'Position': 'Location',                     // ground-targeted (caltrops, trip mine)
  'DeadOrAliveAny': 'Any',                    // any entity, dead or alive (Defibrillate)
  'DeadOrAliveLeaguemate': 'Teammate',
  // Map invalid types to closest valid equivalent
  'Anything': 'Location',
  'Leaguemate': 'Teammate',
  'Leaguemate (Alive)': 'Teammate (Alive)',
  'DeadLeaguemate': 'Dead Teammate',
  'Dead Leaguemate': 'Dead Teammate',
};

// ============================================
// COMPREHENSIVE ATTRIBUTE MAPPING
// ============================================

// Damage type attributes (with and without _Dmg suffix)
const DAMAGE_TYPES = {
  'smashing_dmg': 'Smashing', 'smashing': 'Smashing',
  'lethal_dmg': 'Lethal', 'lethal': 'Lethal',
  'fire_dmg': 'Fire', 'fire': 'Fire',
  'cold_dmg': 'Cold', 'cold': 'Cold',
  'energy_dmg': 'Energy', 'energy': 'Energy',
  'negative_energy_dmg': 'Negative', 'negative_energy': 'Negative',
  'psionic_dmg': 'Psionic', 'psionic': 'Psionic',
  'toxic_dmg': 'Toxic', 'toxic': 'Toxic',
  'special_dmg': 'Special',
  'heal_dmg': 'Heal', // Used for -regen effects sometimes
};

// Defense position types (not damage types)
const DEFENSE_POSITIONS = {
  'melee': 'Melee',
  'ranged': 'Ranged',
  'area': 'AoE',
  'aoe': 'AoE',
};

// Elusivity attributes (defense debuff resistance)
const ELUSIVITY_TYPES = {
  'smashing_elusivity': 'Smashing', 'lethal_elusivity': 'Lethal',
  'fire_elusivity': 'Fire', 'cold_elusivity': 'Cold',
  'energy_elusivity': 'Energy', 'negative_energy_elusivity': 'Negative',
  'psionic_elusivity': 'Psionic', 'melee_elusivity': 'Melee',
  'ranged_elusivity': 'Ranged', 'area_elusivity': 'AoE',
  'elusivitybase': 'All',
};

// Mez effect types (with magnitude) - maps raw attrib to our effect name
const MEZ_TYPES = {
  'held': 'hold', 'hold': 'hold',
  'stunned': 'stun', 'stun': 'stun', 'disorient': 'stun',
  'sleep': 'sleep', 'sleeping': 'sleep', 'slept': 'sleep',
  'immobilized': 'immobilize', 'immobilize': 'immobilize',
  'confused': 'confuse', 'confuse': 'confuse',
  'afraid': 'fear', 'terrorized': 'fear', 'fear': 'fear', 'terrorize': 'fear',
};

// Knockback-type effects (no magnitude, just scale/table)
const KNOCKBACK_TYPES = {
  'knockback': 'knockback',
  'knockup': 'knockup',
  'repel': 'repel',
};

// Movement attributes
const MOVEMENT_TYPES = {
  'runningspeed': 'runSpeed', 'speed_running': 'runSpeed',
  'flyingspeed': 'flySpeed', 'speed_flying': 'flySpeed', 'fly': 'fly',
  'jumpheight': 'jumpHeight',
  'jumpingspeed': 'jumpSpeed', 'speed_jumping': 'jumpSpeed',
  'movementcontrol': 'movementControl',
  'movementfriction': 'movementFriction',
  // Thunderspy spelling of the same axes (SpeedRunning/SpeedJumping/SpeedFlying + the
  // odd RunSpeed/FlySpeed) — mirrors MOVEMENT_AXIS in atomic-effect.ts. See the note
  // there: mapped rather than parser-renamed because the current tspy binary is
  // incomplete and re-exporting would regress the committed movement data.
  'speedrunning': 'runSpeed', 'speedjumping': 'jumpSpeed', 'speedflying': 'flySpeed',
  'runspeed': 'runSpeed', 'flyspeed': 'flySpeed',
};

// Resource attributes
const RESOURCE_TYPES = {
  'hitpoints': 'hitPoints', 'hit_points': 'hitPoints',
  // [ATOM-TSPY step 2] tspy spells HC's HitPoints as `Heal`/`HealSelf`; @maximum ⇒ maxHPBuff,
  // same as hitPoints. Non-maximum faces fall through unrouted (no heal total). tspy-only.
  'heal': 'hitPoints', 'healself': 'hitPoints',
  'endurance': 'endurance',
  'recovery': 'recovery',
  'regeneration': 'regeneration', 'regen': 'regeneration',
  'absorb': 'absorb',
};

// Combat modifier attributes
const COMBAT_MODIFIERS = {
  'tohit': 'toHit', 'to_hit': 'toHit',
  'accuracy': 'accuracy',
  'base_defense': 'defense', 'defense': 'defense',
  'threatlevel': 'threatLevel', 'threat_level': 'threatLevel',
  'rechargetime': 'rechargeTime', 'recharge_time': 'rechargeTime', 'speed_recharge': 'rechargeTime',
  'range': 'range',
  'endurancediscount': 'enduranceDiscount',
};

// Stealth/Perception attributes
const STEALTH_TYPES = {
  'perceptionradius': 'perception',
  'stealthradius_pve': 'stealthPvE',
  'stealthradius_pvp': 'stealthPvP',
  'translucency': 'translucency',
};

// Control attributes
const CONTROL_TYPES = {
  'taunt': 'taunt', 'taunted': 'taunt',
  'placate': 'placate',
  'untouchable': 'untouchable',
  'onlyaffectsself': 'onlyAffectsSelf',
  'teleport': 'teleport',
};

// Special/meta attributes we generally skip (not create_entity - we handle that separately)
const SPECIAL_ATTRIBS = new Set([
  'null', 'grant_power', 'grant_boosted_power',
  'execute_power', 'revoke_power', 'cancel_effects', 'set_mode',
  'set_costume', 'add_token', 'designer_status', 'debt_protection',
  'silent_kill', 'global_chance_mod', 'recharge_power', 'jump pack',
]);

/**
 * Check if an attrib is a damage type
 */
function isDamageTypeAttrib(attrib) {
  if (!attrib) return false;
  const a = attrib.toLowerCase();
  // `damage` is Thunderspy's generic damage attrib (see extractDamage).
  return DAMAGE_TYPES[a] !== undefined || a === 'damage';
}

/**
 * Get normalized damage type name
 */
function getDamageType(attrib) {
  return DAMAGE_TYPES[attrib.toLowerCase()];
}

/**
 * Check if an attrib is a defense position type
 */
function isDefensePosition(attrib) {
  return attrib && DEFENSE_POSITIONS[attrib.toLowerCase()] !== undefined;
}

/**
 * Detect "out-of-combat-for-N-seconds" gating on an Effect's requires_expression.
 * Pool Stealth, Invisibility, and similar powers wrap their suppressible defense
 * buff inside an outer Effect with a requires clause like
 *   `Attacked source.EventTimeSince> 10 > HitByFoe source.EventTimeSince> 10 > && ...`
 * The buff only applies when no combat-related event has fired in the last N seconds,
 * which is functionally identical to template-level Suppress events for our purposes.
 */
function _isOutOfCombatGate(req) {
  if (!req) return false;
  if (!req.includes('EventTimeSince')) return false;
  return /\b(Attacked|Damaged|HitByFoe|MissionObjectClick|PseudoPetAttacked|Helped)\b/.test(req);
}

/** Tag templates with the synthetic property `_combatGated` when their parent
 *  Effect (or any ancestor) is gated out-of-combat. The conversion's
 *  extractEffects function reads this to route the buff into
 *  `defenseBuffSuppressible`.
 */
function _tagCombatGated(template) {
  template._combatGated = true;
}

/**
 * Detect whether an Effect's `requires_expression` is a *positive state gate*
 * representing a conditional bonus that should NOT be folded into the power's
 * base damage / base effects.
 *
 * Examples we want to skip:
 *   - `… Drowning target.ownPower? &&`         (Suffocate drowning bonus damage)
 *   - `… kStealth source> 0.5 > &&`            (Domination boost on caster)
 *   - `… target.ownPower?`                     (drowning -Def bonus, no PvE prefix)
 *
 * Examples we want to KEEP (the base case):
 *   - `enttype target> critter eq`             (just the PvE entity-type filter)
 *   - `Drowning target.ownPower? !`            (target NOT drowning — base case)
 *   - `…ownPower? ! &&`                        (negated state inside a chain)
 *
 * Already handled upstream by explicit `continue`s — kept there for readability:
 *   `kHitPoints == 0`, `kMeter > …`, `rand()`.
 *
 * The heuristic: strip the basic PvE/PvP entity filter and conjunction
 * operators, then look at the remainder. If something remains and it doesn't
 * end with `!` (RPN logical-not), the gate is positive → conditional bonus.
 *
 * Why this matters: HC stores conditional bonuses inside their own EffectGroup
 * with a `kMeter` / `Hide` / etc. requires_expression — already filtered.
 * Parse6 (Rebirth) flattens AttribMods so the requires sits on the synthetic
 * group instead. Without this filter, the calc at damage.ts:446 sums
 * conditional alternatives into the base damage (Suffocate showed
 * 0.275 + 0.069 + 0.178 = 0.521 per cast where it should show 0.275).
 */
// Classify a positive state gate into a human-friendly { id, label } pair so
// the conditional bonus can be surfaced as a Mechanic Adjuster toggle in the
// InfoPanel. Returns null when no recognized gate is present.
//
// Patterns we recognize:
//   - `<...> <PowerCategory.PowerSet.PowerName> target.ownPower? <...>`
//     Power-presence check on target. The leaf segment of the dotted name is
//     used as the id (snake_cased lowercase) and the prettified leaf as the
//     label. We try to upgrade the label to the power's actual display_name
//     when the registry is available — see _resolveConditionalLabel.
//   - `<...> <X> source.ownPower? <...>` — same shape, caster-side.
//   - `kStealth source>` — caster's stealth/hide attribute. Mapped to the
//     'stealthed' id with label 'Stealthed'.
//   - `kEngaged source.Mode?` / `Source.Mode?` — combat / mode toggles.
//
// Returns { id, label, side?: 'target' | 'source' } | null.
// Gates we recognize but explicitly DON'T surface as Mechanic Adjusters
// because they encode game-state constraints rather than toggleable
// mechanics. Returns true when the gate should be skipped from the
// `conditionalEffects` array entirely.
function _isUntoggleableGate(req) {
  if (!req) return false;
  // RPN form of "kMeter > 0" — Stalker / Widow hide bonus damage.
  // Already handled by the inherent toggle system, not surfaced here.
  if (/\bkMeter\s+source>\s+0\s+>/.test(req)) return true;
  // HP-percentage scaled proc: `kHitPoints% ... rand 100 * <`. The `rand`
  // token is a proc dice roll; our base collectors filter literal `rand()`
  // already but the actual binary syntax is `rand 100 *`.
  if (/\brand\s+100\s+\*/.test(req)) return true;
  // Target archetype / class checks (extra dmg vs minions, etc.) —
  // not a player-toggleable state.
  if (/\barch\s+target>\s+Class_/.test(req)) return true;
  // Caster combat-level cutoff (some powers gate scaling on level).
  if (/\bcombatlevel\s+source>/.test(req)) return true;
  // Distance-based conditional (snipe range, etc.) — handled elsewhere.
  if (/\bdistance\s+\d+\s+[<>]/.test(req)) return true;
  // Target tag check (niche, e.g. "Electronic" enemy type).
  if (/\.HasTag\?/.test(req)) return true;
  // Held-target conditional (proc damage vs held foes). Could be an
  // adjuster eventually but the existing planner doesn't expose this state
  // and the values are typically tiny scourge-style procs.
  if (/\bkHeld\s+target>\s+0\s+>/.test(req)) return true;
  // Cur.kHitPoints conditionals (low-HP self-buffs etc.) — game-state.
  if (/\bCur\.kHitPoints\s+target>\s+0\s+/.test(req)) return true;
  if (/\bkHitPoints%\s+target>\s+0\s+>/.test(req)) return true;
  // Mez-status checks on the target (kSleep, kStunned, etc.) — game-state.
  if (/\bk(Sleep|Stunned|Confused|Held|Immobilized|Terrorized)\s+target>/.test(req)) return true;
  // Caster mez-resistance threshold — used by buffs that fall off when the
  // target is already heavily slowed/etc. Not user-toggleable.
  if (/\bkMeter\s+target>\s+0?\.\d+\s+</.test(req)) return true;
  // PvP-map conditional (already covered by Ranged_PvPDamage table filter).
  if (/\bisPVPMap\?/.test(req)) return true;
  // To-hit-roll conditionals (`@ToHitRoll @ToHit < / >=`) — internal hit
  // chance branches, not a user knob.
  if (/@ToHitRoll/.test(req)) return true;
  // FX-only conditionals — `@CustomFX X eq` clauses gate which visual variant
  // applies. They're stripped from the gate at classification time (like the
  // PvE/PvP enttype filter) rather than rejected outright, since they can
  // appear chained alongside a real toggleable gate (`kStealth source>`,
  // power-presence, etc.). See `_stripIgnoredClauses`.
  // Grounded / NearGround state — Electric Armor's KB protection only fires
  // when grounded, Ignite's burning patch only persists when the target is
  // grounded. Not a user-meaningful toggle (default-on for non-flying chars,
  // auto-resets when flying). Skip both source and target sides.
  if (/\bNearGround\s+(source|target)\.EventTimeSince>/.test(req)) return true;
  // "Mez-free for N seconds" gates (Energy Aura's Entropy Shield recharge
  // bonus, etc.) — `Held source.EventTimeSince> N >` chained with Stunned/
  // Sleep variants. Equivalent to "the player isn't currently being mez'd";
  // tracked by combat state, not a user toggle.
  if (/\b(Held|Stunned|Sleep|Confused|Terrorized|Immobilized)\s+source\.EventTimeSince>/.test(req)) return true;
  // Token-owned flags: `Power_Disallow*` opt-outs on buff targets, plus mission/
  // story tokens (IvyKidnapped, NTutorialSavedHero, …). Never player-toggleable.
  if (/\.TokenOwned\?/.test(req)) return true;
  // SOURCE-side token-time gates are caster combo state, not a user toggle:
  // Radiation Melee's Contamination follow-up (`Radiation_Melee_Contamination_Hit
  // source.TokenTime> - 1 <`) and Kinetic Assault's secondaries (an RPN scaling
  // expression, not a boolean gate).
  //
  // TARGET-side token-time gates are the opposite: "this target was hit by X in
  // the last N seconds" is a target state the player drives by attack order, in
  // the same family as the `vs <type>` / Disintegrating conditionals. Gravity
  // Control's Impact (`now GravityDistortion target.TokenTime> - 12 <` on Propel
  // and Lift) is one, and blanket-blacklisting both sides silently dropped it —
  // the group was excluded from the base collectors AND never surfaced as a
  // conditional, so the bonus damage vanished entirely. It now classifies below.
  if (/\bsource\.TokenTime>/.test(req)) return true;
  // Caster archetype / class scaling. Pool powers (Boxing, Cross Punch,
  // Toxic Dart, etc.) carry per-AT damage variants gated on `arch source>
  // Class_<AT>` — these aren't a user toggle, they're which-character-
  // picked-the-power. The base collector picks the variant for the build's
  // archetype via the AT_TABLES path; we don't surface alternates as
  // adjusters.
  if (/\barch\s+source>\s+[Cc]lass_/.test(req)) return true;
  // NPC-specific gates: target villain name, target faction/friend checks,
  // and self-target discriminators. None are player-toggleable.
  if (/\.VillainName>/.test(req)) return true;
  if (/\btarget\.isFriend\?/.test(req)) return true;
  if (/\bentref\s+target>\s+entref\s+source>\s+eq/.test(req)) return true;
  // Caster-side internal thresholds (ToHit roll, low-HP self-buff, hide
  // base case where kMeter is below the hide threshold).
  if (/\bcur\.kToHit\s+source>/i.test(req)) return true;
  if (/\bkHitPoints%\s+source>/.test(req)) return true;
  // RPN base-case form `kMeter source> .9 <` ("kMeter < 0.9" = NOT in hide).
  // Semantically a negation but doesn't carry the literal `!` token, so the
  // generic stripped-ends-with-! check misses it.
  if (/\bkMeter\s+source>\s+\.\d+\s+</.test(req)) return true;
  // Caster's pet-owner archetype scaling. Mastermind/Controller pets (Fallout,
  // Enflame, etc.) carry per-owner-class damage variants. Same rationale as
  // `arch source>`: not a player toggle, just which AT summoned the pet.
  if (/\barch\s+source\.owner>\s+[Cc]lass_/.test(req)) return true;
  // Caster endurance threshold (e.g. CoT critter "high-endurance" buff).
  if (/\bkEndurance%\s+source>/.test(req)) return true;
  // Costume / appearance gates (NPC disguise scripts).
  if (/\bcostume\s+target>/.test(req)) return true;
  // Target group membership (e.g. `group target> MastermindPets eq`) —
  // categorizes targets, not a toggle.
  if (/\bgroup\s+target>\s+\w+\s+eq/.test(req)) return true;
  // Target untouchable / phased-out checks. Used by buffs that skip phased
  // targets; not a player adjuster.
  if (/\bcur\.kUntouchable\s+target>/i.test(req)) return true;
  // Activate-attack event-count gates (Defiance / Battle Euphoria internals).
  if (/\bActivateAttackClick\s+target\.EventCount>/.test(req)) return true;
  // Reversed entref self-check (source vs target either order).
  if (/\bentref\s+source>\s+entref\s+target>\s+eq/.test(req)) return true;
  if (/\bentref\s+target\.owner>\s+entref\s+source>\s+eq/.test(req)) return true;
  // Caster mez-state self-checks (caster is currently held / etc.).
  if (/\bcur\.k(Held|Sleep|Stunned|Confused|Immobilized)\s+source>/i.test(req)) return true;
  // Target-attacked event counts (Rage / Battle Euphoria internals).
  if (/\bAttackedByOtherClick\s+target\.EventCount>/.test(req)) return true;
  // Target rank gates (extra damage vs minion / lt / boss). Same family as
  // `arch target> Class_*` — just a different categorization axis.
  if (/\brank\s+target>\s+[Cc]lass_/.test(req)) return true;
  // Defender Vigilance team-size scaling. Real adjuster candidate but the
  // RPN form `0.0 source.TeamSize> N >` doesn't carry a per-step label,
  // and Vigilance scales smoothly across the range. Treat as inherent for
  // now; can promote to a slider later.
  if (/\bsource\.TeamSize>/i.test(req)) return true;
  // Rage / kRage source threshold (Original Domination mechanic, etc.) —
  // these are caster-meter thresholds tracked by inherents. Skip until
  // Original-Domination wiring is built explicitly.
  if (/\bkRage\s+source>\s+\d+/.test(req)) return true;
  // Composite caster mez-state checks (e.g. Mud Pots' "I'm not held AND
  // not stunned AND not slept"). Internal failsafe for self-buffs.
  if (/\bkHeld\s+source>\s+0\s+<=.*kStunned\s+source>/.test(req)) return true;
  // Faction alignment gates (hero/vigilante/villain/rogue) — tutorial &
  // debug objects. Not a player toggle.
  if (/\balignment\s+target>\s+(hero|villain|vigilante|rogue)\s+eq/.test(req)) return true;
  // NPC type / villain-class identity (`type target> X eq`). Same family
  // as the existing `arch target>` skip.
  if (/\btype\s+target>\s+\w+\s+eq/.test(req)) return true;
  // Map / arena / zone gates — InsideArena, praetorianprogress, etc.
  if (/\bInsideArena\b|\bpraetorianprogress\b|\.MapTeamArea>/.test(req)) return true;
  // Account / authorization gates (vet rewards, store products, server
  // availability) — not gameplay state.
  if (/\bauth>|\.ProductOwned\?|\.isAccountServerAvailable\?/.test(req)) return true;
  // Mission-script flags (DE Avatar's corruption-collapse beats).
  if (/\bScriptMessage>/.test(req)) return true;
  // HP-percentage threshold target gates (`kHitPoints% target> N >` with N>0).
  // The N==0 form is already covered above; this catches `> 16 >`,
  // `> 10 >`, etc. used by death-trigger procs.
  if (/\bkHitPoints%\s+target>\s+\d+\s+>/.test(req)) return true;
  // Pet caster-owner stealth check (Mastermind/Dominator pets that gain a
  // bonus when the *owner* is stealthed). Skip — same family as the
  // existing kStealth source> handler but routed through source.owner.
  if (/\bkStealth\s+source\.owner>/.test(req)) return true;
  // Caster-mez magnitude gates (`mod.k<Mez> source> 0 >`) — used by break-free
  // powers (Martial Manipulation's Inner Will) that fire only when the player
  // is currently mez'd. Auto-state, not user-toggleable.
  if (/\bmod\.k(Stun|Sleep|Immobilize|Held|Confused|Terrorized)\s+source>\s+0\s+>/.test(req)) return true;
  // Target-low-HP threshold (Scourge-style procs: extra damage when target HP
  // is below N%). Already a built-in inherent for Corruptors; surfacing as a
  // per-power toggle would duplicate the Header's Scourge state.
  if (/\bkHitPoints%\s+target>\s+\d+\s+</.test(req)) return true;
  return false;
}

// Target content-type tags surfaced as "vs <type>" conditional bonuses. A
// CLOSED, semantic allowlist: only tags that name a user-meaningful enemy
// CONTENT category (a "does extra vs machines / undead / …" bonus) belong here.
// Deliberately NOT syntactic — the dominant `.HasTag?` gates are `Raid`
// (4,185×) and `IncarnateBoss` (367×), which are internal engine mechanics
// (streakbreaker / accuracy caps / AV resistance, always chained with
// `@ToHitRoll` / `kRage`), never a player bonus; those stay untoggleable. Each
// entry is verified against a concrete power before being added. Value = label.
//   Electronic — ESD Arrow's +1.64 Energy dmg + Mag-2 Hold "vs machines and
//   robots" (matches the in-game description). Undead/Demon/Ghost/Human/Generator
//   are candidate future additions pending per-power verification.
const SURFACEABLE_TARGET_TAGS = { Electronic: 'Machines/Robots' };

function _classifyConditionalGate(req, powersetKey) {
  if (!_isConditionalGate(req)) return null;
  // Allowlisted target content-type tag (`<Tag> target.HasTag?`) → a "vs <type>"
  // bonus. Matched on the STRIPPED, anchored expression so it fires only when the
  // tag check is the WHOLE gate (the enttype PvE filter is stripped; a tag chained
  // with a real second mechanic won't match and falls through). Checked before the
  // untoggleable pass below, whose `.HasTag?` rule rejects every non-allowlisted tag.
  const tagMatch = _stripIgnoredClauses(req).trim().match(/^([A-Za-z_]+)\s+target\.HasTag\?$/);
  if (tagMatch && SURFACEABLE_TARGET_TAGS[tagMatch[1]]) {
    return { id: `vs-${tagMatch[1].toLowerCase()}`, label: `vs ${SURFACEABLE_TARGET_TAGS[tagMatch[1]]}`, side: 'target' };
  }
  // Test untoggleability on the STRIPPED expression so a strippable game-state
  // clause (per-target HP-state, PvE/PvP enttype) chained with a real toggle
  // doesn't sink the whole gate. DNA Siphon's Defensive/Efficient leech bonuses
  // gate on `Cur.kHitPoints target> 0 > kDefensiveAdaptation Source.Mode? &&` —
  // the HP clause alone would (correctly) read as untoggleable game-state, but
  // the surviving `kDefensiveAdaptation Source.Mode?` is the real Adaptation
  // toggle and must classify. (`_stripIgnoredClauses` already drops the HP and
  // enttype clauses; the remaining truly-untoggleable patterns still match.)
  if (_isUntoggleableGate(_stripIgnoredClauses(req))) return null;

  // Power-presence check: `<dotted.power.name> <side>.ownPower?` or
  // `<dotted.power.name> <side>.ownPowerNum? N ==` (stack-count form).
  // Note we use case-insensitive for the dotted name because
  // `target.ownPower?` references can be lowercased like
  // `temporary_powers.temporary_powers.tidal_power`.
  const ownPowerMatch = req.match(
    /([A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+){1,3})\s+(target|source)\.ownPower(?:Num)?\?/i
  );
  if (ownPowerMatch) {
    const dotted = ownPowerMatch[1];
    const side = ownPowerMatch[2];
    const leaf = dotted.split('.').pop();
    // ownPowerNum? + `N ==` form means "exactly N stacks" — append the
    // stack count to the id so different stack-tier bonuses don't collapse.
    const numMatch = req.match(
      new RegExp(dotted.replace(/[.\\]/g, '\\$&') + '\\s+(?:target|source)\\.ownPowerNum\\?\\s+(\\d+)\\s+==', 'i')
    );
    const stackSuffix = numMatch ? `-${numMatch[1]}` : '';
    return {
      id: (leaf.toLowerCase() + stackSuffix),
      label: _prettifyLeaf(leaf) + (numMatch ? ` (${numMatch[1]} stacks)` : ''),
      side,
      _powerName: dotted,
    };
  }
  // Target-side token-time window: `now <Token> target.TokenTime> - <N> <` reads
  // "the target's <Token> was applied less than N seconds ago". Gravity Control's
  // Impact is the only player instance (Propel + Lift, 12s, applied by Gravity
  // Distortion AND Gravity Distortion Field). Source-side variants are rejected
  // as caster combo state by `_isUntoggleableGate` above.
  const tokenTimeMatch = _stripIgnoredClauses(req)
    .trim()
    .match(/^now\s+([A-Za-z][A-Za-z0-9_]*)\s+target\.TokenTime>\s+-\s+(\d+(?:\.\d+)?)\s+</);
  if (tokenTimeMatch) {
    return {
      id: tokenTimeMatch[1].toLowerCase(),
      label: _splitCamelOrUnderscore(tokenTimeMatch[1]),
      side: 'target',
    };
  }
  // `kStealth source>` — caster's kStealth attribute. CoH overloads this
  // attribute slot per-AT: Dominators (especially in Rebirth's i23-era
  // Domination revival) use it as the Domination meter; for everyone else
  // it represents actual stealth/hide. Disambiguate via the powerset key
  // so a Dominator's "Stealthed" label correctly reads "Domination Active."
  if (/kStealth\s+source>/.test(req)) {
    const isDominator = powersetKey?.toLowerCase().startsWith('dominator_');
    return isDominator
      ? { id: 'domination', label: 'Domination Active', side: 'source' }
      : { id: 'stealthed', label: 'Stealthed', side: 'source' };
  }
  // Snipe-style "kEngaged" combat-mode test
  if (/kEngaged/.test(req)) {
    return { id: 'in-combat', label: 'In Combat', side: 'source' };
  }
  // Generic mode toggle on either side: `k<Name> {Source|source|Target|target}.Mode?`
  // HC uses `Source.Mode?` (capital-S); Rebirth uses `source.mode?`. Same
  // semantics, so match case-insensitively. Covers Bio Armor adaptations,
  // Dual Blades combo, Wind Control's Clear Skies, DE Avatar Infection
  // target states, etc.
  const modeMatch = req.match(/\bk([A-Za-z][A-Za-z0-9_]*?)\s+(Source|source|Target|target)\.[Mm]ode\?/);
  if (modeMatch) {
    const raw = modeMatch[1];
    return {
      id: raw.toLowerCase(),
      label: _splitCamelOrUnderscore(raw),
      side: modeMatch[2].toLowerCase(),
    };
  }
  // Bare self-referential power-presence: `<side>.ownPower?` with NO dotted
  // power name in front (the dotted form is handled above and already returned).
  // This means "the <side> is already under the effect of THIS power" — the
  // repeat-hit / stacking condition Thunderspy leans on heavily (Pale Blade's
  // Fester DoT-on-already-Festering, combo follow-ups, etc.). HC/Rebirth almost
  // never use the bare form, so this is effectively a Thunderspy refinement.
  // A meaningful label beats the opaque "Conditional" so the toggle is findable.
  const bareOwn = req.match(/\b(target|source)\.ownPower(?:Num)?\?/i);
  if (bareOwn) {
    const side = bareOwn[1].toLowerCase();
    return side === 'target'
      ? { id: 'target-affected', label: 'Target Already Affected', side: 'target' }
      : { id: 'self-affected', label: 'Already Affected', side: 'source' };
  }
  // Generic catch-all for any remaining positive gate so we don't drop data —
  // label it 'Conditional' and let downstream curation rename if needed.
  return { id: 'conditional', label: 'Conditional', side: null };
}

function _splitCamelOrUnderscore(s) {
  // `OffensiveAdaptation` → `Offensive Adaptation`
  // `DD_StatusMode_2` → `DD Status Mode 2`
  // `BonusAoEMode_2` → `Bonus AoE Mode 2` (preserves embedded all-caps tokens
  // like AoE / DoT — naive (lower)(upper) split would yield "Ao E Mode")
  return s
    .replace(/_/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')        // bonusAoE → bonus AoE? wait — see next
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')    // splits the END of an acronym from the next CamelWord
    .replace(/\s+/g, ' ')
    .trim();
}

// Curated label overrides for gates where the auto-derived label reads
// poorly. Keyed by `id` so they survive across regenerations. The id is
// derived from the gate's leaf name (lowercased) — see _classifyConditionalGate.
const CONDITIONAL_LABEL_OVERRIDES = {
  // Beam Rifle's Disintegration debuff — the gate references the internal
  // `Beam_Rifle_Debuff` power name. Strip-prefix yields just "Debuff" which
  // doesn't communicate the mechanic.
  beam_rifle_debuff: 'Disintegrating',
  // Title-case for power-name leaves that ended up lowercase (rare —
  // happens when the gate uses a lowercased dotted name like
  // `temporary_powers.temporary_powers.tidal_power`).
  tidal_power: 'Tidal Power',
  // The "in storm cell" gate — surfaced as a single global "Storm Cell Active"
  // toggle (Storm Blast: attacks' in-cell bonuses + Storm Cell's High Winds).
  stormblast_instormcell: 'Storm Cell Active',
  // Gravity Control's Impact: Propel and Lift deal bonus damage to a target hit
  // by Gravity Distortion (or Gravity Distortion Field) in the last 12s. The
  // in-game floater is literally "Impact!", so lead with that — "Gravity
  // Distortion" alone reads like the mez power rather than the damage bonus.
  gravitydistortion: 'Impact (Gravity Distortion)',
};

/**
 * Conditional ids that default ON. A conditional is off by default because most
 * are situational, but a few are the normal case and defaulting them off makes the
 * planner understate the power.
 *
 * `gravitydistortion` (Gravity Control's Impact): Gravity Distortion is the set's
 * single-target hold and opens the ST rotation, so Propel/Lift land inside the 12s
 * window as a matter of course. Reported 2026-07-30: "The bonus damage is generally
 * guaranteed since Gravity Distortion would be used first in an ST rotation."
 */
const CONDITIONALS_DEFAULT_ACTIVE = new Set(['gravitydistortion']);

/**
 * Conditional ids whose bonus damage is NOT multiplied by the archetype's hit-time
 * mechanic (Containment, crit, Scourge, Assassination, Opportunity).
 *
 * How the binary says so: an AT mechanic applies to a damage group only where the
 * game mints a duplicate of that group on an `*_InherentDamage` table. Propel has
 * exactly two such twins (`tags: ["Containment"]`, `Ranged_InherentDamage`, scale
 * 1.96 / PvP 0.3845) and both mirror the BASE group — there is no Containment twin
 * of the Impact group. So Containment doubles the base damage and leaves Impact
 * alone, which is what the reporter observed in game ("Containment doesn't double
 * the damage"). Impact IS boosted by damage enhancement: its table is the ordinary
 * `Ranged_Damage`, same as base, and it carries no IgnoreStrength flag.
 *
 * Without this, merging Impact into `power.damage` would put it inside the ×2 —
 * (1.96 + 0.49) × 2 instead of 1.96 × 2 + 0.49, an ~11% overstatement on a
 * Controller.
 */
const CONDITIONALS_AT_MECHANIC_EXEMPT = new Set(['gravitydistortion']);

/** Stamp `excludeFromAtMechanic` on a conditional's damage entries when its id is exempt. */
function _markAtMechanicExempt(id, damage) {
  if (!CONDITIONALS_AT_MECHANIC_EXEMPT.has(id) || !damage) return damage;
  const mark = (d) => ({ ...d, excludeFromAtMechanic: true });
  return Array.isArray(damage) ? damage.map(mark) : mark(damage);
}

function _applyLabelOverride(id, label) {
  // Stack-count form appends `-<N>` to the id (e.g. `tidal_power-3`); look
  // up the base id and append the suffix back to the override label.
  const stackMatch = id.match(/^(.+?)-(\d+)$/);
  const base = stackMatch ? stackMatch[1] : id;
  const override = CONDITIONAL_LABEL_OVERRIDES[base];
  if (!override) return label;
  return stackMatch ? `${override} (${stackMatch[2]} stacks)` : override;
}

function _prettifyLeaf(leaf) {
  return leaf.replace(/_/g, ' ');
}

// Strip clauses we want to ignore for classification — entity-type filters
// (PvE/PvP enttype) and visual-only customFX checks (Char's BrightFieryBinds,
// etc.). These can appear chained alongside a real toggleable gate; rejecting
// the whole expression because of them would lose Domination Active and other
// real classifications. By stripping them first, the remaining expression
// either matches a known gate pattern or reduces to the base case.
function _stripIgnoredClauses(req) {
  return req
    // `enttype target> critter eq` / `enttype target> player eq` — the binary
    // occasionally emits `Enttype` with a capital E.
    .replace(/enttype target> (critter|player) eq/gi, '')
    // `@customFX <name> eq` and `@customFX <name> eq !` — visual-state gates.
    // Match both casings (Parse6 lowercase, Parse7 capital). Consume an
    // immediately-following `!` so the strip leaves a clean RPN.
    .replace(/@customFX\s+\S+\s+eq(\s+!)?/gi, '')
    // `Cur.kHitPoints target> 0 >` (target alive) / `... ==` (target defeated) —
    // per-target HP-state gates on leech powers: DNA Siphon heals per LIVING foe
    // hit and gains +Regen/+Recovery per DEFEATED foe; the gated effect IS the
    // power's purpose (its shortHelp advertises "Self +HP, +End, +Special"), so
    // strip the state clause and let the effect fold into the base display.
    // A trailing mode clause (`kDefensiveAdaptation Source.Mode?` etc.) survives
    // and keeps that portion conditional — so DNA Siphon's mode bonuses and all of
    // Rebuild DNA (entirely mode-gated) correctly stay as Adaptation conditionals,
    // not folded. Self-rez (`kHitPoints == 0`, no `target>`) is unaffected.
    .replace(/Cur\.kHitPoints\s+target>\s+0\s+(?:>|==)/gi, '')
    // Collapse runs of whitespace introduced by the strips.
    .replace(/\s+/g, ' ')
    // Strip dangling boolean operators left behind. Repeat to handle
    // chains like ` && && && `.
    .replace(/(?:\s*(?:&&|\|\|)\s*){2,}/g, ' ')
    .replace(/^\s*(?:&&|\|\|)\s*/, '')
    .replace(/\s*(?:&&|\|\|)\s*$/, '')
    .trim();
}

function _isConditionalGate(req) {
  if (!req || !req.trim()) return false;
  // Bare RPN `1` is an always-true sentinel some powers carry as a no-op
  // gate. Treat as the base case.
  if (req.trim() === '1') return false;
  const stripped = _stripIgnoredClauses(req)
    .replace(/\s+(&&|\|\|)\s+/g, ' ')
    .replace(/^\s*(&&|\|\|)\s*/, '')
    .replace(/\s*(&&|\|\|)\s*$/, '')
    .trim();
  if (!stripped) return false;
  // A POSITIVE `isPVPMap?` conjunct is never the base case — this is a PvE
  // planner, so PvP-map content is conditional by definition (the PvE twin is
  // the one that applies). Checked BEFORE the trailing-`!` shortcut below,
  // which reads the LAST token of the `&&`-flattened expression as if it were
  // the top-level operator. That holds for a conjunction of negations
  // ("no combo level active", "not in a raid" — genuinely the default state)
  // but not when the `!` negates only ONE conjunct of a `&&`: Rebirth
  // Guardian's Dispersion Bubble carries `isPVPMap? entref target> entref
  // source> eq ! &&` ("on a PvP map AND target is not self"), where the `!`
  // belongs to the entref clause and the real top-level operator is `&&`.
  // `_stripIgnoredClauses` has already trimmed that trailing `&&`, so the
  // shortcut saw `… eq !` and folded a PvP-only ally mez-duration resistance
  // (2.0/Ranged_Res_Boolean) into the base bag, displacing nothing but adding
  // a stat the power never grants in PvE.
  if (/\bisPVPMap\?(?!\s+!)/i.test(stripped)) return true;
  // RPN top-level NOT → the requires reduces to "state is absent" which is
  // the base case for state-gated mechanics (e.g. Suffocate's -11.25% def
  // when target is NOT drowning is the default; the larger -14% applies as
  // a bonus when target IS drowning).
  if (stripped.endsWith('!')) return false;
  // A Domination-meter (kStealth) test AT/BELOW its activation threshold —
  // `kStealth source> N <=` — is the INACTIVE / default state: the base case,
  // exactly like the RPN `!` negation above. Its positively-gated sibling
  // (`kStealth source> N >`, Domination active) stays the conditional. Without
  // this, a Dominator power whose base (Domination-off) and Domination-boosted
  // variants are the complementary `<=` / `>` branches of one summon — Shadow
  // Field, Mirage — has its BASE summon swallowed into the "Domination Active"
  // conditional, so with Domination off (the default) the power renders no
  // pet block and no hoisted control/debuff at all. The `$` anchor keeps this
  // conservative: only a bare threshold test folds to base; a `<=` chained with
  // a further positive gate stays conditional.
  if (/kstealth\s+source(?:\.owner)?>\s+[\d.]+\s+<=$/i.test(stripped)) return false;
  return true;
}

/**
 * Walk the effect tree and collect templates from positively-gated branches,
 * grouped by gate id. Mirrors the existing collectAllTemplates / collectTemplatesDeep
 * logic but inverts the filter: where those skip conditional gates, this one
 * captures them.
 *
 * Returns Map<gateId, { label, side, _powerName?, templates }>.
 *
 * Skips the same un-shippable cases the base collectors skip (PvP-only,
 * chance=0, kHitPoints==0 / kMeter / rand() — those represent inherent
 * mechanics handled by the existing toggle system, not surfaced as
 * Mechanic Adjusters).
 */
function collectConditionalsGrouped(effects, powersetKey) {
  const groups = new Map();

  function pushTemplates(gate, templates) {
    if (!groups.has(gate.id)) {
      groups.set(gate.id, {
        label: gate.label,
        side: gate.side,
        _powerName: gate._powerName,
        templates: [],
      });
    }
    groups.get(gate.id).templates.push(...templates);
  }

  function mergeSubGroups(sub) {
    for (const [id, subg] of sub) {
      if (!groups.has(id)) groups.set(id, subg);
      else groups.get(id).templates.push(...subg.templates);
    }
  }

  function visit(effect) {
    if (effect.is_pvp === 'PVP_ONLY') return;
    // Same PvE/PvP `enttype`-pair drop the base collectors apply — the conditional
    // pipeline omitted it, so a conditional PvE/PvP pair (Beam Rifle's Disintegrate
    // -regen) kept the PvP -3/Ranged_Res_Boolean value over the PvE -0.75/Ranged_Ones.
    if (isPvpEnttypeVariant(effect.requires_expression)) return;
    // `Tag "Domination"` groups (HC's Dominator inherent control bonus) carry no
    // `requires` gate — recognize them here so they route to the same shared
    // 'domination' conditional Rebirth/tspy derive from their `kStealth source>`
    // gate. Checked before the chance==0 guard below: these tag-gated groups are
    // often chance=0 yet carry real templates (the enabled-while-Domination mez).
    if (effect.tags && effect.tags.includes('Domination')) {
      const gate = { id: 'domination', label: 'Domination Active', side: 'source' };
      pushTemplates(gate, effect.templates || []);
      if (effect.child_effects?.length) {
        const sub = collectConditionalsGrouped(effect.child_effects, powersetKey);
        for (const [, subg] of sub) groups.get(gate.id).templates.push(...subg.templates);
      }
      return;
    }
    if (effect.chance === 0 || effect.chance === 0.0) return;
    if (effect.tags && effect.tags.includes('Containment')) return;

    const req = effect.requires_expression;
    if (req) {
      // Existing inherent-mechanic gates aren't conditionals to surface.
      if (req.includes('kHitPoints == 0')) return;
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) return;
      if (req.includes('rand()')) return;
      // Note: Mode-based gates (Source.Mode? / kMode) intentionally pass
      // through here. They're real Mechanic Adjuster candidates (Bio Armor
      // adaptations, Dual Blades combo, etc.) and `_classifyConditionalGate`
      // turns them into useful labels. The base collectors continue to skip
      // them so the bonus doesn't fold into base damage.
      if (_isOutOfCombatGate(req)) return;
    }

    const gate = req ? _classifyConditionalGate(req, powersetKey) : null;
    if (gate) {
      pushTemplates(gate, effect.templates || []);
      // Gated children inherit the same gate.
      if (effect.child_effects?.length) {
        for (const child of effect.child_effects) {
          // Recurse but reattribute to the parent gate by collecting normally
          // and then folding into the same bucket.
          const sub = collectConditionalsGrouped([child], powersetKey);
          for (const [, subg] of sub) {
            groups.get(gate.id).templates.push(...subg.templates);
          }
        }
      }
    } else if (effect.child_effects?.length) {
      // Non-conditional branch with possibly-conditional descendants.
      mergeSubGroups(collectConditionalsGrouped(effect.child_effects, powersetKey));
    }
  }

  for (const effect of effects) visit(effect);
  return groups;
}

/**
 * Refine a gate's auto-derived label using context. Strips a matching
 * powerset-name prefix from the leaf (e.g. `Water_Control_Drowning` becomes
 * `Drowning` when emitted on a Water Control power).
 */
function _refineConditionalLabel(rawLabel, powerName, powersetKey) {
  if (!rawLabel) return rawLabel;
  if (powersetKey) {
    // powersetKey is like "Dominator_Control.Water_Control" — last segment is
    // the powerset name with the same word style as the gate's leaf.
    const psLeaf = powersetKey.split('.').pop().toLowerCase();
    const labelLower = rawLabel.toLowerCase().replace(/\s+/g, '_');
    if (labelLower.startsWith(psLeaf + '_')) {
      const stripped = rawLabel.slice(psLeaf.length + 1);
      // Title-case lightly: keep first letter capitalized, rest unchanged.
      return stripped.charAt(0).toUpperCase() + stripped.slice(1);
    }
  }
  return rawLabel;
}

/**
 * Build the per-power `conditionalEffects` array. Each entry is a Mechanic
 * Adjuster candidate that the InfoPanel renders as a toggle, adding its
 * damage/effects on top of the base when the user enables it.
 */
/**
 * Scan a power's effects for base templates that use a *negated* state gate
 * (RPN `... ownPower? !` form, etc.). Each one represents a base case that's
 * mutually exclusive with a positively-gated conditional sibling — i.e. the
 * conditional should be tagged `mode: 'replace'` so the merger swaps values
 * rather than treating it as additive stacking.
 *
 * Returns a Set of canonicalized predicate strings (e.g. `Drowning target`)
 * that the conditional emitter cross-references.
 */
function _collectBaseNegatedPredicates(effects) {
  const negated = new Set();
  function visit(eff) {
    if (eff.is_pvp === 'PVP_ONLY') return;
    const req = eff.requires_expression || '';
    if (req) {
      // Match `<dotted.power.name> <side>.ownPower? ... !` — the predicate
      // followed (eventually) by a top-level `!`. Tokenize rather than
      // regex-greedy so we catch chained gates like
      // `enttype target> critter eq Drowning target.ownPower? ! &&`.
      const tokens = req.trim().split(/\s+/);
      // Find the last token that's `!` and walk back to find the predicate
      // it negates (the nearest preceding `<X>.ownPower?` token).
      for (let i = tokens.length - 1; i > 0; i--) {
        if (tokens[i] !== '!') continue;
        // Walk back to find the matching ownPower? token.
        for (let j = i - 1; j >= 0; j--) {
          const m = tokens[j].match(/^(target|source)\.ownPower\?$/);
          if (m && j > 0) {
            const predicate = `${tokens[j - 1]} ${m[1]}`;
            negated.add(predicate.toLowerCase());
            break;
          }
        }
      }
    }
    for (const child of eff.child_effects || []) visit(child);
  }
  for (const eff of effects) visit(eff);
  return negated;
}

// classifyTemplateForStacking keys Regeneration/Recovery/Heal buffs as
// regenBuff/recoveryBuff/healBuff, but extractEffects routes their IgnoreStrength
// ("unenhanceable") copies to the *Unenhanced variant instead. When a conditional
// group's effects landed on the Unenhanced key, move the matching per-foe patch
// onto it so the merge lands on the real key rather than spawning a duplicate
// enhanceable one (Evolving Armor's Efficient +Regen/+Recovery are unenhanceable).
function _remapUnenhancedPatchKeys(patches, effects) {
  for (const key of Object.keys(patches)) {
    const unenh = `${key}Unenhanced`;
    if (effects[key] === undefined && effects[unenh] !== undefined) {
      patches[unenh] = patches[key];
      delete patches[key];
    }
  }
}

function extractConditionalEffects(rawEffects, powerJson) {
  if (!rawEffects?.length) return undefined;
  const powersetKey = powerJson.powerset || powerJson.full_name;
  const groups = collectConditionalsGrouped(rawEffects, powersetKey);
  if (groups.size === 0) return undefined;

  const baseNegated = _collectBaseNegatedPredicates(rawEffects);

  const out = [];
  for (const [id, group] of groups) {
    const damage = extractDamage(group.templates, powerJson);
    const effects = extractEffects(group.templates, powerJson.name);

    // Per-foe (AoE) scaling for this gated group — the same Stack/Continuous →
    // { scale, perTarget } model base effects get via detectStackingEffects.
    // Without it a stance-gated per-foe buff (Evolving Armor's Defensive +Def,
    // Efficient +Regen/+Recovery) collapses to just its per-foe increment (bag
    // last-write-wins keeps the Continuous scale, dropping the Replace base),
    // badly understating the stance bonus. Runs on the group's own templates
    // (already gate-filtered by the grouping) with the power's AoE geometry.
    if (effects && Object.keys(effects).length > 0) {
      const perFoe = computeAoePerTargetPatches(
        group.templates.map((t) => ({ template: t, tags: [], requires: '' })),
        {
          effectArea: EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area,
          maxTargets: powerJson.max_targets_hit,
          selfIsCountedTarget: (powerJson.targets_affected || []).includes('Self'),
        },
      );
      _remapUnenhancedPatchKeys(perFoe, effects);
      if (Object.keys(perFoe).length) mergeStackingPatches(effects, { patches: perFoe });
    }

    // Skip empty groups — a gated effect we couldn't classify into either
    // damage or recognized effects shouldn't pollute the array.
    const hasDamage = damage !== undefined;
    const hasEffects = effects && Object.keys(effects).length > 0;
    if (!hasDamage && !hasEffects) continue;

    const refined = _refineConditionalLabel(group.label, group._powerName, powerJson.powerset || powerJson.full_name);

    // Mode detection: if any base template in this power negates the same
    // predicate this conditional checks (`<power> <side>.ownPower? !`),
    // the two are mutex variants → 'replace'. Default 'additive' (omitted).
    let mode;
    if (group._powerName && group.side) {
      const predicate = `${group._powerName} ${group.side}`.toLowerCase();
      if (baseNegated.has(predicate)) mode = 'replace';
    }

    const entry = {
      id,
      label: _applyLabelOverride(id, refined),
      // Caster-state gates (`source.ownPower?`, `kStealth source>`,
      // `Source.Mode?`, `kEngaged`) describe the player's own state and
      // should toggle uniformly across every power that references them.
      // Target-state gates (`target.ownPower?`) are per-cast/per-target.
      // Exception: "in storm cell" reads as target-state, but a player thinks of
      // it as one "I'm fighting inside my Storm Cell" switch — promote to global
      // so it's a single toggle shared across the whole Storm Blast set (the
      // attacks' in-cell bonuses AND the Storm Cell summon's powered-up state).
      scope: (id === 'stormblast_instormcell' || group.side === 'source') ? 'global' : 'per-power',
      defaultActive: CONDITIONALS_DEFAULT_ACTIVE.has(id),
    };
    if (mode) entry.mode = mode;
    if (hasDamage) entry.damage = _markAtMechanicExempt(id, damage);
    if (hasEffects) entry.effects = effects;
    out.push(entry);
  }
  if (out.length === 0) return undefined;

  // Detect mutually-exclusive groups across the per-power conditional set.
  // Heuristic: ids that share a recognizable suffix word (e.g. "adaptation"
  // for Bio Armor's Defensive/Offensive/Rested, mode-tier suffix for combo
  // levels, stack-count suffix for Tidal Power N stacks). Members of a
  // group render as a radio in the UI.
  _annotateConditionalGroups(out);
  return out;
}

// Dual Pistols "Swap Ammo": each attack's SECONDARY effect changes with the
// loaded ammo, and only one ammo is loaded at a time. Each secondary lands in
// base as fixed effect key(s) per ammo — Standard -Def (`defenseDebuff`), Cryo
// Slow (`rechargeDebuff` + `slow`, the two halves of the slow), Chemical -Damage
// (`damageDebuff`) — so we move those keys out of base into mutually-exclusive
// `swap-ammo` conditionals (one per ammo, carrying all of that ammo's keys).
// (Incendiary's secondary is a fire DoT — already a damage entry, no debuff;
// the secondary DAMAGE-type swap is handled by the existing damageConversion.)
//
// Key-based (not tag-based) so it works on BOTH binary formats: HC/Parse7 tags
// the ammo groups, but Rebirth/Parse6 has no EffectGroup `Tag` (it stores flat
// AttribMods with the same effect keys). Knockback and other core effects keep
// their own keys and stay in base.
const DP_AMMO_BY_KEY = {
  defenseDebuff: 'lethalammo',
  rechargeDebuff: 'cryoammunition',
  slow: 'cryoammunition',
  damageDebuff: 'chemicalammunition',
};
const DP_AMMO_LABELS = { lethalammo: 'Standard Ammo', cryoammunition: 'Cryo Ammo', chemicalammunition: 'Chemical Ammo' };
const DP_AMMO_ORDER = ['lethalammo', 'cryoammunition', 'chemicalammunition'];

function extractDualPistolsAmmo(powerJson, baseEffects) {
  const psKey = (powerJson.powerset || powerJson.full_name || '').toLowerCase();
  if (!psKey.includes('dual_pistols')) return undefined;
  if (!baseEffects) return undefined;

  // Group the present ammo-secondary keys by their ammo (Cryo carries two).
  const byAmmo = new Map();
  for (const [key, id] of Object.entries(DP_AMMO_BY_KEY)) {
    if (baseEffects[key] === undefined) continue;
    if (!byAmmo.has(id)) byAmmo.set(id, { effects: {}, durations: {}, keys: [] });
    const slot = byAmmo.get(id);
    slot.effects[key] = baseEffects[key];
    slot.keys.push(key);
    const dur = baseEffects.durations ? baseEffects.durations[key] : undefined;
    if (dur !== undefined) slot.durations[key] = dur;
  }
  if (byAmmo.size === 0) return undefined;

  const conditionals = [];
  const baseKeysToRemove = [];
  for (const id of DP_AMMO_ORDER) {
    const slot = byAmmo.get(id);
    if (!slot) continue;
    const effects = { ...slot.effects };
    const durKeys = Object.keys(slot.durations);
    if (durKeys.length) effects.durations = slot.durations;
    // The keys of one ammo share a duration (both halves of a Slow); reuse it.
    const buffDuration = durKeys.length ? slot.durations[durKeys[0]] : baseEffects.buffDuration;
    if (buffDuration !== undefined) effects.buffDuration = buffDuration;
    conditionals.push({
      id,
      label: DP_AMMO_LABELS[id],
      scope: 'global',
      // Standard ammo is the default secondary (applies with no ammo loaded).
      defaultActive: id === 'lethalammo',
      group: 'swap-ammo',
      effects,
    });
    baseKeysToRemove.push(...slot.keys);
  }
  if (conditionals.length === 0) return undefined;
  return { conditionals, baseKeysToRemove };
}

/**
 * Walk the effect tree for chance-bearing templates (chance < 1 and != 0)
 * and emit them as `specialEffects` for the InfoPanel's SPECIAL section.
 *
 * Two flavors:
 * - `Null`-attrib chance template → "grant proc". Pair with a sibling
 *   `conditionalEffects` entry whose state-gate references a power whose
 *   leaf name matches an inline grant identifier. If exactly one
 *   conditional exists on the power, use it; otherwise emit a generic
 *   "trigger" label.
 * - Non-`Null` attrib chance template → "effect-proc". Use the attrib's
 *   prettified name as the label (Knockback, Knockup, Stunned, etc.).
 *
 * Skips PvP-only / chance=0 effects the same way the base collectors do.
 * Also skips templates whose chance equals the parent EffectGroup's chance
 * (the chance is just an EG-level proc gate, not a per-template variant).
 */
function extractSpecialEffects(rawEffects, conditionalEffects) {
  if (!rawEffects?.length) return undefined;
  const procs = [];
  const seen = new Set();

  function visit(effect) {
    if (effect.is_pvp === 'PVP_ONLY') return;
    const egChance = effect.chance ?? 1.0;
    if (egChance === 0) return;

    // Only EffectGroup-level `chance` < 1 is a real proc gate. Template-
    // level `tick_chance` is the accuracy/to-hit roll on a normal effect
    // (e.g. Slash's Base_Defense template carries tick_chance=0.998 = the
    // ToHit Roll), NOT a chance for the effect to fire conditionally.
    // Surfacing it as a "+99.8% chance to Base_Defense" SPECIAL row is a
    // false positive.
    if (egChance >= 1) {
      // No EG-level proc gate → recurse into children, skip this level's
      // templates (they fire unconditionally per the EG, even if the
      // template has its own to-hit roll).
      if (effect.child_effects?.length) {
        for (const ce of effect.child_effects) visit(ce);
      }
      return;
    }
    const chance = egChance;
    for (const t of effect.templates ?? []) {

      const attrib = (t.attribs && t.attribs[0]) || null;
      if (!attrib) continue;

      // Dedup: same chance + attrib pair shouldn't render twice.
      const key = `${attrib}:${chance.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      if (attrib === 'Grant_Power') {
        // Explicit power grant — the granted power's dotted name lives in
        // `params.power_names`. Use the leaf segment as the label after
        // stripping a powerset prefix (e.g. `Psionic_Melee_Insight` →
        // `Insight`). This is the canonical case for Psionic Melee's
        // Insight, Rad Melee's Contaminated, etc.
        const grantedName = (t.params?.power_names && t.params.power_names[0]) || '';
        const label = _labelFromGrantedPowerName(grantedName, conditionalEffects);
        procs.push({ kind: 'grant', chance, label });
      } else if (attrib === 'Null') {
        // Implicit grant — Null-attrib chance template. Two paths:
        //
        // 1. **Direct grant via params.power_names**: a Null attrib
        //    carrying a granted power name in the AttribMod tail —
        //    label off the granted power name directly, same path as
        //    Grant_Power. (Historically this also caught Parse6
        //    Grant_Power templates that the collapsed special-attrib
        //    misdecode labeled Null; those now arrive as real
        //    Grant_Power via resolve_attrib_rebirth and hit the branch
        //    above.)
        // 2. **Sibling-conditional pairing** (the original Null
        //    semantics): no params; the proc target is implied from a
        //    sibling conditionalEffects entry. Drowning, Insight,
        //    Combo Level, Tidal Power, etc.
        const grantedName = (t.params?.power_names && t.params.power_names[0]) || '';
        if (grantedName) {
          const label = _labelFromGrantedPowerName(grantedName, conditionalEffects);
          procs.push({ kind: 'grant', chance, label });
        } else {
          // AT-inherent state machines (Domination meter) are excluded
          // since the meter isn't a grant target. When exactly one
          // remaining candidate, pair; otherwise fall back to 'state'.
          const candidates = (conditionalEffects ?? []).filter(c =>
            !AT_INHERENT_GRANT_BLACKLIST.has(c.id)
          );
          const cond = candidates.length === 1 ? candidates[0] : null;
          procs.push({
            kind: 'grant',
            chance,
            label: cond?.label ?? 'state',
          });
        }
      } else {
        procs.push({
          kind: 'effect-proc',
          chance,
          label: _prettifyEffectAttrib(attrib),
        });
      }
    }

    if (effect.child_effects?.length) {
      for (const ce of effect.child_effects) visit(ce);
    }
  }

  for (const eff of rawEffects) visit(eff);
  return procs.length > 0 ? procs : undefined;
}

// AT-inherent conditional ids — same set the InfoPanel filters out of its
// Mechanic Adjusters list. The grant-proc label heuristic excludes these
// since they're caster-state mechanics, not target-state grants.
const AT_INHERENT_GRANT_BLACKLIST = new Set(['domination']);

/**
 * Resolve `Grant_Power → Temporary_Powers` hops that deliver DAMAGE the granting
 * power does not carry inline. A few passives/toggles grant a hidden
 * Temporary_Powers proc power whose damage-over-time is the actual player-facing
 * damage — invisible to the pipeline because Temporary_Powers isn't a converted
 * category (Molten Embrace's Fire DoT, Stalker Hidden Flame, Envenomed Blades,
 * Bio Offensive Adaptation, Plant Toxins). The exporter now includes the
 * referenced grant targets (see `export_powers._collect_grant_targets`); this
 * walks the grant and attaches the resolved DoT as `grantedDamageProcs`.
 *
 * Only DAMAGE-dealing grants surface: the granted power's +Damage *buff*
 * definitions (Power Siphon, Reach for the Limit, Perfection of Body, …) are
 * aspect=Strength and `extractDamage` drops them, and pure state grants (Combo
 * Level, Insight, Contaminated) carry no damage. So "the granted power deals
 * damage" is the discriminator, derived from the data — no curated list.
 */
function resolveGrantedDamageProcs(powerJson) {
  const targets = [];
  const queue = [...(powerJson.effects || []), ...(powerJson.activation_effects || [])];
  while (queue.length) {
    const eff = queue.shift();
    for (const t of (eff.templates || [])) {
      if ((t.attribs && t.attribs[0]) !== 'Grant_Power') continue;
      for (const pName of ((t.params && t.params.power_names) || [])) {
        if (/^temporary_powers\./i.test(pName)) targets.push(pName);
      }
    }
    if (eff.child_effects) queue.push(...eff.child_effects);
  }

  // Distinct grant targets. A power that grants MORE THAN ONE distinct
  // Temporary_Powers proc is a mutually-exclusive MODE system (Bio Armor's
  // Offensive/Defensive/Efficient adaptations each grant all three adaptation
  // procs, mode-gated inside the proc power, with no group-level requires to
  // tell them apart) — attaching a flat proc would wrongly show the offensive
  // toxic DoT on the defensive stance. Those mode mechanics are already
  // surfaced as conditionalEffects / Mechanic Adjusters. So only the
  // single-grant, unconditional case (Molten Embrace, Hidden Flame, Toxins,
  // Envenomed Blades) resolves here — the clean "this power delivers a hidden
  // DoT" shape.
  const distinct = [...new Set(targets.map(t => t.toLowerCase()))];
  if (distinct.length !== 1) return undefined;

  const proc = _buildGrantedDamageProc(distinct[0]);
  return proc ? [proc] : undefined;
}

function _buildGrantedDamageProc(pName) {
  const filePath = resolveRedirectPath(pName);
  if (!fs.existsSync(filePath)) return null;
  let json;
  try { json = JSON.parse(fs.readFileSync(filePath, 'utf-8')); } catch { return null; }
  if (!json.effects || json.effects.length === 0) return null;

  // Lenient PvE walk: collect damage templates, dropping only the PvP
  // (`enttype target> player eq`) variant. The granted proc's other guards
  // (Judgement exclusions, the `activateperiod==0` burst/DoT split, `critter eq`)
  // are engine-internal and always hold for the normal PvE DoT — collect through
  // them rather than treating them as conditional gates, because
  // `collectTemplatesWithChance` reads `activateperiod==0` as a conditional gate
  // and would skip the whole damage group. (The granted proc's damage genuinely
  // lives on a `Melee_PvPDamage`-named table, so the redirect resolver's
  // `/pvp/i`-table drop is also wrong here — the requires, not the table name, is
  // the PvE/PvP discriminator.)
  const templates = [];
  const walk = (effs) => {
    for (const e of effs || []) {
      if (e.is_pvp === 'PVP_ONLY') continue;
      if (/\benttype\s+target>\s+player\s+eq/i.test(e.requires_expression || '')) continue;
      for (const t of (e.templates || [])) templates.push(t);
      walk(e.child_effects);
    }
  };
  walk(json.effects);

  const dmg = extractDamage(templates, json);
  // Real attack damage only — extractDamage also returns `Heal` entries (a
  // granted heal-over-time, e.g. Bio's Defensive_Adaptation_Proc), which is not
  // a damage proc. Keep the elemental/Special types; heals belong elsewhere.
  const dmgArr = (dmg ? (Array.isArray(dmg) ? dmg : [dmg]) : []).filter(d => d.type !== 'Heal');
  if (dmgArr.length === 0) return null; // state grant / +Dmg buff / heal — not a damage proc

  // Dedup identical (type, scale, table) — the critter + activateperiod-split
  // variants are the same DoT collected twice.
  const seenDmg = new Set();
  const damage = [];
  let duration, period;
  for (const d of dmgArr) {
    const k = `${d.type}|${d.scale}|${d.table}`;
    if (seenDmg.has(k)) continue;
    seenDmg.add(k);
    damage.push({ damageType: d.type, scale: d.scale, table: d.table });
    if (d.duration !== undefined && duration === undefined) duration = d.duration;
    if (d.tickRate !== undefined && period === undefined) period = d.tickRate;
  }

  // Damage-bearing templates only (exclude buff/debuff tables, mirroring
  // extractDamage). Enhanceable when NONE carry IgnoreStrength — the I28P3
  // Molten Embrace change is exactly removing IgnoreStrength from this proc.
  const dmgTemplates = templates.filter(t =>
    (t.attribs || []).some(a => isDamageTypeAttrib((a || '').toLowerCase())) &&
    !/buff|debuff/i.test(t.table || ''));
  const enhanceable = dmgTemplates.length > 0 &&
    !dmgTemplates.some(t => (t.flags || []).includes('IgnoreStrength'));

  // Per-application proc chance ("chance to inflict … over time").
  let tickChance;
  for (const t of dmgTemplates) {
    if (typeof t.tick_chance === 'number' && t.tick_chance > 0 && t.tick_chance < 1) {
      tickChance = Math.round(t.tick_chance * 100) / 100;
      break;
    }
  }

  return {
    name: json.name,
    displayName: json.display_name || json.name,
    damage,
    enhanceable,
    ...(tickChance !== undefined ? { tickChance } : {}),
    ...(period !== undefined ? { period } : {}),
    ...(duration !== undefined ? { duration } : {}),
  };
}

/**
 * Derive a player-friendly label for a Grant_Power template's target.
 *
 * `params.power_names[0]` is a dotted internal name like
 * `Temporary_Powers.Temporary_Powers.Psionic_Melee_Insight`. Strategy:
 *   1. Take the leaf segment (`Psionic_Melee_Insight`).
 *   2. If a sibling conditional shares the same leaf id (case-insensitive),
 *      use the conditional's already-curated `label`. This picks up
 *      curated overrides like `beam_rifle_debuff → "Disintegrating"` and
 *      ensures consistency with the Mechanic Adjuster surface.
 *   3. Otherwise strip a recognizable powerset-name prefix from the leaf
 *      (e.g. `Psionic_Melee_Insight` → `Insight`) and prettify
 *      underscores to spaces / title-case.
 */
function _labelFromGrantedPowerName(dotted, conditionalEffects) {
  if (!dotted) return 'state';
  const leaf = dotted.split('.').pop() || dotted;
  const leafLower = leaf.toLowerCase();
  const cond = (conditionalEffects ?? []).find(c => c.id.toLowerCase() === leafLower);
  if (cond) return cond.label;
  // Strip a `<Word>_<Word>_` prefix when the trailing fragment is short
  // and meaningful on its own. Heuristic: split on `_`, take last 1-2
  // segments depending on length.
  const parts = leaf.split('_');
  const candidate = parts.length >= 3 ? parts.slice(-1).join(' ') : parts.join(' ');
  return candidate.replace(/\b\w/g, (c) => c.toUpperCase());
}

function _prettifyEffectAttrib(attrib) {
  // Map raw attrib names to player-friendly labels. Most attribs already
  // read fine ("Knockback", "Stunned"); a handful need touch-ups.
  const overrides = {
    Knockup: 'Knock Up',
    Stunned: 'Stun',
    Confused: 'Confuse',
    Held: 'Hold',
    Terrorized: 'Fear',
  };
  return overrides[attrib] ?? attrib;
}

// Suffix tokens that, when shared by 2+ conditionals on the same power,
// indicate a mutually-exclusive group. Keep this list curated rather than
// auto-detected to avoid spurious groupings (e.g. two unrelated mechanics
// happening to share the trailing word "Active").
const GROUP_SUFFIXES = ['adaptation', 'combo'];

function _annotateConditionalGroups(entries) {
  // 1. Stack-count form: ids like `tidal_power-3` share stem `tidal_power`.
  const stackStems = new Map(); // stem → [entry, ...]
  for (const e of entries) {
    const m = e.id.match(/^(.+?)-(\d+)$/);
    if (m) {
      const stem = m[1];
      if (!stackStems.has(stem)) stackStems.set(stem, []);
      stackStems.get(stem).push(e);
    }
  }
  for (const [stem, members] of stackStems) {
    if (members.length >= 2) {
      for (const e of members) e.group = `${stem}-stacks`;
    }
  }

  // 2. Suffix-word groups (e.g. Bio Armor adaptations).
  for (const suffix of GROUP_SUFFIXES) {
    const matches = entries.filter(e => !e.group && e.id.endsWith(suffix));
    if (matches.length >= 2) {
      for (const e of matches) e.group = suffix;
    }
  }

  // 3. Combo Level N — ids like `combo_level_1`, `combo_level_2`, etc.
  //    Detect via shared `_level_N` suffix on otherwise identical stems.
  const levelStems = new Map();
  for (const e of entries) {
    if (e.group) continue;
    const m = e.id.match(/^(.+?)_level_(\d+)$/);
    if (m) {
      const stem = m[1];
      if (!levelStems.has(stem)) levelStems.set(stem, []);
      levelStems.get(stem).push(e);
    }
  }
  for (const [stem, members] of levelStems) {
    if (members.length >= 2) {
      for (const e of members) e.group = `${stem}-levels`;
    }
  }

  // 4. Staff Fighting "Perfection of <form>" family. The finisher bonuses on
  //    Sky Splitter / Eye of the Storm are gated on Perfection of Body / Mind /
  //    Soul (`perfection_of_body_level_3`, …). You fight in one Staff form at a
  //    time, so the perfection tracks are mutually exclusive — but each form is
  //    a distinct level-stem with a single member, so pass 3 leaves them
  //    ungrouped. Group the whole family together so the InfoPanel renders one
  //    mutually-exclusive radio (consistent with Bio Armor's adaptation modes).
  const perfectionMembers = entries.filter(e => !e.group && /^perfection_of_/.test(e.id));
  if (perfectionMembers.length >= 2) {
    for (const e of perfectionMembers) e.group = 'staff-form';
  }

  // NOTE: grouping (mutual-exclusivity between siblings) and `mode` (whether an
  // active member REPLACES or ADDS TO the base power's effects) are orthogonal.
  // We intentionally do NOT force grouped entries to `mode: 'replace'`.
  //
  // The genuine replace case is detected earlier via `baseNegated`: a base
  // template that negates the conditional's own predicate (Suffocate's -Def:
  // base "if NOT drowning", conditional "if drowning"). Those mutex *variants*
  // correctly overwrite the base.
  //
  // Bio Armor's adaptation modes are the counter-example that proved the old
  // blanket rule wrong: the raw `.powers` def shows the base armor mods have NO
  // `Requires` (always-on) and each mode mod is `Requires k<Mode>Adaptation
  // source.Mode?` — they ADD on top (base +Def 1.5 plus mode +Def 0.45 = 1.95).
  // Forcing `replace` made the InfoPanel drop the always-on base. Grouped
  // conditionals therefore default to additive (mode omitted) unless the
  // negated-base detection found a real replace.
}

/**
 * Recursively collect all templates from an effects array, including child_effects.
 * Filters out PVP_ONLY effects and effects with chance=0 (conditional procs).
 *
 * @param {Array} effects - Array of effect objects
 * @param {boolean} parentCombatGated - True when ancestor Effect's requires gates out-of-combat
 * @returns {Array} - Flat array of all template objects
 */
function collectAllTemplates(effects, parentCombatGated = false) {
  const templates = [];

  for (const effect of effects) {
    // Skip PVP-only effects
    if (effect.is_pvp === 'PVP_ONLY') continue;

    // Drop the PvP variant of a PvE/PvP `enttype` pair. HC splits many powers
    // into `enttype target> critter eq` (PvE) and `enttype target> player eq`
    // (PvP) groups, both tagged is_pvp='EITHER', so the PVP_ONLY skip above
    // never catches them. Because extractEffects writes single-valued keyed
    // slots (last-write-wins) and the PvP group is emitted last, its scale/
    // table/duration would clobber the correct PvE values (Flash Arrow showed
    // the PvP -0.5/20s ToHit instead of -0.75/60s; Ice Arrow inherited the PvP
    // 10s -Special + a Ranged_Special runSpeed). `continue` drops the whole
    // subtree (including child_effects), matching collectInfoRedirectTemplates
    // (~line 1023) and GAME-DATA-PRINCIPLES §3 "prefer PvE". There is no
    // per-power PvP mode in the planner, so PvP-only content is correctly
    // omitted rather than surfaced.
    if (effect.requires_expression
        && /\benttype\s+target>\s+player\s+eq/.test(effect.requires_expression)) continue;

    // Skip chance=0 ONLY when the effect is empty (proc placeholder).
    // Effects with chance=0 plus templates or child_effects are Tag-gated
    // (Evasive Maneuvers' FlightActive outer Effect carries Fly speed,
    // movement control, and nested KB-protection children at chance=0).
    if ((effect.chance === 0 || effect.chance === 0.0)
        && (!effect.templates || effect.templates.length === 0)
        && (!effect.child_effects || effect.child_effects.length === 0)) continue;

    // Skip effects tagged as Containment (Controller inherent conditional damage).
    // Containment damage is handled separately via the containment toggle in the UI.
    if (effect.tags && effect.tags.includes('Containment')) continue;

    // Skip conditional inherent bonuses (crit damage from hide/placate, Scourge procs).
    // These are handled by the UI's inherent toggle system.
    let combatGated = parentCombatGated;
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      // Dead-state effects (self-rez conditions)
      if (req.includes('kHitPoints == 0')) continue;
      // Stalker/Widow hidden-state bonus damage (kMeter > 0 = in hide mode)
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      // Scourge / random proc conditional damage
      if (req.includes('rand()')) continue;
      // Mode-based conditional bonuses (Bio Armor Adaptation, Kheldian forms, etc.)
      // These are mutually exclusive modes — the base unconditional effects provide
      // the default values; mode-specific bonuses would overwrite them incorrectly
      if (req.includes('Source.Mode?') || req.includes('kMode')) continue;
      // Out-of-combat gating (pool Stealth, Invisibility) — propagate downward.
      // The `_isConditionalGate` check below also matches these; gating with
      // `else` keeps combat-gated effects (and their nested children) flowing
      // through with combatGated=true so the suppressible defense reaches
      // the extractor.
      const outOfCombat = _isOutOfCombatGate(req);
      if (outOfCombat) combatGated = true;
      // Generic positive-state-gate skip — covers Parse6's per-template gates
      // (drowning, Domination boost, etc.) that HC encodes via the explicit
      // checks above. Negated gates ("target NOT drowning") describe the
      // base case and pass through.
      if (!outOfCombat && _isConditionalGate(req)) continue;
    }

    // Collect templates from this level
    if (effect.templates && effect.templates.length > 0) {
      for (const t of effect.templates) {
        // Event-gated mods (`RequiredEvents` tail — bonus damage vs Held/Slept
        // targets, repel-while-Immobilized) fire only while the event is live,
        // so they are conditional, not base. Template-level gate, unlike the
        // group-level requires skips above. The atom keeps them (gated: true,
        // requiredEvents on the wire).
        if (_hasRequiredEvents(t)) continue;
        if (combatGated) _tagCombatGated(t);
        _tagGroupContext(t, effect);
        templates.push(t);
      }
    }

    // Recurse into child_effects
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectAllTemplates(effect.child_effects, combatGated));
    }
  }

  return templates;
}

/** Template-level `RequiredEvents` gate (AttribMod tail): the mod applies only
 *  while one of the listed events is live on the target/caster. Any carrier is
 *  conditional — the base collectors skip it; atoms carry it gated. */
function _hasRequiredEvents(t) {
  return Array.isArray(t.required_events) && t.required_events.length > 0;
}

/**
 * Plan B, Phase 1 — collect EVERY template, dropping nothing. The atom-list
 * counterpart to `collectAllTemplates`.
 *
 * `collectAllTemplates` (above) drops eight classes of effect group — PvP-only,
 * the PvP half of an `enttype` twin, empty chance=0 procs, Containment,
 * dead-state, hidden-state (`kMeter`), `rand()`, mode/stance (`Source.Mode?`),
 * and generic positive-state gates. Read its comments and every drop has the
 * same root justification: the bag's slots are single-valued and last-write-wins,
 * so a gated group would CLOBBER the base value ("the PvP group is emitted last,
 * its scale/table/duration would clobber the correct PvE values"). The drops are
 * a bag-era workaround, not a statement that the effects aren't real — they all
 * exist in game, under a condition.
 *
 * The atom list has no slots to clobber, so it keeps them all. Every drop reason
 * survives as a first-class field ON the atom, which is what lets a consumer
 * re-derive any of these subsets exactly:
 *
 *   PvP-only group          → pvMode: 'PvP'
 *   PvP `enttype` twin      → requiresExpression (`enttype target> player eq`)
 *   chance=0 proc           → baseProbability: 0
 *   mode/stance, kMeter,    → requiresExpression (the verbatim gate)
 *     rand(), dead-state,
 *     Containment
 *   out-of-combat           → specialCase: 'OutOfCombat'
 *   RequiredEvents template → requiredEvents (comma-joined event names)
 *
 * Consequence, and the reason this exists: the conditional/stance bags
 * (`power.conditionalEffects` — Bio Armor's adaptations et al.) are built from
 * `powerJson.effects` DIRECTLY, i.e. from exactly the groups `collectAllTemplates`
 * filtered out. Emitting atoms from the filtered list therefore left every
 * conditional bag with no atom behind it (49 powers; caught corpus-wide by
 * `scripts/planb-shadow-bag.cjs`), which would have silently blocked Phase 2 from
 * migrating the resource appliers that Bio Armor feeds.
 *
 * NB this does NOT feed the bag — `extractEffects` still reads
 * `collectAllTemplates`, so `power.effects` is byte-identical. Both collectors
 * tag templates via the idempotent `_tagGroupContext`, so running both over the
 * same power JSON is safe.
 */
function collectAtomTemplates(effects, parentCombatGated = false) {
  const templates = [];
  for (const effect of effects || []) {
    let combatGated = parentCombatGated;
    if (effect.requires_expression && _isOutOfCombatGate(effect.requires_expression)) {
      combatGated = true;
    }
    for (const t of effect.templates || []) {
      if (combatGated) _tagCombatGated(t);
      _tagGroupContext(t, effect);
      templates.push(t);
    }
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectAtomTemplates(effect.child_effects, combatGated));
    }
  }
  return templates;
}

/**
 * Extract damage effects from raw effect templates
 * Only extracts ACTUAL damage (aspect "Cur" or "Abs"), not damage buffs/debuffs
 */
/**
 * Strip Fiery Embrace bonus Fire damage from melee powers that aren't
 * fire-themed.
 *
 * In HC's Parse7 binary the FE bonus template carries `chance: 0.0` (it
 * only fires when FE is active, the engine flips chance→1 at runtime),
 * which `collectAllTemplates` correctly filters out. Parse6 (Rebirth)
 * has a flat AttribMod struct_array with no EffectGroup wrapper, so the
 * chance/requires gating that suppresses the FE template in HC isn't
 * captured — the Fire entry ships as unconditional damage on every melee
 * power. Symptom: Brute Energy Melee Barrage's Attack Type reads
 * "Smash/Energy/Fire" instead of "Smash/Energy".
 *
 * Heuristic: Fire damage on a Melee_Damage table on a non-fire-themed
 * powerset → drop. Fire-themed powersets (Fiery Melee, Fiery Assault,
 * Fire Manipulation) genuinely deal Fire damage and are kept.
 *
 * `(?<![a-z0-9])` rather than `\b`: underscore is a WORD character, so `\bfire` does NOT
 * match `Epic.Corruptor_Fire_Mastery` — there is no boundary between `_` and `F`. The
 * `\b` form only ever worked because POWERSET names happen to put a `.` before the theme
 * word (`Blaster_Support.Fire_Manipulation`); it silently depends on that convention.
 * Sets named `<AT>_Fire_Mastery` (every epic pool) read as non-fire-themed.
 *
 * Unreachable today — this filter is only applied to powerset powers, whose names all
 * carry the `.`. It is fixed rather than left alone because the trap is invisible at the
 * call site: sharing this helper with convert-epic-pools.cjs looks safe and immediately
 * strips genuine Fire damage from every `*_Fire_Mastery` pool. Tried 2026-07-15; caught
 * before shipping only because Rebirth's Pyre Mastery Fire Ball came out as
 * "Smashing 0.2" with no Fire at all.
 *
 * NOTE for anyone who does apply this to epic pools: the theme list is ALSO incomplete
 * for them — `Pyre_Mastery` and `Heat_Mastery` are fire pools that match none of these
 * words. Fixing the regex alone is not enough. See docs/converter-unification-direction.md.
 */
const FIRE_THEMED_POWERSET_RE = /(?<![a-z0-9])(fire|fiery|flame|burn|magma|lava|inferno|blaze|cinder|ember|combust)/i;
function _filterFieryEmbraceBonus(damage, powerJson) {
  if (!damage) return damage;
  const powerset = powerJson.powerset || powerJson.full_name || '';
  if (FIRE_THEMED_POWERSET_RE.test(powerset)) return damage; // genuine fire set
  const arr = Array.isArray(damage) ? damage : [damage];
  const filtered = arr.filter((d) => {
    if (d.type !== 'Fire') return true;
    const table = (d.table || '').toLowerCase();
    if (table.startsWith('melee_damage')) return false; // FE bonus pattern
    return true;
  });
  if (filtered.length === arr.length) return damage; // no change
  if (filtered.length === 0) return undefined;
  return filtered.length === 1 ? filtered[0] : filtered;
}

// ============================================
// magnitude_expression — the CoH stack-machine evaluator
// ============================================
/*
 * A template's `magnitude_expression` is an RPN program the game runs to compute
 * that AttribMod's magnitude. `scale` alone is NOT the answer when one is present:
 * the program is free to divide, split or ramp it, and HC uses that freely.
 *
 * The canonical case is a fast ("Quick") snipe. `proton_volley_quick.json` stores
 * the whole SHOT in `scale` (2.28) and puts the per-tick divisor in the program:
 *
 *   cur.kToHit source> 0.75 - 0.22 / -1.0 1.0 minmax 0.210526316 * 1 + @StdResult * 4 /
 *   └──────────────── the ToHit ramp ─────────────────────────────┘ └ StdResult ┘ └ ÷4 ┘
 *
 * The template is a 4-tick DoT (1.6s / 0.5s), and the display multiplies per-tick ×
 * ticks — so reading `scale` verbatim reported exactly 4× the real damage.
 *
 * WHAT THIS EVALUATOR DELIBERATELY DOES NOT DO: evaluate the ToHit ramp. It is
 * treated as an OPAQUE FACTOR OF 1 and dropped where it multiplies `@StdResult`.
 * The three ramp families store their scale at DIFFERENT reference points —
 * blaster/corruptor/defender (`0.210526316 * 1 +`) and epic (`0.314285714 * 1 +`)
 * evaluate to 1.0 at neutral ToHit (kToHit 0.75), but dominator (`0.25 * .75 +`)
 * evaluates to 0.75 there. Computing the ramp numerically would silently move all
 * of the dominator and epic quick snipes, which are correct today. Whether snipe
 * damage should respond to +ToHit at all is a separate product question; folding
 * only the statically-constant factor leaves it open.
 *
 * ALL-OR-NOTHING, over the WHOLE program. Folding a "trailing" fragment is not a
 * cheaper version of this — it is wrong three ways: the substring after
 * `@StdResult` starts with an operator, not a number; `@StdResult * 10 /
 * areafactor power.base> / .15 *` would fold the `10 /` and then hit a read it
 * cannot resolve (a 10× UNDER-read); and `activatetime power.base> 0.70 *
 * rechargetime power.base> 0.04 * + 0.40 + @StdResult * 3 /` carries its whole
 * magnitude in the PREFIX (penetrating_ray: 0.7×3.4 + 0.04×12 + 0.40 = 3.26, which
 * the same file's non-Expression PvP sibling confirms as a literal 3.26 scale).
 *
 * BAILING IS THE DEFAULT. Any token this does not fully understand — `distance`,
 * `areafactor power.base>`, `Pool.Fighting.Kick source.ownPowerNum?`, `@ToHit`,
 * `kFocusFire_* target.mode?` — aborts the whole evaluation and leaves `scale`
 * exactly as the binary stored it.
 */

/**
 * Operand algebra. Two kinds only:
 *
 *   PROD   — a constant `k` times an unordered multiset of opaque SYMBOLS
 *            (`std` = @StdResult, `maxhp.source`/`maxhp.target`, `strength`).
 *            No symbols ⇒ a plain number.
 *   OPAQUE — a value we deliberately refuse to compute (the ToHit ramp). It
 *            survives arithmetic with plain numbers and is ANNIHILATED (treated
 *            as 1) when multiplied by a symbolic value.
 *
 * Callers assert on the symbol multiset, so an expression that resolves to the
 * wrong shape (`Max.kHitPoints` where damage expected `@StdResult`) is rejected
 * rather than silently mis-read.
 */
const _exprProd = (k, syms = []) => ({ kind: 'prod', k, syms });
const _EXPR_OPAQUE = Object.freeze({ kind: 'opaque' });

/** Numeric literal: `2.28`, `.75`, `-1.0`. Requires a digit, so bare `-` stays an operator. */
const _EXPR_NUMBER_RE = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * Reads that resolve to a SYMBOL — a runtime quantity we carry through the algebra
 * unevaluated and hand back to the caller to interpret. Keys are lowercased and may
 * be one or two whitespace-separated tokens (`<name> <accessor>`); two-token keys
 * are matched first.
 */
const _EXPR_SYMBOL_READS = new Map([
  ['@stdresult', 'std'],                       // table[level] × effectiveness × scale × strength
  ['@strength', 'strength'],                   // the caster's matching enhancement/buff strength
  ['max.khitpoints source>', 'maxhp.source'],  // the CASTER's max HP
  ['max.khitpoints target>', 'maxhp.target'],  // the TARGET's max HP — a different quantity
]);

/**
 * Reads that resolve to OPAQUE. Only the caster's current ToHit: it is the ramp input
 * on every fast-snipe redirect, and neutralizing it is this evaluator's whole point.
 * Nothing else earns opacity — an unlisted read bails.
 */
const _EXPR_OPAQUE_READS = new Set(['cur.ktohit source>']);

/**
 * Reads that resolve to a SCALAR off the owning power. `power.base>` means the power
 * the AttribMod lives on, at base (unenhanced) values — for a redirect that is the
 * redirect TARGET's file, not the shell's, which is why the scalars are stamped per
 * template as the collectors follow a redirect (see `_stampOwnerScalars`).
 *
 * `areafactor power.base>` and `activateperiod power.base>` are deliberately ABSENT.
 * The converter has no verified area-factor derivation (`getPPMAreaFactor` in
 * proc-data.ts is the PPM denominator, which has not been proven to be the same
 * quantity the expression VM reads), and an unverified stand-in here would silently
 * rescale real damage. Absent ⇒ bail ⇒ `scale` untouched.
 *
 * A NON-POSITIVE scalar is UNRESOLVED, not zero — see `_exprPowerScalar`.
 */
const _EXPR_POWER_SCALARS = new Map([
  ['activatetime power.base>', 'activationTime'],
  ['rechargetime power.base>', 'rechargeTime'],
]);

/**
 * Resolve a `power.base>` scalar, or null to BAIL.
 *
 * A ZERO (or missing) activation/recharge time is ABSENCE, not the number zero.
 * Every damage-proc and granted-power shell in the export declares
 * `activation_time: 0.0, recharge_time: 0.0` — Molten Embrace, Envenomed Blades,
 * Shinobi, the Bio adaptation procs, the Hybrid Assault double-hits — because their
 * `power.base>` reads bind at runtime to the HOST power that triggered them, which
 * the converter cannot identify while converting the shell. Reading those zeros as
 * literals turns the standard proc-damage formula
 * `activatetime power.base> 0.70 * rechargetime power.base> 0 20 minmax 0.04 * + 0.40 +`
 * into a constant 0.40 and `activatetime power.base> @StdResult *` into a flat ZERO —
 * 21 templates silently rescaled to 40% and one heal deleted outright. Caught only by
 * censusing every fold before trusting the regen diff, which is why this gate exists:
 * a plausible number manufactured from a missing field is worse than no fold at all
 * (GAME-DATA-PRINCIPLES §3, "decode absence as absence").
 *
 * The 96 files that DO declare a positive cast are real powers and real redirect
 * targets (the snipe Normal/Quick pair among them), where `power.base>` genuinely
 * means that file.
 */
function _exprPowerScalar(v) {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null;
}

/** `a op b` under the operand algebra. Returns null to BAIL. */
function _exprBinary(op, a, b) {
  const aNum = a.kind === 'prod' && a.syms.length === 0;
  const bNum = b.kind === 'prod' && b.syms.length === 0;

  if (op === '*') {
    if (a.kind === 'prod' && b.kind === 'prod') {
      return _exprProd(a.k * b.k, [...a.syms, ...b.syms]);
    }
    if (a.kind === 'opaque' && b.kind === 'opaque') return null;
    // OPAQUE × SYMBOLIC — the ramp-drop rule: the opaque factor becomes 1 and the
    // symbolic operand passes through with its own coefficient intact.
    // OPAQUE × plain NUMBER is still opaque (this is how the ramp is BUILT).
    const known = a.kind === 'prod' ? a : b;
    return known.syms.length > 0 ? known : _EXPR_OPAQUE;
  }

  if (op === '/') {
    if (b.kind === 'opaque') {
      // A known number over an unknown is simply unknown; a SYMBOL over an unknown
      // would silently drop the ramp in the wrong direction, so bail.
      return aNum ? _EXPR_OPAQUE : null;
    }
    if (b.syms.length > 0 || b.k === 0) return null;
    if (a.kind === 'opaque') return _EXPR_OPAQUE;
    return _exprProd(a.k / b.k, a.syms);
  }

  // `+` / `-`: symbols do not add. Only plain numbers combine, and an OPAQUE
  // absorbs a plain number (`… 0.210526316 * 1 +` — the ramp's offset).
  if (a.kind === 'opaque' && bNum) return _EXPR_OPAQUE;
  if (b.kind === 'opaque' && aNum) return _EXPR_OPAQUE;
  if (aNum && bNum) return _exprProd(op === '+' ? a.k + b.k : a.k - b.k);
  return null;
}

/**
 * 3-operand clamp. Pushed as `value lo hi minmax`, so the pops come off hi-first —
 * verified against the known-correct programs: `cur.kToHit source> 0.75 - 0.22 /
 * -1.0 1.0 minmax` clamps the ToHit delta to [-1, 1], and `rechargetime power.base>
 * 0 20 minmax` clamps a recharge to [0, 20]. Reading it the other way round would
 * produce clamp(1, -1, X) — a constant — on every one of them.
 */
function _exprMinmax(value, lo, hi) {
  if (lo.kind !== 'prod' || lo.syms.length > 0) return null;
  if (hi.kind !== 'prod' || hi.syms.length > 0) return null;
  if (value.kind === 'opaque') return _EXPR_OPAQUE;
  if (value.syms.length > 0) return null;
  return _exprProd(Math.min(hi.k, Math.max(lo.k, value.k)));
}

/**
 * Run a `magnitude_expression` through the operand algebra.
 *
 * @param {string} expr  the raw RPN program
 * @param {{activationTime?: number, rechargeTime?: number}} ctx  owning-power scalars
 * @returns {{kind:'prod', k:number, syms:string[]}|null} the single resulting operand,
 *   or null when anything at all could not be resolved (unknown read, unsupported
 *   operator, stack underflow, symbol arithmetic, leftover operands).
 */
function evalMagnitudeExpression(expr, ctx = {}) {
  const src = (expr || '').trim();
  if (!src) return null;
  const tokens = src.split(/\s+/);
  const stack = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (_EXPR_NUMBER_RE.test(tok)) {
      stack.push(_exprProd(parseFloat(tok)));
      continue;
    }

    if (tok === '+' || tok === '-' || tok === '*' || tok === '/') {
      if (stack.length < 2) return null;
      const b = stack.pop();
      const a = stack.pop();
      const r = _exprBinary(tok, a, b);
      if (!r) return null;
      stack.push(r);
      continue;
    }

    if (tok === 'minmax') {
      if (stack.length < 3) return null;
      const hi = stack.pop();
      const lo = stack.pop();
      const value = stack.pop();
      const r = _exprMinmax(value, lo, hi);
      if (!r) return null;
      stack.push(r);
      continue;
    }

    // A value READ. Two-token reads (`<name> <accessor>`) are matched first so the
    // accessor is never mistaken for a standalone token.
    const two = `${tok} ${tokens[i + 1] || ''}`.toLowerCase();
    if (_EXPR_SYMBOL_READS.has(two)) {
      stack.push(_exprProd(1, [_EXPR_SYMBOL_READS.get(two)]));
      i++;
      continue;
    }
    if (_EXPR_OPAQUE_READS.has(two)) {
      stack.push(_EXPR_OPAQUE);
      i++;
      continue;
    }
    if (_EXPR_POWER_SCALARS.has(two)) {
      const v = _exprPowerScalar(ctx[_EXPR_POWER_SCALARS.get(two)]);
      if (v === null) return null; // not threaded, or absent-as-zero ⇒ bail
      stack.push(_exprProd(v));
      i++;
      continue;
    }
    const one = tok.toLowerCase();
    if (_EXPR_SYMBOL_READS.has(one)) {
      stack.push(_exprProd(1, [_EXPR_SYMBOL_READS.get(one)]));
      continue;
    }

    return null; // unknown token — BAIL, leaving the caller's raw value alone
  }

  if (stack.length !== 1) return null;
  return stack[0].kind === 'prod' ? stack[0] : null;
}

/**
 * The constant factor a `magnitude_expression` applies on top of the template's own
 * `scale`, or null when the program is not exactly `k × @StdResult`.
 *
 * `@StdResult` IS `table[level] × effectiveness × scale × strength` (attribmod.c
 * `mod_Fill`), i.e. the value the converter already computes from scale+table — so a
 * program that reduces to `k × @StdResult` is precisely "the usual value, times k",
 * and multiplying `scale` by `k` reproduces it. `k === 1` is a no-op by construction,
 * which is the right answer for every ramp-only snipe program.
 */
function stdResultCoefficient(expr, ctx) {
  const r = evalMagnitudeExpression(expr, ctx);
  if (!r) return null;
  if (r.syms.length !== 1 || r.syms[0] !== 'std') return null;
  return Number.isFinite(r.k) ? r.k : null;
}

/**
 * Owning-power scalars for `power.base>` reads, preferring the per-template stamp a
 * collector left when it followed a redirect into another power's file over the
 * caller's own power JSON.
 */
function _exprCtxFor(template, powerJson) {
  return {
    activationTime: template._ownerActivationTime ?? powerJson?.activation_time,
    rechargeTime: template._ownerRechargeTime ?? powerJson?.recharge_time,
  };
}

/**
 * @param {Array} templates - flat template list (already collector-filtered)
 * @param {Object} [powerJson] - the power these templates belong to, for `power.base>`
 *   reads in a `magnitude_expression`. Optional: absent scalars make the evaluator
 *   bail, which leaves `scale` as-is — the same output this function produced before
 *   expressions were read at all.
 */
function extractDamage(templates, powerJson) {
  const damages = [];

  for (const template of templates) {
    if (!template.attribs || !template.scale) continue;

    const attrib = template.attribs[0]?.toLowerCase();
    // Thunderspy stores damage with a single generic `Damage` attrib (the specific
    // element — Fire/Smashing/… — is NOT on the AttribMod at all; it lives only in the
    // power's shortHelp `DMG(...)` clause and in the numeric power-level `attack_types`
    // index array), unlike HC/Rebirth which use per-type attribs (Smashing, Fire, …).
    // Map the generic one to a typeless `Special` damage entry so the scale/table (the
    // load-bearing magnitude) is captured. HC/Rebirth never use a bare `damage` attrib,
    // so this branch is Thunderspy-only and can't change their output.
    //
    // Element-type refinement for PLAYER powers is deliberately deferred, NOT a quick win
    // (scoped 2026-07-19, see DATA-GAP-REGISTER.md TSPY-3 "damage-typing" note): nothing
    // CONSUMES applied damage yet — coh_math has no damage-output/DPS calc, only the
    // aspect=Str damageBuff and aspect=Res resistance faces (already typed for tspy via
    // the bare-type@Res path), so typing these aspect=Absolute atoms would move zero
    // totals. When a damage-output feature lands, recover the element the Rule-0 way — the
    // pet path already does the shortHelp `DMG(...)` parse (convert-pet-entities.cjs
    // `_tspyDamageType`); the more-upstream alternative is decoding `attack_types` at the
    // parser via ATTRIB_NAME_THUNDERSPY (per-power/multi-type ambiguity to resolve).
    const damageType = DAMAGE_TYPES[attrib] ?? (attrib === 'damage' ? 'Special' : undefined);
    const aspect = template.aspect?.toLowerCase();

    // A BARE by-type attrib (no `_dmg` suffix) at aspect Current is the DEFENSE
    // characteristic, not damage — the damage face is always written `<type>_Dmg`, and
    // every bare-by-type@Current template is defense (atomic-effect.ts classify, HC-wide
    // verified 2026-07-05). extractEffects routes it to defenseBuff; skip it here so the
    // accolade click buffs (Demonic Aura, Eye of the Magus) don't read a phantom damage entry.
    if (damageType && attrib !== 'damage' && !attrib.endsWith('_dmg') &&
        (aspect === 'current' || aspect === 'cur')) {
      continue;
    }

    // Only extract as "damage" if:
    // 1. It's a damage type attribute
    // 2. The aspect indicates actual damage: "Absolute", "Current", "Cur", "Abs"
    // 3. NOT "Strength" (damage buff/debuff) or "Resistance" (resistance debuff)
    const isDamageAspect = !aspect ||
      aspect === 'absolute' ||
      aspect === 'current' ||
      aspect === 'cur' ||
      aspect === 'abs';

    if (damageType && isDamageAspect) {
      // Skip if this is clearly a buff/debuff (check table name)
      if (template.table?.toLowerCase().includes('debuff') ||
          template.table?.toLowerCase().includes('buff')) {
        continue;
      }

      // Fold the statically-constant factor of the template's magnitude program
      // into `scale`. A fast snipe stores the whole SHOT in `scale` and puts the
      // per-tick divisor (`… @StdResult * 4 /`) or the type split (`… * 0.3 *` /
      // `… * 0.7 *`) in the program; reading `scale` verbatim over-reported those
      // by exactly that factor. `stdResultCoefficient` returns null — leaving
      // `scale` untouched — for anything it cannot evaluate whole, and 1 for the
      // ramp-only programs, so this is a no-op everywhere but the split shapes.
      // `toPrecision(12)` only on the folded path: exported scales are float32-derived
      // (≤ 7 significant digits), so 12 preserves every real digit while clearing the
      // ×k artifact (2.28 × 0.3 = 0.6839999999999999 → 0.684). Untouched scales are
      // passed through bit-identically.
      const magFactor = template.magnitude_expression
        ? stdResultCoefficient(template.magnitude_expression, _exprCtxFor(template, powerJson))
        : null;

      const dmg = {
        type: damageType,
        scale: magFactor === null
          ? template.scale
          : Number((template.scale * magFactor).toPrecision(12)),
        table: template.table,
        // IgnoreStrength heals (Inner Will, DNA Siphon, Restore Essence, etc.) must
        // not be boosted by Healing enh / global +heal. Tag only `Heal` entries so
        // the heal calc can skip enhancement; tagging attack damage would be dead
        // data (the damage calc doesn't read it, and that's a separate question).
        ...(damageType === 'Heal' && template.flags?.includes('IgnoreStrength') ? { ignoreStrength: true } : {}),
      };

      // Check for DoT
      if (template.duration && template.duration !== '0 seconds') {
        const durationMatch = template.duration.match(/([\d.]+)\s*seconds?/i);
        if (durationMatch) {
          dmg.duration = parseFloat(durationMatch[1]);
        }
      }

      // Check for ticks (periodic damage)
      if (template.application_period && template.application_period > 0) {
        dmg.tickRate = template.application_period;
      }

      // Per-tick apply chance. Many DoTs roll `tick_chance` < 1 each tick rather
      // than applying unconditionally, and CoH's CancelOnMiss flag ends the DoT
      // chain on the first miss (so tick k needs k consecutive hits — the calc
      // averages Σ chance^k, not chance·n). Capturing both lets the average match
      // the in-game tooltip; a chance of exactly 1 (or its absence) means every
      // tick lands. Only meaningful on a periodic DoT, so gate on tickRate.
      if (dmg.tickRate !== undefined &&
          typeof template.tick_chance === 'number' &&
          template.tick_chance > 0 && template.tick_chance < 1) {
        dmg.chance = Math.round(template.tick_chance * 100) / 100;
        if ((template.flags || []).includes('CancelOnMiss')) dmg.cancelOnMiss = true;
      }

      damages.push(dmg);
    }
  }

  return damages.length > 0 ? (damages.length === 1 ? damages[0] : damages) : undefined;
}

/**
 * Extract ALL effects from raw effect templates
 *
 * Aspect meanings:
 * - "Strength" = affects target's OUTPUT (damage dealt, etc.) - buff/debuff
 * - "Resistance" = affects target's RESISTANCE to that type - buff/debuff
 * - "Current" / "Absolute" = affects current/absolute value (actual damage, healing)
 * - "Maximum" = affects max value (max HP, max endurance)
 *
 * Template.type meanings:
 * - "Magnitude" = magnitude-based effect
 * - "Duration" = duration-based effect (used for mez)
 */
// DSH6 Phase 0a — converter-local atom ingest. Maps the flattened template list
// (with the `_group*` context tags stamped by the collectors) into the canonical
// `AtomicEffect[]` via the SHARED per-template encoder in
// src/data/core/atomic-effect.ts (`ingestTemplate`, same code path as the
// reference `ingestExportGroup`), so the converter and the DSH detectors encode
// a template identically by construction. tsx is loaded lazily+memoized so a
// plain regen (610 per-powerset node spawns × 3 datasets) pays the TS-require
// cost only when the atom path is actually exercised.
let _atomCore = null;
function _getAtomCore() {
  if (!_atomCore) {
    require('tsx/cjs');
    _atomCore = require('../src/data/core/atomic-effect.ts');
  }
  return _atomCore;
}

function templatesToAtoms(templates) {
  const { ingestTemplate, mapPvMode } = _getAtomCore();
  const atoms = [];
  let tmplIdx = 0;
  for (const t of templates || []) {
    tmplIdx++;
    if (!t || !t.attribs || t.attribs.length === 0) continue;
    const recs = ingestTemplate(t, {
      pvMode: mapPvMode(t._groupPv),
      baseProbability: t._groupChance ?? 1,
      procsPerMinute: t._groupPpm > 0 ? t._groupPpm : undefined,
      requiresExpression: t._groupRequires || undefined,
      specialCase: t._combatGated ? 'OutOfCombat' : undefined,
    });
    // Converter-local provenance (underscore-prefixed, NOT part of the
    // canonical AtomicEffect schema — identityKey/structuralKey ignore it).
    // The projection needs these to reproduce template-level bag logic
    // exactly: the twin pre-scan's multi-attrib signature, the AttackType
    // marker skip, the absorb-stack pre-scan, and the raw-string tests the
    // bag applies (empty tspy `aspect` fails a `=== 'current'` test even
    // though the canonical Aspect defaults to 'Cur'; the bag's duration
    // regex `([\d.]+)` ignores a leading minus, unlike parseDuration).
    for (const a of recs) {
      a._tmplIdx = tmplIdx;
      a._attribCount = t.attribs.length;
      a._aspect = t.aspect;
      a._table = t.table;
      a._type = t.type;
      a._target = t.target;
      a._duration = t.duration;
      a._scale = t.scale;
      a._magExpr = t.magnitude_expression;
      a._appType = t.application_type;
      a._tickChance = t.tick_chance;
      a._stack = t.stack;
      a._stackKey = t.stack_key;
      a._flags = t.flags;
      a._suppressedByEvents = !!t.suppress_events?.some(
        (se) => COMBAT_SUPPRESS_EVENTS.has(se.event)
      );
      a._combatGated = !!t._combatGated;
    }
    atoms.push(...recs);
  }
  return atoms;
}

/** Tuple position of a named atom field, read from the schema's single source of
 *  truth so a field reorder can never silently point this at the wrong slot. */
const _atomFieldIdxCache = new Map();
function _atomFieldIdx(field) {
  let idx = _atomFieldIdxCache.get(field);
  if (idx === undefined) {
    idx = _getAtomCore().ATOM_TUPLE_FIELDS.indexOf(field);
    if (idx < 0) throw new Error(`[atoms] ATOM_TUPLE_FIELDS has no '${field}' field`);
    _atomFieldIdxCache.set(field, idx);
  }
  return idx;
}

function _gatedIdx() {
  return _atomFieldIdx('gated');
}

/** Read one field off an encoded atom tuple (past-end / null ⇒ undefined). */
function _atomField(tuple, field) {
  const v = tuple[_atomFieldIdx(field)];
  return v === null ? undefined : v;
}

/** Set one field on an encoded atom tuple, padding interior positions with null.
 *  Returns a NEW tuple — the emitted arrays are shared with nothing, but keeping
 *  this pure makes the stamp sites obvious. */
function _withAtomField(tuple, field, value) {
  const idx = _atomFieldIdx(field);
  const t = tuple.slice();
  while (t.length <= idx) t.push(null);
  t[idx] = value;
  return t;
}

/**
 * Plan B — encode a template list's atoms to the compact `EncodedAtom[]` wire
 * form emitted on `Power.atoms`, serialized losslessly for the canonical schema
 * (converter-local `_`-fields and `sourceAttrib` are dropped by the encoder).
 * Returns `undefined` for an empty list so the field is simply absent.
 *
 * `baseTemplates` is the set that fed the bag (`allTemplates`). Any atom whose
 * template is NOT in it is stamped `gated: true` — it applies only under its
 * gate (mode/stance, PvP, hidden-state, chance-0 proc, …). This is the ONLY
 * place that verdict can be made accurately: base-ness depends on collection
 * provenance (redirect chains, `activation_effects` filters), not just on the
 * gate expression, so the runtime cannot re-derive it. See `AtomicEffect.gated`.
 */
function encodeAtomsForEmit(templates, baseTemplates, powerName) {
  const { encodeAtom } = _getAtomCore();
  const atoms = templatesToAtoms(templates);
  if (!atoms.length) return undefined;
  // HARD INVARIANT (asserted below, after stamping): the atoms left unstamped
  // (`baseAtoms` at runtime) must be EXACTLY the atoms of `baseTemplates` — the set
  // that fed the bag. Phase 2's appliers read `baseAtoms` in place of a bag slot, so
  // an over-inclusive stamp double-counts every gated variant (a stance-gated armor
  // summed into the base) and an under-inclusive one silently drops real effects.
  //
  // This lives in the ENCODER rather than at a call site because it is a property of
  // the encoding, and every emitter needs it: the pool/epic-pool converters gained
  // atoms later than convert-powerset.cjs, and an invariant duplicated per call site
  // is one a new emitter can forget. It also covers what the shadow harness
  // structurally cannot — that harness checks `bag ⊆ atoms` by existence, which is
  // insensitive to over-inclusion (marking every atom base still satisfies every
  // existence check — verified by mutation). Cheap and exact, so it runs unconditionally.
  const expectedBase = templatesToAtoms(baseTemplates || templates).length;
  // `templatesToAtoms` stamps `_tmplIdx` as the 1-based index into `templates`,
  // so it maps each atom back to the template it came from.
  const baseSet = new Set(baseTemplates || templates);
  const encoded = atoms.map((a) => {
    const src = templates[a._tmplIdx - 1];
    // `gated`, `perTarget` and `suppressible` are converter verdicts stamped onto
    // the atom (perTarget by `computeAoePerTargetPatches`, which alone holds the
    // AoE geometry / redirect / Defiance provenance — see AtomicEffect.perTarget).
    const patch = {};
    if (!baseSet.has(src)) patch.gated = true;
    if (src && src._perTargetIncrement) patch.perTarget = src._perTargetIncrement;
    // Combat-suppression (Hide +Def, travel buffs). Mirrors the routing's
    // `isCombatSuppressed`: an `ActivateAttackClick`-family suppress event OR an
    // OutOfCombat requires-gate. The event half is a template tail field that
    // never reaches the wire atom, so — like gated/perTarget — the runtime cannot
    // re-derive it; the converter stamps it here. See AtomicEffect.suppressible.
    if (a._suppressedByEvents || a._combatGated) patch.suppressible = true;
    return encodeAtom(Object.keys(patch).length ? { ...a, ...patch } : a);
  });

  const actualBase = encoded.filter((t) => t[_gatedIdx()] !== true).length;
  if (actualBase !== expectedBase) {
    throw new Error(
      `[atoms] base-set mismatch for "${powerName || '(unnamed)'}": ${actualBase} unstamped ` +
      `atoms but baseTemplates yields ${expectedBase}. The gated stamp no longer tracks ` +
      `the bag's template set — check for duplicate template objects in baseTemplates ` +
      `(the union's Set would collapse them) or a collector that rewrites templates.`
    );
  }
  return encoded;
}

/**
 * Serialize a Power to its generated-file literal. Identical to
 * `JSON.stringify(power, null, 2)` EXCEPT the `atoms` wire list renders one
 * tuple per line (`[...]`) rather than exploding every scalar onto its own line
 * — the default pretty-printer would inflate the compact encoding ~10× on disk
 * and churn the byte-reviewed generated tree. `atoms` is always a top-level
 * Power field (depth 1 ⇒ 2-space key indent, 4-space element indent).
 */
function serializePower(power) {
  if (!power.atoms || !power.atoms.length) return JSON.stringify(power, null, 2);
  const SENTINEL = '@@ATOMS_TUPLES@@';
  const s = JSON.stringify({ ...power, atoms: SENTINEL }, null, 2);
  const inline =
    '[\n' + power.atoms.map((t) => '    ' + JSON.stringify(t)).join(',\n') + '\n  ]';
  return s.replace(`"${SENTINEL}"`, () => inline);
}

// DSH6 Phase 0c — canonical field order for emitted effects bags. The legacy
// extractEffects writes bag keys in forward-pass first-touch order, so the
// emitted key order encodes the ROUTING ORDER of the extraction — any
// restructuring (like swapping in the atom projection, whose summon handling
// no longer interleaves mid-loop) would churn every generated file with pure
// reorder noise. Deep-sorting the bag at the extractEffects boundary makes the
// emitted order canonical for ALL consumers (powerset generated layer, pool /
// epic / kheldian / primalist emitters, conditional pipeline) in one place.
// Objects only — arrays (durationVariants, stacksLinear, summon.entities,
// summon.powers) keep their meaningful order.
function _sortKeysDeep(v) {
  if (Array.isArray(v)) return v.map(_sortKeysDeep);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = _sortKeysDeep(v[k]);
    return out;
  }
  return v;
}

/**
 * DSH6 Phase 2R — pure fold: one resource slot's queued atom list → slot value.
 *
 * `durationVariants` retirement: the RESOURCES accumulate slots (healing,
 * regenDebuff, absorb, …) used to be built by an `addOrAccumulate` closure
 * mutating the live bag per atom — order-sensitive state threaded through
 * `effects[key]` + `effects.durations[key]`, with `durationVariants` bolted on
 * by patching the existing entry. Now the per-atom loop only CLASSIFIES atoms
 * into per-slot queues and this fold computes the slot value at the end, so a
 * slot (variants included) is a function of its atom list.
 *
 * Semantics are the legacy semantics exactly (byte-identical regen is the
 * gate):
 *   - same table            → scales accumulate (Math.abs — sign lives in the
 *     slot name);
 *   - table change          → last-table-wins reset (the known single-slot
 *     collapse; the scalar-table gate holds it at zero live occurrences);
 *   - duration-distinct DEBUFF atoms → the longest-duration atom is the
 *     primary, the rest become `durationVariants` in encounter order (the
 *     Trick Arrow duration-collapse fix, now a natural projection);
 *   - slot duration = last positive duration seen; `durationOnly` entries
 *     (Expression-typed max-Absorb templates) participate here without
 *     creating the slot.
 *
 * Entry shape: { scale, table, isDebuff, twin, duration|null } or
 * { durationOnly: true, duration }.
 */
function foldResourceSlot(entries) {
  let cur = null;
  let curDur = null;
  for (const e of entries) {
    if (e.durationOnly) {
      if (e.duration) curDur = e.duration;
      continue;
    }
    if (cur && cur.table === e.table) {
      if (
        e.isDebuff &&
        curDur != null && e.duration != null &&
        Math.abs(curDur - e.duration) > 0.001
      ) {
        cur.durationVariants = cur.durationVariants || [];
        if (e.duration > curDur) {
          cur.durationVariants.push({ scale: cur.scale, duration: curDur });
          cur.scale = Math.abs(e.scale);
          curDur = e.duration;
        } else {
          cur.durationVariants.push({ scale: Math.abs(e.scale), duration: e.duration });
        }
        continue;
      }
      // Same-table resource atoms: `Stack`-mode atoms accumulate (sum), but
      // `Replace`-mode atoms do NOT stack — a second application replaces the
      // first — so identical same-slot Replace DUPLICATES must collapse to one,
      // not double-count (Call Depths lists its +MaxHP as two identical scale-2
      // Replace templates → +2, not +4). `stack` is carried only on the maxHP
      // slots (see addOrAccumulate), so this collapse is maxHP-scoped.
      //
      // NOTE: this is NOT the enhanceable/unenhanceable +MaxHP twin idiom
      // (Inexhaustible, Ailment Resistance/Revive). Those two halves route to
      // SEPARATE slots (maxHPBuff vs maxHPBuffUnenhanced) BEFORE this fold, so each
      // per-slot queue holds a single half — the Replace branch never sees them
      // together, and both survive and SUM at calc time (verified in-game:
      // +160.63 ×2 = 321.26). The old comment here wrongly cited a "Revive 188.79
      // HP" collapse for the twin; the twin sums, but same-slot Replace dupes don't.
      if (e.stack === 'Replace') {
        cur.scale = Math.max(cur.scale, Math.abs(e.scale));
      } else {
        cur.scale += Math.abs(e.scale);
      }
    } else {
      cur = { scale: Math.abs(e.scale), table: e.table };
      if (e.twin) cur.unresistable = true;
    }
    if (e.duration) curDur = e.duration;
  }
  return { effect: cur, duration: curDur };
}

/**
 * PROJECTION: AtomicEffect[] → PowerEffects bag (the DSH6 rewrite).
 *
 * The routing tree operates on the atom list (from `templatesToAtoms`) instead
 * of raw templates; this is the single home for effect routing. `extractEffects`
 * calls it directly.
 *
 * Design notes:
 *   - Routes on `sourceAttrib` + the RAW template strings stamped as `_`
 *     provenance (`_aspect`/`_type`/`_duration`/`_table`), because the slot
 *     tests are raw-string tests: tspy's empty `aspect` must FAIL a
 *     `=== 'current'` test (the canonical Aspect defaults ''→'Cur'), and the
 *     duration regex `([\d.]+)` ignores a leading minus (unlike parseDuration).
 *   - Template-level pre-scans (resistable/unresistable twins, the AttackType
 *     marker skip, absorb stacks) are reconstructed by grouping atoms on
 *     `_tmplIdx`.
 *   - ENTITY CREATION (`effects.summon` + derived conditionalEntities) stays
 *     template-owned (`extractSummon`) — `create_entity` atoms are skipped here.
 */
/**
 * Parse a MaxHP-fraction absorb Expression (aspect=Maximum, type=Expression) into its
 * fraction of the caster's Max HP. Two shapes carry a recoverable fraction:
 *   `Max.kHitPoints source> C * [@Strength *]` — the fraction is the literal `C`
 *      (Wild Bastion, and Ablative/Parasitic on every melee AT).
 *   `Max.kHitPoints source> @StdResult *`      — the fraction is the template's OWN
 *      standard result. `@StdResult` is `table[level] × effectiveness × scale × strength`
 *      (attribmod.c `mod_Fill`, stored by `combateval_StoreAttribCalcInfo`), so on a
 *      `_ones` table it is just the scale; on any other table it is not a bare fraction
 *      and stays unrecovered. Sentinel Ablative/Parasitic use this shape.
 * Strength reaches either shape only when the template allows it: `fStr` stays 1.0 when
 * AllowStrength is off (attribmod.c), which the export spells as the `IgnoreStrength`
 * flag. That is why a Bio Armor adaptation bonus is unenhanceable, as its power text says.
 * Returns { fraction, appliesStrength } or null for a form this cannot evaluate — Master
 * Brawler's `100 kHitPoints% source> - kEndurance% source> + 200 / @StdResult *` reads live
 * HP and endurance — and callers leave those absorbs duration-only.
 *
 * Runs on the SHARED `magnitude_expression` evaluator rather than its own regexes, so
 * there is one RPN reader in this file. The shapes are asserted as symbol multisets:
 * `maxhp.source` is a different symbol from `maxhp.target`, which is what keeps the 100+
 * ALLY-shield absorbs (`Max.kHitPoints target> 0.075 * @Strength *` — Particle Shielding,
 * Spirit Ward, Guardian's Gift) unrecovered, exactly as the old `source>`-anchored regex
 * did. Those are a fraction of the RECIPIENT's max HP, which this caster-side field
 * cannot express.
 */
function parseAbsorbMaxHPFraction(expr, scale, table, ignoresStrength) {
  const r = evalMagnitudeExpression(expr);
  if (!r) return null;
  const syms = [...r.syms].sort();
  const strengthReaches = !ignoresStrength;

  // `Max.kHitPoints source> C *` — the fraction is the literal C, unenhanced.
  if (syms.length === 1 && syms[0] === 'maxhp.source') {
    return { fraction: r.k, appliesStrength: false };
  }
  // `Max.kHitPoints source> C * @Strength *` — same fraction, +Absorb strength applies.
  if (syms.length === 2 && syms[0] === 'maxhp.source' && syms[1] === 'strength') {
    return { fraction: r.k, appliesStrength: strengthReaches };
  }
  // `Max.kHitPoints source> @StdResult *` — the fraction is the template's own standard
  // result, which is a bare fraction only on a `_ones` table (see above).
  if (syms.length === 2 && syms[0] === 'maxhp.source' && syms[1] === 'std') {
    if (/_ones$/i.test(table || '') && typeof scale === 'number' && scale > 0) {
      return { fraction: r.k * scale, appliesStrength: strengthReaches };
    }
  }
  return null;
}

function projectAtomsToEffects(atoms, powerName) {
  const effects = {};

  // Bag-exact duration parse (see raw-string note above).
  const bagDuration = (raw) => {
    if (raw && raw !== '0 seconds') {
      const m = String(raw).match(/([\d.]+)\s*seconds?/i);
      if (m) return parseFloat(m[1]);
    }
    return null;
  };

  // Reconstruct template groups (atoms are one-per-attrib, in template order).
  const groups = new Map();
  for (const a of atoms) {
    if (!groups.has(a._tmplIdx)) groups.set(a._tmplIdx, []);
    groups.get(a._tmplIdx).push(a);
  }

  // --- absorb-stack pre-scan (mirrors extractEffects) ---
  // Template-level: single-attrib Absorb / aspect=Current / type Magnitude-or-
  // empty. `g.length === 1` ⟺ attribs.length === 1 (one atom per attrib).
  const absorbApply = [...groups.values()].filter((g) =>
    g.length === 1 &&
    (g[0].sourceAttrib || '').toLowerCase() === 'absorb' &&
    (g[0]._aspect || '').toLowerCase() === 'current' &&
    (g[0]._type === 'Magnitude' || !g[0]._type)
  );
  let absorbStackCount = 0;
  if (absorbApply.length > 1) {
    const first = absorbApply[0][0];
    const allMatch = absorbApply.every((g) =>
      Math.abs((g[0].scale || 0) - (first.scale || 0)) < 1e-6 &&
      g[0]._table === first._table &&
      g[0]._target === first._target
    );
    if (allMatch) absorbStackCount = absorbApply.length;
  }

  // --- Expression MaxHP-fraction absorb pre-scan ---
  // Some absorb templates deliver their magnitude via an Expression the
  // converter can't evaluate as scale×table (aspect=Maximum, type=Expression).
  // The canonical case is Wild Bastion's `Max.kHitPoints source> 0.25 * @Strength *`
  // = 25% of the CASTER's current Max HP, boosted by +Absorb strength — which
  // is why it grows with +HP accolades but the old converter dropped its
  // magnitude and kept only the duration. `parseAbsorbMaxHPFraction` recovers
  // both the literal-fraction and the `@StdResult` shapes here.
  //
  // DEFERRED (left duration-only): powers with MULTIPLE distinct fractions in
  // one scan, or a form `parseAbsorbMaxHPFraction` can't evaluate — Master
  // Brawler's fraction reads live HP and endurance, which the calc can't model
  // faithfully yet. Adaptation/mode-gated conditionals (Ablative 0.3 / 0.09,
  // Parasitic 0.1 / 0.033) scan per gated group, so each sees one fraction.
  let absorbMaxHPFraction = null;
  let absorbFractionStrength = false;
  {
    const fractions = new Set();
    let complex = false;
    let appliesStrength = false;
    for (const a of atoms) {
      if ((a.sourceAttrib || '').toLowerCase() !== 'absorb') continue;
      if ((a._aspect || '').toLowerCase() !== 'maximum') continue;
      if (a._type !== 'Expression') continue;
      const expr = (a._magExpr || '').trim();
      if (!expr) continue; // empty = placeholder/PvP variant — ignore
      const parsed = parseAbsorbMaxHPFraction(
        expr, a._scale, a._table, a._flags?.includes('IgnoreStrength')
      );
      if (parsed) {
        fractions.add(parsed.fraction);
        if (parsed.appliesStrength) appliesStrength = true;
      } else {
        complex = true;
      }
    }
    if (!complex && fractions.size === 1) {
      absorbMaxHPFraction = [...fractions][0];
      absorbFractionStrength = appliesStrength;
    }
  }

  // --- resistable/unresistable twin detection (DSH6 Phase 3 — no list mutation) ---
  // HC splits many foe debuffs into two identical templates on the same
  // attrib/aspect/table/scale/duration, differing ONLY by the IgnoreResistance
  // flag (`!resistible` ⟺ the template carried it): one the target's debuff
  // resistance can reduce, one that bypasses it. Both apply in game, but the
  // single-valued PowerEffects slot below represents them as ONE value tagged
  // `unresistable: true`.
  //
  // Unlike the earlier bolt-on (drop the unresistable atom + stamp a `_twin`
  // flag on the survivor), the atom list stays IMMUTABLE — the resistible:false
  // sibling is kept — and `unresistable` is derived at projection time from the
  // atom's own `resistible` property: `twinRole` marks each twin template's
  // atoms as the `res` member (route it, stamp `unresistable`) or its `unres`
  // member (skip at routing — its resistable sibling already represents it).
  // Skip-at-routing ≡ the old drop, since a twin's only difference is the flag,
  // so it would route to the same slot. DEBUFFS ONLY: a self-buff twin (Dull
  // Pain +MaxHP, heals, absorb) genuinely stacks into the full value via the
  // accumulate-if-same-table fold and must NOT be coalesced. PvP twins never
  // reach here (collectTemplatesDeep already dropped the `player eq` group).
  const isTwinDebuff = (g) =>
    (g[0].scale || 0) < 0 || (g[0]._table || '').toLowerCase().includes('debuff');
  const twinSig = (g) =>
    `${g.map((a) => (a.sourceAttrib || '').toLowerCase()).sort().join(',')}|` +
    `${(g[0]._aspect || '').toLowerCase()}|${g[0]._table}|` +
    `${(g[0].scale || 0).toFixed(4)}|${g[0]._duration || ''}`;
  const twinRole = new Map(); // _tmplIdx → 'res' | 'unres'
  {
    const seen = {};
    for (const g of groups.values()) {
      if (!isTwinDebuff(g)) continue;
      const sig = twinSig(g);
      if (!seen[sig]) seen[sig] = { res: false, unres: false };
      if (!g[0].resistible) seen[sig].unres = true;
      else seen[sig].res = true;
    }
    const twinSigs = new Set(
      Object.keys(seen).filter((k) => seen[k].res && seen[k].unres)
    );
    if (twinSigs.size > 0) {
      for (const [idx, g] of groups) {
        if (!isTwinDebuff(g) || !twinSigs.has(twinSig(g))) continue;
        twinRole.set(idx, g[0].resistible ? 'res' : 'unres');
      }
    }
  }

  // --- AttackType-tagging marker templates (mirrors extractEffects) ---
  // 7+ attribs, all damage types, aspect=Strength, scale 0, mag 0 → skip.
  const markerIdx = new Set();
  for (const [idx, g] of groups) {
    if (
      g.length >= 7 &&
      g.every((a) => isDamageTypeAttrib((a.sourceAttrib || '').toLowerCase())) &&
      (g[0]._aspect || '').toLowerCase() === 'strength' &&
      (g[0].scale || 0) === 0 &&
      (g[0].magnitude || 0) === 0
    ) {
      markerIdx.add(idx);
    }
  }

  // DSH6 Phase 2R — RESOURCES accumulate slots are computed by
  // `foldResourceSlot` after the loop; the loop only queues classified atoms
  // here (per slot key, in encounter order — the fold's semantics depend on
  // that order exactly as the old in-loop mutation did).
  const resourceSlots = new Map();
  const queueResource = (key, entry) => {
    if (!resourceSlots.has(key)) resourceSlots.set(key, []);
    resourceSlots.get(key).push(entry);
  };

  // Every atom routed to `damageBuff` (one per damage type), for the burst/tail
  // `durationVariants` post-pass below. Collected here because the primary is
  // last-write-wins in the loop; the post-pass adds the display-only variant.
  const damageBuffInstances = [];

  for (const a of atoms) {
    // Skip deactivation-only effects (bursts on toggle off).
    if (a._appType === 'OnDeactivate') continue;
    if (markerIdx.has(a._tmplIdx)) continue;

    // Twin coalescing (Phase 3): skip the IgnoreResistance sibling (its
    // resistable twin represents both); the resistable member routes with
    // `unresistable: true`.
    const twinR = twinRole.get(a._tmplIdx);
    if (twinR === 'unres') continue;
    const isTwin = twinR === 'res';

    const isCombatSuppressed = a._suppressedByEvents || a._combatGated;
    const aspect = a._aspect?.toLowerCase();
    const scale = a.scale || 0;
    const table = a._table;
    const magnitude = a.magnitude || 1;
    const isDebuff = scale < 0 || table?.toLowerCase().includes('debuff');
    const isSelfTargeting = a._target === 'Self';
    const duration = bagDuration(a._duration);

    const makeEffect = (s = scale, t = table) => {
      const e = { scale: Math.abs(s), table: t };
      if (isTwin) e.unresistable = true;
      return e;
    };
    const makeMezEffect = () => ({ mag: magnitude, scale: Math.abs(scale), table });
    const recordDuration = (effectKey) => {
      if (duration && duration > 0) {
        if (!effects.durations) effects.durations = {};
        effects.durations[effectKey] = duration;
      }
    };

    // Duration-aware accumulate for the simple buff slots CoH applies as a
    // burst+tail pair — Inner Light / Inner Umbra grant a big +ToHit for the
    // first 10s and a small lingering value for the 30s tail (both from cast;
    // verified in-game they STACK, so peak = burst+tail). This slot routed by
    // direct last-write-wins assignment, which silently kept only the
    // last-emitted (tail) value and dropped the burst. Mirror foldResourceSlot's
    // debuff `durationVariants`: the longest-lived instance is the primary, each
    // shorter one survives as a variant so the display can show both rows.
    // Byte-identical to legacy for single-duration buffs (the common case) and
    // for same-duration multi-type repeats (Build Up's damage types collapse to
    // one value): only a same-table, different-duration second instance mints a
    // variant. (Plan B Phase 2 Slice 1 — the tohit burst+tail shape.)
    //
    // Scoped to `tohitBuff` for Slice 1. `damageBuff` has the same burst+tail
    // shape (Inner Light, Moment of Glory, Fiery Embrace) but ALSO carries
    // flat + per-foe pairs (Against All Odds: 1.0 flat @1.25s + 0.55/foe @1s)
    // that the perTarget post-pass (`computeAoePerTargetPatches`) reshapes into
    // `{scale, perTarget}`. Routing those different durations through here mints
    // a spurious variant and leaks a `durations` change past the reshape, so the
    // damage variants wait for the damage slice, which must exclude per-foe
    // groups. (For ToHit this is verified clean: a full three-dataset regen
    // changes ONLY the four Inner Light / Inner Umbra powers — every per-foe
    // ToHit power, Sunless Mire and Soul Drain included, is byte-unchanged,
    // because their longest-lived instance is emitted last and so still wins the
    // recorded `durations` entry the perTarget reshape reads.)
    const accumulateBuffSlot = (key, eff) => {
      const prev = effects[key];
      const prevDur = effects.durations?.[key];
      if (!prev || typeof prev !== 'object' || prev.table !== eff.table) {
        effects[key] = eff; // first instance, or table change (legacy reset)
        recordDuration(key);
        return;
      }
      if (prevDur != null && duration != null && Math.abs(prevDur - duration) > 0.001) {
        prev.durationVariants = prev.durationVariants || [];
        if (duration > prevDur) {
          // The new atom outlives the current primary — it becomes the primary,
          // the current value drops to a variant at its (shorter) duration.
          prev.durationVariants.push({ scale: prev.scale, duration: prevDur });
          prev.scale = eff.scale;
          effects.durations[key] = duration;
        } else {
          // The new atom is the shorter burst — a variant; primary is unchanged.
          prev.durationVariants.push({ scale: eff.scale, duration });
        }
        return;
      }
      // Same (or absent) duration: last-write-wins on scale, variants preserved.
      prev.scale = eff.scale;
      if (eff.unresistable) prev.unresistable = true;
      recordDuration(key);
    };

    const attrib = (a.sourceAttrib || '').toLowerCase();
    if (!attrib) continue;
    if (SPECIAL_ATTRIBS.has(attrib)) continue;

    // ENTITY CREATION — stays template-owned (see doc comment).
    if (attrib === 'create_entity') continue;

    // ========== DAMAGE TYPE ATTRIBUTES ==========
    if (isDamageTypeAttrib(attrib)) {
      const dmgType = getDamageType(attrib);
      const tableLower = table?.toLowerCase() || '';
      // A bare by-type attrib (no `_dmg` suffix) at aspect Current IS the defense
      // characteristic on ANY table (atomic-effect.ts classify) — the accolade click buffs
      // carry +Def(type) on the generic Melee_Ones table, not a *Def* table. Mirror the atom
      // classification so the bag matches defenseBuffValue (planb-shadow-defense parity).
      const isDefenseEffect = tableLower.includes('buff_def') || tableLower.includes('debuff_def') ||
        (aspect === 'current' && !attrib.endsWith('_dmg'));

      if (dmgType === 'Heal' && aspect === 'strength') {
        if (!effects.specialBuff) effects.specialBuff = {};
        effects.specialBuff.heal = makeEffect();
        recordDuration('specialBuff');
        continue;
      }

      if (aspect === 'strength') {
        const isDamageAttrib = attrib.endsWith('_dmg');
        if (!isDamageAttrib) {
          if (isDebuff) {
            if (!effects.specialDebuff) effects.specialDebuff = {};
            effects.specialDebuff[dmgType.toLowerCase()] = makeEffect();
            recordDuration('specialDebuff');
          } else {
            if (!effects.specialBuff) effects.specialBuff = {};
            effects.specialBuff[dmgType.toLowerCase()] = makeEffect();
            recordDuration('specialBuff');
          }
        } else if (isDebuff) {
          effects.damageDebuff = makeEffect();
          if (isSelfTargeting) effects.damageDebuff.toWho = 'Self';
          recordDuration('damageDebuff');
        } else {
          effects.damageBuff = makeEffect();
          recordDuration('damageBuff');
          damageBuffInstances.push({ scale: Math.abs(scale), duration, type: attrib });
        }
      } else if (aspect === 'resistance') {
        if (isDebuff) {
          if (!effects.resistanceDebuff) effects.resistanceDebuff = {};
          const e = makeEffect();
          // A self-directed -Res is a caster PENALTY (Bio Armor Offensive
          // Adaptation's -7.5% Res(all)), not a foe debuff. Tag it so the calc
          // subtracts it from the player's own resistance instead of treating
          // it as enemy-facing (mirrors the damageDebuff self path above).
          if (isSelfTargeting) e.toWho = 'Self';
          effects.resistanceDebuff[dmgType.toLowerCase()] = e;
          recordDuration('resistanceDebuff');
        } else {
          if (!effects.resistance) effects.resistance = {};
          effects.resistance[dmgType.toLowerCase()] = makeEffect();
          recordDuration('resistance');
        }
      } else if (isDefenseEffect) {
        if (isDebuff) {
          if (!effects.defenseDebuff) effects.defenseDebuff = {};
          const e = makeEffect();
          if (isSelfTargeting) e.toWho = 'Self'; // self -Def penalty (e.g. Rage crash), see resistanceDebuff branch
          effects.defenseDebuff[dmgType.toLowerCase()] = e;
          recordDuration('defenseDebuff');
        } else if (isCombatSuppressed) {
          if (!effects.defenseBuffSuppressible) effects.defenseBuffSuppressible = {};
          effects.defenseBuffSuppressible[dmgType.toLowerCase()] = makeEffect();
          recordDuration('defenseBuffSuppressible');
        } else {
          if (!effects.defenseBuff) effects.defenseBuff = {};
          effects.defenseBuff[dmgType.toLowerCase()] = makeEffect();
          recordDuration('defenseBuff');
        }
      }
      // Current/Absolute without defense table = actual damage → extractDamage().
      continue;
    }

    // ========== DEFENSE POSITION TYPES (Melee/Ranged/AoE) ==========
    if (isDefensePosition(attrib)) {
      const posType = DEFENSE_POSITIONS[attrib];
      if (aspect === 'resistance') {
        if (isDebuff) {
          if (!effects.resistanceDebuff) effects.resistanceDebuff = {};
          const e = makeEffect();
          if (isSelfTargeting) e.toWho = 'Self'; // self -Res penalty, see damage-type branch
          effects.resistanceDebuff[posType.toLowerCase()] = e;
          recordDuration('resistanceDebuff');
        } else {
          if (!effects.resistance) effects.resistance = {};
          effects.resistance[posType.toLowerCase()] = makeEffect();
          recordDuration('resistance');
        }
      } else if (aspect === 'strength') {
        if (isDebuff) {
          if (!effects.specialDebuff) effects.specialDebuff = {};
          effects.specialDebuff[posType.toLowerCase()] = makeEffect();
          recordDuration('specialDebuff');
        } else {
          if (!effects.specialBuff) effects.specialBuff = {};
          effects.specialBuff[posType.toLowerCase()] = makeEffect();
          recordDuration('specialBuff');
        }
      } else if (isDebuff) {
        if (!effects.defenseDebuff) effects.defenseDebuff = {};
        const e = makeEffect();
        if (isSelfTargeting) e.toWho = 'Self'; // self -Def penalty (e.g. Rage crash), see resistanceDebuff branch
        effects.defenseDebuff[posType.toLowerCase()] = e;
        recordDuration('defenseDebuff');
      } else if (isCombatSuppressed) {
        if (!effects.defenseBuffSuppressible) effects.defenseBuffSuppressible = {};
        effects.defenseBuffSuppressible[posType.toLowerCase()] = makeEffect();
        recordDuration('defenseBuffSuppressible');
      } else {
        if (!effects.defenseBuff) effects.defenseBuff = {};
        effects.defenseBuff[posType.toLowerCase()] = makeEffect();
        recordDuration('defenseBuff');
      }
      continue;
    }

    // ========== BASE_DEFENSE special handling ==========
    if (attrib === 'base_defense' || attrib === 'defense') {
      if (aspect === 'resistance') {
        if (!effects.debuffResistance) effects.debuffResistance = {};
        effects.debuffResistance.defense = makeEffect();
        recordDuration('debuffResistance');
      } else if (aspect === 'strength') {
        if (isDebuff) {
          if (!effects.specialDebuff) effects.specialDebuff = {};
          effects.specialDebuff.defense = makeEffect();
          recordDuration('specialDebuff');
        } else {
          if (!effects.specialBuff) effects.specialBuff = {};
          effects.specialBuff.defense = makeEffect();
          recordDuration('specialBuff');
        }
      } else if (isDebuff) {
        effects.defenseDebuff = makeEffect();
        if (isSelfTargeting) effects.defenseDebuff.toWho = 'Self'; // self -Def penalty (e.g. Rage crash)
        recordDuration('defenseDebuff');
      } else if (isCombatSuppressed) {
        effects.defenseBuffSuppressible = makeEffect();
        recordDuration('defenseBuffSuppressible');
      } else {
        effects.defenseBuff = makeEffect();
        recordDuration('defenseBuff');
      }
      continue;
    }

    // ========== ELUSIVITY ==========
    if (ELUSIVITY_TYPES[attrib]) {
      const elusType = ELUSIVITY_TYPES[attrib];
      if (!effects.elusivity) effects.elusivity = {};
      effects.elusivity[elusType.toLowerCase()] = makeEffect();
      continue;
    }

    // ========== MEZ EFFECTS ==========
    if (MEZ_TYPES[attrib]) {
      const mezType = MEZ_TYPES[attrib];
      if (aspect === 'resistance') {
        if (!effects.mezResistance) effects.mezResistance = {};
        if (effects.mezResistance[mezType] && effects.mezResistance[mezType].table === table) {
          effects.mezResistance[mezType].scale += Math.abs(scale);
        } else {
          effects.mezResistance[mezType] = makeEffect();
        }
        recordDuration('mezResistance');
      } else if (aspect === 'strength') {
        if (!effects.specialBuff) effects.specialBuff = {};
        effects.specialBuff[mezType] = makeEffect();
        recordDuration('specialBuff');
      } else if (datasetId === 'thunderspy' && scale < 0
                 && !(table || '').toLowerCase().includes('res_boolean')) {
        continue;
      } else {
        const newMez = makeMezEffect();
        const cur = effects[mezType];
        const newIsPvP = /pvp/i.test(table || '');
        const curIsPvP = cur ? /pvp/i.test(cur.table || '') : false;
        let take;
        if (!cur) take = true;
        else if (curIsPvP !== newIsPvP) take = curIsPvP; // prefer PvE
        else take = newMez.mag > cur.mag;
        if (take) effects[mezType] = newMez;
        if (duration) effects.effectDuration = duration;
        recordDuration(mezType);
      }
      continue;
    }

    // ========== KNOCKBACK/KNOCKUP/REPEL ==========
    if (KNOCKBACK_TYPES[attrib]) {
      const kbType = KNOCKBACK_TYPES[attrib];
      if (!isSelfTargeting) {
        if (aspect === 'resistance' || scale <= 0) continue;
        if (effects[kbType] && effects[kbType].table === table) {
          effects[kbType].scale += Math.abs(scale);
        } else {
          effects[kbType] = makeEffect();
        }
        recordDuration(kbType);
        continue;
      }
      if (aspect === 'resistance') {
        const isResBoolean = (table || '').toLowerCase().includes('res_boolean');
        if (isResBoolean) {
          if (effects[kbType] && effects[kbType].table === table) {
            effects[kbType].scale += Math.abs(scale);
          } else {
            effects[kbType] = makeEffect();
          }
          recordDuration(kbType);
        } else {
          if (!effects.mezResistance) effects.mezResistance = {};
          effects.mezResistance[kbType] = makeEffect();
          recordDuration('mezResistance');
        }
      } else {
        if (effects[kbType] && effects[kbType].table === table) {
          effects[kbType].scale += Math.abs(scale);
        } else {
          effects[kbType] = makeEffect();
        }
        recordDuration(kbType);
      }
      continue;
    }

    // ========== MOVEMENT ==========
    if (MOVEMENT_TYPES[attrib]) {
      const moveType = MOVEMENT_TYPES[attrib];
      const isSlow = isDebuff || scale < 0 || (table || '').toLowerCase().includes('slow');
      // Travel-suppression metadata. `stackKey` is the binary suppress group
      // (kTravelBuff on CJ/SJ/SS/Fly & the SS momentum effects): active
      // powers sharing a key mutually suppress per stat — only the strongest
      // applies (the calc's strongest-wins pass). `suppressible` marks buffs
      // the game turns off in combat (Suppress ActivateAttackClick — SS run,
      // SJ jump, Fly speed; Combat Jumping/Hover carry no suppress events
      // and keep working, which is their whole point).
      const attachTravelMeta = (e) => {
        if (a._stack === 'Suppress' && a._stackKey) e.stackKey = a._stackKey;
        if (isCombatSuppressed) e.suppressible = true;
        return e;
      };
      if (aspect === 'resistance') {
        if (!effects.debuffResistance) effects.debuffResistance = {};
        effects.debuffResistance.movement = makeEffect();
        recordDuration('debuffResistance');
      } else if (isSelfTargeting && aspect === 'strength') {
        if (!effects.specialBuff) effects.specialBuff = {};
        effects.specialBuff.movement = makeEffect();
        recordDuration('specialBuff');
      } else if (isSelfTargeting && aspect === 'maximum' && scale > 0 &&
                 moveType !== 'movementControl' && moveType !== 'movementFriction') {
        // aspect=Maximum on a movement speed = a travel-power CAP raise
        // (Super Speed +1.938 run-cap units → 120.25 mph; Super Jump +1.65
        // jump → 101.80; Fly +2.0475 → 87.95; Afterburner +1.0 on top →
        // 102.27). These previously fell into the generic movement slot and
        // CLOBBERED the real Current-aspect buff (SS showed 1.938×Melee_Ones
        // instead of 1.0×Melee_SpeedRunning) — the bag-vs-array collapse.
        // Kept separate so the UI derives caps from data instead of the
        // hardcoded TRAVEL_CAP_BUMPS table. Negative Maximum (cap DEBUFF)
        // still routes to `slow` below, as before.
        if (!effects.movementCapBump) effects.movementCapBump = {};
        effects.movementCapBump[moveType] = attachTravelMeta(makeEffect());
        recordDuration('movementCapBump');
      } else if (isSelfTargeting && isSlow) {
        if (!effects.slow) effects.slow = {};
        effects.slow[moveType] = makeEffect();
        effects.slow[moveType].toWho = 'Self';
        recordDuration('slow');
      } else if (isSelfTargeting) {
        if (!effects.movement) effects.movement = {};
        effects.movement[moveType] = attachTravelMeta(makeEffect());
        recordDuration('movement');
      } else if (isSlow) {
        if (!effects.slow) effects.slow = {};
        effects.slow[moveType] = makeEffect();
        recordDuration('slow');
      } else if (aspect === 'current') {
        if (!effects.movement) effects.movement = {};
        effects.movement[moveType] = attachTravelMeta(makeEffect());
        recordDuration('movement');
      }
      continue;
    }

    // ========== RESOURCES (HP, End, Recovery, Regen, Absorb) ==========
    if (RESOURCE_TYPES[attrib]) {
      const resType = RESOURCE_TYPES[attrib];

      if (resType !== 'absorb' && a._type === 'Expression' && a._tickChance === 0) {
        continue;
      }

      // Phase 2R: classify only — the slot value is folded after the loop.
      const addOrAccumulate = (key) =>
        queueResource(key, {
          scale,
          table,
          isDebuff,
          twin: isTwin,
          // `stack` is consumed by foldResourceSlot's Replace-collapse branch, which
          // collapses identical same-slot Replace DUPLICATES (e.g. Call Depths' two
          // scale-2 +MaxHP templates) so they don't double-count. Carried on the
          // maxHP slots alone so every other resource slot folds byte-identically
          // (always-sum). The enhanceable/unenhanceable twin is unaffected — its two
          // halves are in DIFFERENT slots (maxHPBuff vs maxHPBuffUnenhanced).
          ...(key === 'maxHPBuff' || key === 'maxHPBuffUnenhanced' ? { stack: a._stack } : {}),
          duration: duration && duration > 0 ? duration : null,
        });

      if (resType === 'hitPoints') {
        if (aspect === 'maximum') {
          if (isDebuff) continue;
          // +MaxHP enhanceable/unenhanceable twin: many armors list their max-HP
          // bonus as two Maximum templates on the same table — one enhanceable,
          // one IgnoreStrength ("half of this max-HP increase is unenhanceable",
          // e.g. Inexhaustible / High Pain Tolerance / Dull Pain). BOTH halves
          // co-apply and SUM — verified in-game: Inexhaustible's attribute
          // monitor shows two +66.93 Max-HP entries (one "on self", one "Ignores
          // buffs and enhancements") totalling 133.86, regardless of the stack
          // mode. Route the IgnoreStrength half to its own slot so both survive
          // (the old single-slot fold collapsed same-table Replace twins to one
          // half) AND only the enhanceable half responds to +Healing strength.
          addOrAccumulate(a._flags?.includes('IgnoreStrength') ? 'maxHPBuffUnenhanced' : 'maxHPBuff');
        } else {
          addOrAccumulate('healing');
        }
      } else if (resType === 'endurance') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.endurance = makeEffect();
          recordDuration('debuffResistance');
        } else if (aspect === 'strength') {
          if (!effects.specialBuff) effects.specialBuff = {};
          effects.specialBuff.endurance = makeEffect();
          recordDuration('specialBuff');
        } else if (aspect === 'maximum') {
          addOrAccumulate('maxEndBuff');
        } else if (isDebuff || scale < 0) {
          addOrAccumulate('enduranceDrain');
        } else {
          addOrAccumulate('enduranceGain');
        }
      } else if (resType === 'recovery') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.recovery = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff || scale < 0) {
          addOrAccumulate('recoveryDebuff');
        } else if (a._flags?.includes('IgnoreStrength')) {
          addOrAccumulate('recoveryBuffUnenhanced');
        } else {
          addOrAccumulate('recoveryBuff');
        }
      } else if (resType === 'regeneration') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.regeneration = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff || scale < 0) {
          addOrAccumulate('regenDebuff');
        } else if (
          a._flags?.includes('StackByAttribAndKey') &&
          (a._stack === 'Stack' || a._stack === 'Continuous')
        ) {
          // Handled downstream by the perTarget pipeline — see extractEffects.
          //
          // The `Stack`/`Continuous` test is load-bearing, and the flag ALONE is not a
          // skip signal. `StackByAttribAndKey` means "key this buff by (attrib,
          // stack_key) so re-application REFRESHES rather than stacks" — it is refresh
          // semantics, not an instruction to ignore the template. Only the
          // Stack/Continuous ones are the per-target increments `computeAoePerTargetPatches`
          // folds in (Reactive Regeneration's 0.055/0.08/0.25 @20s), and skipping those
          // is what stops them double-counting.
          //
          // Skipping on the flag alone silently DELETED Icy Bastion's lingering +4
          // regen (`Replace`, 30s, stack_key=IcyBastion): a temp toggle
          // (`activate_period` 0.5) whose own effects carry the larger +6 @0.75s
          // toggle-refreshed buff while an OnActivate Execute_Power applies the +4 @30s
          // lingering half via Redirects.Ice_Armor.Icy_Bastion_NoCast — the flag being
          // exactly what lets 60 re-executions refresh one buff instead of stacking to
          // +24,000%. Both apply while the toggle is up, so the power is +10 regen /
          // +4 recovery; the bag reported 6 (burst only, lingering dropped) while
          // RECOVERY — which never had this skip — correctly summed to 4. That
          // regen/recovery asymmetry was the bug, confirmed in-game and by the power's
          // own display_help ("While the power is active... Should you deactivate the
          // power earlier, some of the ... effects will remain until the full 30
          // seconds window is over").
          //
          // NB Supremacy also carries flagged regen (0.02, `Suppress`) but is not in
          // scope: it is never converted to a player power, and its templates are
          // henchman-facing anyway (gated `group target> MastermindPets eq`, the
          // damage-sharing plumbing).
        } else if (a._flags?.includes('IgnoreStrength')) {
          addOrAccumulate('regenBuffUnenhanced');
        } else {
          addOrAccumulate('regenBuff');
        }
      } else if (resType === 'absorb') {
        if (aspect === 'maximum' && a._type === 'Expression') {
          // Recovered MaxHP-fraction magnitude (Wild Bastion etc.) — see the
          // Expression MaxHP-fraction pre-scan. `maxHPFraction` = fraction of
          // the caster's CURRENT Max HP; `appliesStrength` means +Absorb
          // strength (Power Boost / Clarion / slotted Heal) scales it.
          if (absorbMaxHPFraction != null && !effects.absorb) {
            effects.absorb = { maxHPFraction: absorbMaxHPFraction };
            if (absorbFractionStrength) effects.absorb.appliesStrength = true;
            if (table) effects.absorb.table = table;
          }
          // Duration-only: joins the absorb queue in encounter order so the
          // fold sees it exactly where the old inline recordDuration ran. This
          // is the ONLY output for deferred conditional absorbs (unchanged).
          if (duration && duration > 0) {
            queueResource('absorb', { durationOnly: true, duration });
          }
          continue;
        }
        if (aspect === 'strength') {
          if (!effects.specialBuff) effects.specialBuff = {};
          effects.specialBuff.absorb = makeEffect();
          recordDuration('specialBuff');
          continue;
        }
        addOrAccumulate('absorb');
      }
      continue;
    }

    // ========== COMBAT MODIFIERS ==========
    if (COMBAT_MODIFIERS[attrib]) {
      const modType = COMBAT_MODIFIERS[attrib];

      if (modType === 'toHit') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.tohit = makeEffect();
          recordDuration('debuffResistance');
        } else if (aspect === 'strength') {
          if (!effects.specialBuff) effects.specialBuff = {};
          effects.specialBuff.tohit = makeEffect();
          recordDuration('specialBuff');
        } else if (isDebuff) {
          effects.tohitDebuff = makeEffect();
          if (isSelfTargeting) effects.tohitDebuff.toWho = 'Self';
          recordDuration('tohitDebuff');
        } else if (a._flags?.includes('IgnoreStrength')) {
          effects.tohitBuffUnenhanced = makeEffect();
          recordDuration('tohitBuffUnenhanced');
        } else {
          accumulateBuffSlot('tohitBuff', makeEffect());
        }
      } else if (modType === 'accuracy') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.accuracy = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff || scale < 0) {
          effects.accuracyDebuff = makeEffect();
          if (isSelfTargeting) effects.accuracyDebuff.toWho = 'Self';
          recordDuration('accuracyDebuff');
        } else {
          effects.accuracyBuff = makeEffect();
          recordDuration('accuracyBuff');
        }
      } else if (modType === 'defense') {
        // handled by BASE_DEFENSE above
      } else if (modType === 'rechargeTime') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.recharge = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff || scale < 0 || table?.toLowerCase().includes('slow')) {
          effects.rechargeDebuff = makeEffect();
          if (isSelfTargeting) effects.rechargeDebuff.toWho = 'Self';
          recordDuration('rechargeDebuff');
        } else {
          effects.rechargeBuff = makeEffect();
          recordDuration('rechargeBuff');
        }
      } else if (modType === 'threatLevel') {
        if (isDebuff || scale < 0) {
          effects.threatDebuff = makeEffect();
          recordDuration('threatDebuff');
        } else {
          effects.threatBuff = makeEffect();
          recordDuration('threatBuff');
        }
      } else if (modType === 'range') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.range = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff || scale < 0) {
          if (isSelfTargeting) {
            effects.rangeDebuff = makeEffect();
            effects.rangeDebuff.toWho = 'Self';
            recordDuration('rangeDebuff');
          }
          // else: foe-side debuff, dropped for caster-stat purposes
        } else if (isSelfTargeting) {
          effects.rangeBuff = makeEffect();
          recordDuration('rangeBuff');
        } else if (aspect === 'strength') {
          // ally/team +Range (Power of the Depths) — see extractEffects
          effects.rangeBuff = makeEffect();
          recordDuration('rangeBuff');
        }
        // else: positive non-Strength Range on a non-Self target — skip.
      } else if (modType === 'enduranceDiscount') {
        effects.enduranceDiscount = makeEffect();
        recordDuration('enduranceDiscount');
      }
      continue;
    }

    // ========== STEALTH/PERCEPTION ==========
    if (STEALTH_TYPES[attrib]) {
      const stealthType = STEALTH_TYPES[attrib];
      if (stealthType === 'perception') {
        if (aspect === 'resistance') {
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.perception = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff || scale < 0) {
          effects.perceptionDebuff = makeEffect();
          recordDuration('perceptionDebuff');
        } else {
          effects.perceptionBuff = makeEffect();
          recordDuration('perceptionBuff');
        }
      } else {
        if (!effects.stealth) effects.stealth = {};
        effects.stealth[stealthType] = makeEffect();
        const stealthKey = a._stackKey;
        const keyResolved = stealthKey && stealthKey !== '4294967295' && stealthKey !== '0';
        if (a._stack === 'Suppress' && keyResolved) {
          effects.stealth.stackKey = stealthKey;
        }
        recordDuration('stealth');
      }
      continue;
    }

    // ========== CONTROL (Taunt, Placate, etc.) ==========
    if (CONTROL_TYPES[attrib]) {
      const ctrlType = CONTROL_TYPES[attrib];
      if (aspect === 'resistance') {
        if (!effects.mezResistance) effects.mezResistance = {};
        if (effects.mezResistance[ctrlType] && effects.mezResistance[ctrlType].table === table) {
          effects.mezResistance[ctrlType].scale += Math.abs(scale);
        } else {
          effects.mezResistance[ctrlType] = makeEffect();
        }
        recordDuration('mezResistance');
      } else {
        effects[ctrlType] = makeEffect();
        recordDuration(ctrlType);
      }
      continue;
    }

    // catch-all: unmapped attribute — no slot.
  }

  // --- DSH6 Phase 2R: fold queued resource atoms into their slots ---
  // (Before the absorb epilogue, which reads effects.absorb/durations.absorb.)
  for (const [key, entries] of resourceSlots) {
    const folded = foldResourceSlot(entries);
    if (folded.effect) effects[key] = folded.effect;
    if (folded.duration != null) {
      if (!effects.durations) effects.durations = {};
      effects.durations[key] = folded.duration;
    }
  }

  // --- damageBuff burst/tail durationVariants (display-only) ---
  // Inner Light grants a big +Damage burst (8.0 @10s) plus a lingering tail
  // (3.2 @30s); like the `tohitBuff` half (accumulateBuffSlot), surface both as
  // an InfoPanel row. The primary is LEFT UNTOUCHED (last-write == the value the
  // calc reads via `damageBuffValue`, so the shadow stays green) — this ONLY adds
  // a variant for a UNIFORM sibling duration: a (scale,duration) group covering the
  // SAME number of damage types as the primary. That admits Inner Light (both
  // durations carry all 8 types) but skips a non-uniform buff (Embrace of Fire's
  // +10 Fire/30s is 1 type, not 8 — it must not masquerade as a burst of the +8
  // all-types buff). A per-foe damageBuff's variants are dropped downstream when
  // `computeAoePerTargetPatches` rebuilds the slot as `{scale, perTarget}`.
  if (
    effects.damageBuff && typeof effects.damageBuff === 'object' &&
    typeof effects.damageBuff.scale === 'number' && damageBuffInstances.length
  ) {
    const r4 = (n) => Math.round(n * 1e4) / 1e4;
    const primScale = r4(effects.damageBuff.scale);
    const primDur = effects.durations && effects.durations.damageBuff;
    const groups = new Map();
    for (const inst of damageBuffInstances) {
      const k = `${r4(inst.scale)}|${inst.duration}`;
      let g = groups.get(k);
      if (!g) groups.set(k, (g = { scale: r4(inst.scale), duration: inst.duration, types: new Set() }));
      g.types.add(inst.type);
    }
    const prim = groups.get(`${primScale}|${primDur}`);
    if (prim) {
      const variants = [];
      for (const g of groups.values()) {
        if (g.duration === prim.duration || g.duration == null || g.duration <= 0) continue;
        if (g.types.size !== prim.types.size) continue; // uniform sibling only
        variants.push({ scale: g.scale, duration: g.duration });
      }
      if (variants.length) {
        variants.sort((a, b) => b.duration - a.duration || b.scale - a.scale);
        effects.damageBuff.durationVariants = variants;
      }
    }
  }

  // --- epilogue (mirrors extractEffects) ---
  if (absorbStackCount > 1 && effects.absorb && typeof effects.absorb.scale === 'number') {
    effects.absorb.scale = effects.absorb.scale / absorbStackCount;
    effects.maxStacks = Math.max(effects.maxStacks || 0, absorbStackCount);
    if (!effects.stacksLinear) effects.stacksLinear = [];
    if (!effects.stacksLinear.includes('absorb')) {
      effects.stacksLinear = [...effects.stacksLinear, 'absorb'].sort();
    }
    const absorbTick = effects.durations && effects.durations.absorb;
    if (absorbTick && absorbTick > 0) {
      effects.stackInterval = absorbTick;
    }
  }

  if (effects.durations && Object.keys(effects.durations).length > 0) {
    const durationCounts = {};
    for (const [, dur] of Object.entries(effects.durations)) {
      durationCounts[dur] = (durationCounts[dur] || 0) + 1;
    }
    let bestDur = null;
    let bestCount = 0;
    for (const [dur, count] of Object.entries(durationCounts)) {
      const d = parseFloat(dur);
      if (count > bestCount || (count === bestCount && d > (bestDur || 0))) {
        bestDur = d;
        bestCount = count;
      }
    }
    if (bestDur && bestDur > 0) {
      effects.buffDuration = bestDur;
    }
  }

  return _sortKeysDeep(effects); // canonical emit order (Phase 0c)
}

/**
 * extractEffects — a CoH power's raw template list → its `PowerEffects` bag.
 *
 * The internal model is the DSH4 atom list: `templatesToAtoms` encodes each
 * template × attrib into `AtomicEffect[]`, and `projectAtomsToEffects` projects
 * that list to the ~90-slot `PowerEffects` bag (the DSH6 rewrite — effect
 * routing has exactly one home there). `summon` (ENTITY CREATION) stays
 * template-owned in `extractSummon` per the Phase 0 plan — it consumes
 * `params`/pet-lifespan context that is not part of the atomic effect model.
 */
function extractEffects(templates, powerName) {
  const atoms = templatesToAtoms(templates);
  let effects = projectAtomsToEffects(atoms, powerName);
  const summon = extractSummon(templates, powerName);
  if (summon) {
    effects.summon = summon;
    effects = _sortKeysDeep(effects); // keep canonical order with summon merged
  }
  return effects;
}

/**
 * ENTITY CREATION — template-owned summon extraction (verbatim port of the
 * legacy extractEffects EntCreate section + its phash/ignited epilogue).
 * Returns the summon object or null.
 */
function extractSummon(templates, powerName) {
  let summon = null;
  for (const template of templates) {
    if (!template.attribs || template.attribs.length === 0) continue;
    if (template.application_type === 'OnDeactivate') continue;

    // Parse duration if present (bag-exact regex).
    let duration = null;
    if (template.duration && template.duration !== '0 seconds') {
      const match = template.duration.match(/([\d.]+)\s*seconds?/i);
      if (match) duration = parseFloat(match[1]);
    }

    for (const rawAttrib of template.attribs) {
      const attrib = rawAttrib?.toLowerCase();
      if (attrib !== 'create_entity') continue;
      const params = template.params;
      if (!(params && params.type === 'EntCreate')) continue;
      const isPseudoPet = template.flags?.some(f => f.includes('PseudoPet')) || false;
      const hasCopyBoosts = template.flags?.some(f => f.includes('CopyBoosts')) || false;

      if (!summon) {
        // First entity encountered. (See the legacy section for the P-hash /
        // priority_list rationale.)
        const entityInfo = { isPseudoPet };
        if (params.entity_def) entityInfo.entity = params.entity_def;
        if (/^P\d+$/.test(params.entity_def || '') && params.priority_list) {
          entityInfo._phashPriorityList = params.priority_list;
        }
        if (params.display_name) entityInfo.displayName = DISPLAY_NAME_OVERRIDES[powerName] || params.display_name;
        if (params.redirects?.length > 0) entityInfo.powers = params.redirects;
        const effectiveDuration = duration || resolvePetLifespan(params);
        if (effectiveDuration > 0) entityInfo.duration = effectiveDuration;
        if (hasCopyBoosts) entityInfo.copyBoosts = true;
        summon = entityInfo;
      } else if (summon.entities) {
        const existing = summon.entities.find(e => e.entity === params.entity_def);
        if (existing) {
          existing.count++;
        } else {
          summon.entities.push({ entity: params.entity_def, count: 1 });
        }
      } else if (summon.entity === params.entity_def) {
        summon.entityCount = (summon.entityCount || 1) + 1;
      } else if (params.entity_def && !isPseudoPet && summon.entity) {
        summon.entities = [
          { entity: summon.entity, count: summon.entityCount || 1 },
          { entity: params.entity_def, count: 1 },
        ];
        delete summon.entity;
        delete summon.entityCount;
      }
    }
  }

  if (!summon) return null;

  // Resolve an opaque-P-hash entity to its real pet name (single-entity only).
  if (summon._phashPriorityList) {
    if (summon.entity && /^P\d+$/.test(summon.entity)) {
      summon.entity = summon._phashPriorityList;
    }
    delete summon._phashPriorityList;
  }

  // Ignited variant (Oil Slick Arrow) — conditional entity toggle.
  const ignitedVariant = IGNITED_ENTITY_VARIANT[summon.entity];
  if (ignitedVariant) {
    summon.conditionalEntities = [
      { entity: ignitedVariant, toggleId: 'oilslick_ignited', label: 'Oil Slick Ignited' },
    ];
  }

  return summon;
}

// ============================================
// PER-TARGET STACKING DETECTION
// ============================================

/**
 * Collect all templates from effects with parent-level tags preserved.
 * Returns array of { template, tags } objects.
 */
function collectTemplatesWithMeta(effects) {
  const results = [];
  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    if (effect.chance === 0 || effect.chance === 0.0) continue;
    if (effect.tags && effect.tags.includes('Containment')) continue;

    // Skip conditional effects (dead-state, hide, scourge)
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      if (req.includes('kHitPoints == 0')) continue;
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      if (req.includes('rand()')) continue;
    }

    const tags = effect.tags || [];

    const requires = effect.requires_expression || '';

    if (effect.templates && effect.templates.length > 0) {
      for (const t of effect.templates) {
        results.push({ template: t, tags, requires });
      }
    }
    if (effect.child_effects && effect.child_effects.length > 0) {
      const childResults = collectTemplatesWithMeta(effect.child_effects);
      for (const cr of childResults) {
        // Child's own requires wins (it gates the child template); fall back to
        // the parent group's requires when the child carries none.
        results.push({ template: cr.template, tags: [...tags, ...cr.tags], requires: cr.requires || requires });
      }
    }
  }
  return results;
}

/**
 * Detect a `requires_expression` that excludes the caster from an effect, i.e.
 * the RPN clause `entref target> entref source> eq !` ("target ≠ source").
 * Phalanx Fighting's per-ally defense increment carries this so the buff only
 * accrues from nearby allies, never from the self-target slot.
 */
function requiresExcludesSelf(requires) {
  if (!requires) return false;
  return requires.includes('entref target>') &&
    requires.includes('entref source>') &&
    requires.includes('eq !');
}

/**
 * Classify a raw template into our effect key system for stacking detection.
 * Returns array of { effectKey, subKey? } or empty if not a self-buff.
 */
function classifyTemplateForStacking(template, { treatAsCaster = false } = {}) {
  if (!template.attribs || template.attribs.length === 0) return [];
  // Most call sites only want Self-targeted templates. The redirect-chain
  // walker passes treatAsCaster=true to also accept AnyAffected templates,
  // because pseudo-pet Sphere AoEs centered on the caster are functionally
  // caster self-buffs (Fulcrum Shift's KineticTransferBuffSelf, etc.).
  if (template.target !== 'Self' && !(treatAsCaster && template.target === 'AnyAffected')) return [];

  // Skip AttackType-tagging metadata templates (see extractEffects for full
  // rationale). They target=Self with aspect=Strength scale=0 mag=0 across
  // all damage types, but they are not real damage buffs and shouldn't
  // contribute to stacking metadata.
  if (
    template.attribs.length >= 7 &&
    template.attribs.every(a => DAMAGE_TYPES[a?.toLowerCase()]) &&
    template.aspect?.toLowerCase() === 'strength' &&
    (template.scale || 0) === 0 &&
    (template.magnitude || 0) === 0
  ) {
    return [];
  }

  const aspect = template.aspect?.toLowerCase();
  const scale = template.scale || 0;
  const table = template.table || '';
  const tableLower = table.toLowerCase();
  const isDebuff = scale < 0 || tableLower.includes('debuff');

  // Only care about self-buffs (positive effects)
  if (isDebuff) return [];

  // Self-targeted aspect=Strength buffs are routed by extractEffects into the
  // `specialBuff` strength container (Power Boost family: +Def/+ToHit/+Mez/
  // +Heal/+Absorb/+EndMod/+Movement STRENGTH). Mirror that here so stacking
  // metadata (stacksLinear) references the real `specialBuff` key instead of
  // the old damageBuff/defenseBuff/tohitBuff keys. The lone exception is the
  // *damage* strength buff (Build Up/Assault), whose attribs carry the `_Dmg`
  // suffix and which extractEffects keeps on `damageBuff` — let those fall
  // through to the per-attrib logic below.
  if (aspect === 'strength') {
    const isDamageStrength = template.attribs.some(a => {
      const al = a?.toLowerCase();
      return al && al.endsWith('_dmg') && al !== 'heal_dmg';
    });
    // Accuracy is a Strength-aspect stat by nature; extractEffects routes its
    // buff to `accuracyBuff` (not the specialBuff strength container), so let it
    // fall through to the combat-modifier mapping below for matching metadata.
    const isAccuracy = template.attribs.some(a => a?.toLowerCase() === 'accuracy');
    // RechargeTime is likewise a Strength-aspect stat whose buff extractEffects
    // keeps on the flat `rechargeBuff` key (the rechargeTime branch has no
    // specialBuff routing) — e.g. Entropy Shield's per-foe +recharge. Routing it
    // to specialBuff here would mis-key the stacking/perTarget patch and drop the
    // (calc-relevant) recharge buff. Let it fall through to rechargeBuff.
    const isRecharge = template.attribs.some(a => a?.toLowerCase() === 'rechargetime');
    if (!isDamageStrength && !isAccuracy && !isRecharge) return [{ effectKey: 'specialBuff' }];
  }

  const results = [];

  // Debuff-resistance (Res to -Regen/-Recovery/-Endurance/-Recharge/-ToHit/
  // -Defense) is a genuine stacking self-buff for powers like Psychokinetic
  // Barrier (RefreshToCount ×3). It rides on aspect=Resistance resource/combat
  // attribs. extractEffects routes all of them onto the single `debuffResistance`
  // container, so stacking metadata must reference that one key — deduped, since
  // a single template carries all four attribs (Endurance+Regeneration+Recovery+
  // RechargeTime share one template and one stack_limit).
  const pushDebuffRes = () => {
    if (!results.some(r => r.effectKey === 'debuffResistance')) {
      results.push({ effectKey: 'debuffResistance' });
    }
  };

  for (const rawAttrib of template.attribs) {
    const attrib = rawAttrib?.toLowerCase();
    if (!attrib) continue;
    if (SPECIAL_ATTRIBS.has(attrib)) continue;

    // Damage type attributes
    if (DAMAGE_TYPES[attrib]) {
      if (aspect === 'strength') {
        return [{ effectKey: 'damageBuff' }];
      }
      if (aspect === 'resistance') {
        results.push({ effectKey: 'resistance', subKey: DAMAGE_TYPES[attrib].toLowerCase() });
        continue;
      }
      if (tableLower.includes('buff_def')) {
        results.push({ effectKey: 'defenseBuff', subKey: DAMAGE_TYPES[attrib].toLowerCase() });
        continue;
      }
      continue;
    }

    // Defense positions
    if (DEFENSE_POSITIONS[attrib]) {
      const posType = DEFENSE_POSITIONS[attrib].toLowerCase();
      if (aspect === 'resistance') {
        results.push({ effectKey: 'resistance', subKey: posType });
      } else {
        results.push({ effectKey: 'defenseBuff', subKey: posType });
      }
      continue;
    }

    // Resources — resistance aspect is debuff-resistance (stacks as one key)
    if (RESOURCE_TYPES[attrib]) {
      if (aspect === 'resistance') { pushDebuffRes(); continue; }
      const resType = RESOURCE_TYPES[attrib];
      if (resType === 'hitPoints') {
        if (aspect === 'maximum') return [{ effectKey: 'maxHPBuff' }];
      }
      if (resType === 'endurance') {
        if (aspect === 'maximum') return [{ effectKey: 'maxEndBuff' }];
        if (!isDebuff) return [{ effectKey: 'enduranceGain' }];
      }
      if (resType === 'recovery') return [{ effectKey: 'recoveryBuff' }];
      if (resType === 'regeneration') return [{ effectKey: 'regenBuff' }];
      if (resType === 'absorb') {
        // An aspect=Maximum Expression absorb is a MaxHP FRACTION (Wild Bastion /
        // Parasitic Aura's `Max.kHitPoints source> C *`), recovered as `maxHPFraction`
        // by projectAtomsToEffects' pre-scan — NOT a flat per-target absorb. Its
        // placeholder scale (1.0 = @StdResult) must not join the AoE per-target sum: on
        // Parasitic Aura (a PBAoE carrying BOTH a flat Current 0.1 and this Max/Expression
        // template) it inflated the per-foe 10% to 110% (0.1 + 1.0). The resources loop
        // routes these to `maxHPFraction` and `continue`s past addOrAccumulate; mirror
        // that skip here so the stacking classification agrees.
        if (aspect === 'maximum' && template.type === 'Expression') continue;
        return [{ effectKey: 'absorb' }];
      }
      continue;
    }

    // Combat modifiers
    if (COMBAT_MODIFIERS[attrib]) {
      const modType = COMBAT_MODIFIERS[attrib];
      // Resistance aspect on a combat modifier is debuff-resistance (Res to
      // -Recharge/-ToHit/-Defense), NOT a positive buff. Route it to the
      // debuffResistance key BEFORE the buff branches below — otherwise a
      // positive-scale -Recharge-resistance (Psychokinetic Barrier's
      // RechargeTime@Resistance) leaks through as a fake `rechargeBuff`.
      if (aspect === 'resistance') { pushDebuffRes(); continue; }
      if (modType === 'toHit' && !isDebuff) return [{ effectKey: 'tohitBuff' }];
      if (modType === 'accuracy' && !isDebuff) return [{ effectKey: 'accuracyBuff' }];
      if (modType === 'rechargeTime' && !isDebuff && !tableLower.includes('slow')) return [{ effectKey: 'rechargeBuff' }];
      if (modType === 'threatLevel') return [{ effectKey: 'threatBuff' }];
      if (modType === 'enduranceDiscount') return [{ effectKey: 'enduranceDiscount' }];
      continue;
    }

    // Movement attributes — self-buff stacking (e.g. Siphon Speed caster runspeed)
    // The dashboard surfaces these as top-level keys via the `movement` block; for
    // stacksLinear purposes we list the bare key.
    if (MOVEMENT_TYPES[attrib]) {
      results.push({ effectKey: MOVEMENT_TYPES[attrib] });
      continue;
    }
  }

  return results;
}

/**
 * Recursively walk an Execute_Power redirect chain (e.g. Fulcrum Shift →
 * Redirects.Kinetics.KineticTransfer → KineticTransferBuffSelf) and collect
 * Stack templates that contribute to caster-side per-target buffs.
 *
 * Returns { templates, maxStacks }. Templates may target Self (direct caster
 * buff) or AnyAffected when the leaf is a Sphere/AoE pseudo-pet centered on
 * the caster — both behave as caster self-buffs in-game.
 */
function collectRedirectStackingTemplates(redirectName, visited = new Set(), depth = 0) {
  if (depth > 5) return { templates: [], maxStacks: null };
  const key = redirectName.toLowerCase();
  if (visited.has(key)) return { templates: [], maxStacks: null };
  visited.add(key);

  const redirectPath = resolveRedirectPath(redirectName);
  if (!fs.existsSync(redirectPath)) return { templates: [], maxStacks: null };

  let redirectJson;
  try { redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8')); } catch { return { templates: [], maxStacks: null }; }
  if (!redirectJson.effects || redirectJson.effects.length === 0) return { templates: [], maxStacks: null };

  const collected = [];
  let maxStacks = (redirectJson.number_allowed && redirectJson.number_allowed > 1) ? redirectJson.number_allowed : null;

  // Pseudo-pet Sphere AoEs centered on caster show up as AnyAffected templates;
  // accept them as caster-side at and below this depth.
  const isPseudoPetAoE = (redirectJson.effect_area === 'Sphere' || redirectJson.effect_area === 'AoE')
    && (redirectJson.max_targets_hit === 255 || (redirectJson.max_targets_hit ?? 0) >= 1);

  const templates = collectTemplatesWithMeta(redirectJson.effects);
  for (const { template: rt } of templates) {
    if (rt.stack !== 'Stack') continue;

    const attrib = rt.attribs?.[0]?.toLowerCase();
    if (attrib === 'execute_power') {
      const childNames = (rt.params && rt.params.power_names) || [];
      for (const cn of childNames) {
        if (!cn.toLowerCase().startsWith('redirects.')) continue;
        const child = collectRedirectStackingTemplates(cn, visited, depth + 1);
        collected.push(...child.templates);
        if (child.maxStacks && (!maxStacks || child.maxStacks > maxStacks)) maxStacks = child.maxStacks;
      }
      continue;
    }

    if (rt.target === 'Self') {
      collected.push({ template: rt, treatAsCaster: false });
    } else if (rt.target === 'AnyAffected' && isPseudoPetAoE) {
      collected.push({ template: rt, treatAsCaster: true });
    }
  }

  return { templates: collected, maxStacks };
}

/**
 * Detect self-stacking from `stack_limit` on caster-targeted templates.
 * Used when a power applies a buff to itself with a self-stacking StackType and
 * a stack_limit > 1 (e.g. Siphon Speed caster recharge/movement buffs,
 * Healing Flames toxic resist, Psychokinetic Barrier debuff-resistance).
 *
 * Two self-stacking StackTypes accumulate magnitude up to stack_limit:
 *   - `kStack`          — N independent instances (each own timer)
 *   - `kRefreshToCount` — one shared counter refreshed on each recast; still
 *                         N× magnitude up to the cap (Psychokinetic Barrier's
 *                         RefreshToCount ×3 debuff-resistance rode this and was
 *                         previously invisible). `kReplace`/`kContinuous` do NOT
 *                         accumulate (replace / single toggle instance) and stay out.
 *
 * `excludeKeys` skips effect keys already claimed by the AoE per-target path
 * (which models them via `perTarget`), so a key is never both perTarget AND
 * stacksLinear — that would double-scale (N² in the InfoPanel).
 *
 * Returns:
 *   - maxStacks: the largest stack_limit across qualifying Self templates
 *   - stacksLinear: distinct top-level effect keys that grow linearly with stacks
 *   - stackCaps: per-key cap for keys whose own stack_limit is BELOW maxStacks
 *     (Psychokinetic Barrier: absorb caps at 2 while debuff-res reaches 3), so
 *     the slider can range to maxStacks without over-multiplying the lower-cap key.
 * or null if no qualifying templates.
 */
function detectSelfStacking(allTemplatesWithMeta, excludeKeys = new Set()) {
  let maxStacks = 0;
  const stacksLinearSet = new Set();
  const capByKey = {};

  for (const { template } of allTemplatesWithMeta) {
    if (template.target !== 'Self') continue;
    if (template.stack !== 'Stack' && template.stack !== 'RefreshToCount') continue;
    const limit = template.stack_limit;
    if (!limit || limit <= 1) continue;

    const classifications = classifyTemplateForStacking(template)
      .filter(c => !excludeKeys.has(c.effectKey));
    if (classifications.length === 0) continue;

    if (limit > maxStacks) maxStacks = limit;
    for (const c of classifications) {
      stacksLinearSet.add(c.effectKey);
      capByKey[c.effectKey] = Math.max(capByKey[c.effectKey] || 0, limit);
    }
  }

  if (maxStacks === 0) return null;
  const stacksLinear = [...stacksLinearSet].sort();
  const stackCaps = {};
  for (const key of stacksLinear) {
    if (capByKey[key] && capByKey[key] < maxStacks) stackCaps[key] = capByKey[key];
  }
  const result = { maxStacks, stacksLinear };
  if (Object.keys(stackCaps).length > 0) result.stackCaps = stackCaps;
  return result;
}

/**
 * Whether a template's `requires_expression` gate is one that
 * `collectConditionalsGrouped` SURFACES as a `conditionalEffects` entry — Bio
 * Armor's `kDefensiveAdaptation Source.Mode?`, power-presence (`…source.ownPower?`),
 * kStealth, drowning, vs-type tags, etc. Only those templates get re-homed into a
 * conditional (where their per-foe scaling is recomputed), so only those must be
 * EXCLUDED from base per-target detection.
 *
 * This deliberately matches `_classifyConditionalGate`, NOT the broader
 * `_isConditionalGate`: untoggleable gates the planner keeps in base — on-hit /
 * force-hit (`@ToHitRoll`, Consume's per-foe endurance), `isPVPMap?` (Invincibility's
 * PvE/PvP defense split), enttype/HasTag content checks — return null there and so
 * stay in base, exactly as the pre-existing stacking pipeline treated them.
 * Out-of-combat gates (combat-suppressed, kept in base) also stay.
 */
function _isBaseExcludedGate(req, powersetKey) {
  if (!req) return false;
  if (_isOutOfCombatGate(req)) return false; // combat-gated stays in base
  return _classifyConditionalGate(req, powersetKey) !== null;
}

/**
 * AoE per-target core — the Stack/Continuous/Replace → `{ scale, perTarget }`
 * computation shared by base-effect detection (`detectStackingEffects`) and the
 * per-conditional-group detection (`extractConditionalEffects`). Given a list of
 * `{ template, tags, requires }` and the power's AoE geometry, returns the
 * per-target patches for Self-targeted buffs.
 *
 * `aoeMeta`:
 *   - effectArea: normalized ('AoE' | 'Cone' | …) — bin "Sphere" must already be
 *     mapped through EFFECT_AREA_MAP (missing this dropped Invincibility's regen
 *     perTarget).
 *   - maxTargets: max_targets_hit (must be > 1 and != 255 = team-wide).
 *   - selfIsCountedTarget: whether Self is in targets_affected. When true the
 *     N=1 slot is self, so a per-target increment whose `requires` excludes self
 *     (target ≠ source) does NOT apply at N=1 → the N=1 value is the bare base
 *     (Phalanx Fighting). Foe auras (Invincibility, Evolving Armor) never count
 *     self, so N=1 already carries one increment.
 */
function computeAoePerTargetPatches(templatesWithMeta, aoeMeta) {
  const patches = {};
  const isAoEWithTargets = (aoeMeta.effectArea === 'AoE' || aoeMeta.effectArea === 'Cone') &&
    aoeMeta.maxTargets && aoeMeta.maxTargets > 1 && aoeMeta.maxTargets !== 255;
  if (!isAoEWithTargets) return patches;
  const selfIsCountedTarget = aoeMeta.selfIsCountedTarget;

  const selfBuffs = [];
  for (const { template, tags, requires } of templatesWithMeta) {
    if (template.target !== 'Self') continue;
    // Stack/Continuous/RefreshToCount are per-target increments; Replace is the
    // always-on base. RefreshToCount is the accumulate-per-foe self-buff behind
    // Consume/Devour Psyche (self +Regen/+Recovery grows per foe hit, ×10).
    if (template.stack !== 'Stack' && template.stack !== 'Continuous'
        && template.stack !== 'Replace' && template.stack !== 'RefreshToCount') continue;

    const isDefiance = (tags || []).some(t =>
      typeof t === 'string' && t.toLowerCase().includes('defiance')
    );

    const classifications = classifyTemplateForStacking(template);
    if (classifications.length === 0) continue;

    for (const classification of classifications) {
      selfBuffs.push({
        ...classification,
        scale: Math.abs(template.scale || 0),
        table: template.table,
        stack: template.stack,
        isDefiance,
        excludesSelf: requiresExcludesSelf(requires),
        template,
      });
    }
  }

  // Group by effectKey + subKey
  const groups = {};
  for (const buff of selfBuffs) {
    const groupKey = buff.subKey ? `${buff.effectKey}.${buff.subKey}` : buff.effectKey;
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(buff);
  }

  // Compute perTarget for each group
  for (const [, entries] of Object.entries(groups)) {
    // Stack/Continuous/RefreshToCount = per-target increment; Replace = base
    const stacks = entries.filter(e => (e.stack === 'Stack' || e.stack === 'Continuous' || e.stack === 'RefreshToCount') && !e.isDefiance);
    const replaces = entries.filter(e => e.stack === 'Replace' && !e.isDefiance);

    if (stacks.length === 0) continue;

    // Restrict to the DOMINANT table (max Σ|scale|). A single-table slot must not
    // sum cross-table riders: Rebirth strips the `Defiance` tag from a blaster's
    // +0.063/foe on the flat `Melee_Ones` table, so the `!isDefiance` filter above
    // can't drop it — without this it leaks into Soul Drain's Melee_Buff_Dmg per-foe
    // value (4.8 → 4.863). Mirrors `damageBuffValue`'s dominant-table filter so the
    // bag and the atom reconstruction agree. No-op for the common single-table group.
    const tableWeight = new Map();
    for (const e of [...stacks, ...replaces]) tableWeight.set(e.table, (tableWeight.get(e.table) || 0) + e.scale);
    let domTable = stacks[0].table;
    let domWeight = -Infinity;
    for (const [t, w] of tableWeight) if (w > domWeight) ((domWeight = w), (domTable = t));
    const domStacks = stacks.filter(e => e.table === domTable);
    const domReplaces = replaces.filter(e => e.table === domTable);
    if (domStacks.length === 0) continue;

    // Sum DISTINCT (scale, table) increments — not every template. A by-type
    // buff is ONE logical increment applied across N damage types; some exports
    // encode it as one multi-attrib template (HC), others as N single-attrib
    // templates (Rebirth), and a burst+tail buff repeats the same (scale, table)
    // at two durations. Summing raw templates N×-inflated the per-foe value on
    // the per-type-template datasets (Rebirth Sunless Mire's +1.25/foe read as
    // +20/foe — 8 types × 2 durations). Deduping by (scale, table) collapses the
    // explosion to the one real increment, so the bag matches HC (multi-attrib)
    // and the atom reconstruction (`damageBuffValue`, which dedups the same way).
    // Genuinely distinct increments differ in scale, so they still sum.
    const sumDistinctScale = (arr) => {
      const seen = new Set();
      let s = 0;
      for (const e of arr) {
        const k = `${e.scale}|${e.table}`;
        if (seen.has(k)) continue;
        seen.add(k);
        s += e.scale;
      }
      return s;
    };
    const stackScale = sumDistinctScale(domStacks);
    const replaceScale = sumDistinctScale(domReplaces);
    const table = domStacks[0].table;
    const perTarget = stackScale;

    // Stamp each increment template with its own per-target contribution so
    // `encodeAtomsForEmit` can mark its atom(s) `perTarget`. The runtime then
    // recovers the group's value as Σ atom.perTarget without re-deriving the AoE
    // geometry / stack-flavor this function alone sees (AtomicEffect.perTarget).
    // Only the dominant-table increments are stamped — an off-table rider is not
    // part of this slot's per-foe value (and `damageBuffValue` drops it too).
    for (const e of domStacks) {
      if (e.template) e.template._perTargetIncrement = e.scale;
    }

    // `scale` is the value at N=1 (one target hit). The downstream calc applies
    // `scale + perTarget × (N − 1)`. See selfIsCountedTarget above.
    const firstTargetExcluded = selfIsCountedTarget && domStacks.every(e => e.excludesSelf);
    const combinedScale = firstTargetExcluded ? replaceScale : replaceScale + stackScale;

    const firstEntry = domStacks[0];
    if (firstEntry.subKey) {
      if (!patches[firstEntry.effectKey]) patches[firstEntry.effectKey] = {};
      patches[firstEntry.effectKey][firstEntry.subKey] = { scale: combinedScale, table, perTarget };
    } else {
      patches[firstEntry.effectKey] = { scale: combinedScale, table, perTarget };
    }
  }

  // A MaxHP-fraction absorb grows per foe like any other Self/kStack mod in a foe-targeted
  // block, but it has no scale to increment: its Scale is the 1.0 @StdResult placeholder the
  // classifier above deliberately skips, and the magnitude rides an Expression. Each foe hit
  // re-applies that same Expression, so the increment IS the recovered fraction, carried as a
  // companion to `maxHPFraction` rather than as a `perTarget` on a scale that means nothing
  // (PROD6C-3j). Only one distinct fraction ever reaches the bag — the pre-scan defers a group
  // carrying more — so the first match is the whole increment.
  for (const { template } of templatesWithMeta) {
    if (template.target !== 'Self') continue;
    if (template.stack !== 'Stack' && template.stack !== 'Continuous'
        && template.stack !== 'RefreshToCount') continue;
    if ((template.attribs?.[0] || '').toLowerCase() !== 'absorb') continue;
    if (template.aspect !== 'Maximum' || template.type !== 'Expression') continue;
    const parsed = parseAbsorbMaxHPFraction(
      template.magnitude_expression,
      template.scale,
      template.table,
      (template.flags || []).includes('IgnoreStrength'),
    );
    if (!parsed) continue;
    patches.absorb = { ...(patches.absorb || {}), maxHPFractionPerTarget: parsed.fraction };
    break;
  }
  return patches;
}

/**
 * Detect per-target stacking effects in a raw power JSON.
 * Analyzes Stack/Continuous templates and returns patches to merge into effects.
 *
 * Also detects Execute_Power redirect stacking for non-AoE powers
 * (e.g., Reactive Regeneration → maxStacks from number_allowed).
 */
function detectStackingEffects(rawJson) {
  if (!rawJson.effects || rawJson.effects.length === 0) return null;

  const allTemplatesWithMeta = collectTemplatesWithMeta(rawJson.effects);
  // Mode/state-gated templates (Bio Armor's Defensive/Efficient per-foe buffs,
  // Domination boosts, …) are surfaced as `conditionalEffects`, not base — the
  // base template collector (collectTemplatesDeep) already excludes them from
  // base extractEffects. The per-target detector historically did NOT, folding
  // their perTarget scaling into the always-on base (Evolving Armor granting
  // defense/regen in EVERY stance). Mirror the base collector here so the gated
  // per-foe scaling rides its stance conditional (see extractConditionalEffects)
  // instead of leaking into base.
  const stackingPowersetKey = rawJson.powerset || rawJson.full_name;
  const baseTemplatesWithMeta = allTemplatesWithMeta.filter(
    (m) => !_isBaseExcludedGate(m.requires, stackingPowersetKey),
  );

  // === AoE per-target stacking (Stack/Continuous + Replace) ===
  const aoeMeta = {
    // Normalize through EFFECT_AREA_MAP — bin format uses "Sphere" for what the
    // planner calls "AoE".
    effectArea: EFFECT_AREA_MAP[rawJson.effect_area] ?? rawJson.effect_area,
    maxTargets: rawJson.max_targets_hit,
    selfIsCountedTarget: (rawJson.targets_affected || []).includes('Self'),
  };
  const patches = computeAoePerTargetPatches(baseTemplatesWithMeta, aoeMeta);
  let maxStacks = null;

  // (scale, table) of every AoE-path per-target INCREMENT, i.e. the templates
  // `computeAoePerTargetPatches` just stamped `_perTargetIncrement` on. When this
  // detector runs over the power's OWN json those templates are the same objects
  // that become its atoms, so the direct stamp already reached them and these
  // signatures are redundant. They are NOT redundant when the caller reached into
  // a REDIRECT (Consume/Devour Psyche's RefreshToCount ×10 +Regen/+Recovery):
  // `redirectJson` is parsed separately, so the stamp lands on template objects
  // that never reach `allTemplates` and the increment would be missing from the
  // wire atom. The caller replays these onto `allTemplates` in exactly that case —
  // mirroring `redirectPerTargetSigs` below, which covers the Execute_Power branch
  // only. See `AtomicEffect.perTarget`.
  const aoePerTargetSigs = [];
  for (const { template } of baseTemplatesWithMeta) {
    if (!template?._perTargetIncrement) continue;
    if (template.table) {
      aoePerTargetSigs.push({ scale: Math.abs(template._perTargetIncrement), table: template.table });
    }
  }

  // (scale, table) of every redirect-derived per-target INCREMENT. The redirect
  // chain's templates are parsed from a separate file, so they are NOT the same
  // objects that become this power's atoms (allTemplates) — computeAoePerTargetPatches
  // can stamp `_perTargetIncrement` directly, but this branch cannot. Instead we
  // collect the signatures here and stamp the matching allTemplates atoms back in
  // the caller, so `damageBuffValue` recovers Fulcrum Shift's per-foe increment
  // (its base 4 rides KineticTransferBuffSelf, the +2/foe rides KineticTransferBuff).
  const redirectPerTargetSigs = [];

  // === Execute_Power redirect stacking (multi-level) ===
  // Handles two patterns under one rule:
  //   (1) Reactive-Regeneration: outer Self → redirect with number_allowed > 1
  //       (multi-stack pseudo-pet) → contributions are perTarget.
  //   (2) Fulcrum-Shift: outer AnyAffected → redirect chain executed once per
  //       enemy hit → contributions are perTarget. Plus an outer Self →
  //       one-shot caster buff (KineticTransferBuffSelf) → contributions are
  //       BASE (scale).
  //
  // Rule: kind is 'perTarget' when the outer Execute_Power targets AnyAffected
  // OR the redirect declares number_allowed > 1; otherwise 'base'.
  for (const { template } of baseTemplatesWithMeta) {
    const attrib = template.attribs && template.attribs[0] ? template.attribs[0].toLowerCase() : null;
    if (attrib !== 'execute_power') continue;
    if (template.stack !== 'Stack') continue;

    const powerNames = (template.params && template.params.power_names) || [];
    for (const pName of powerNames) {
      if (!pName.toLowerCase().startsWith('redirects.')) continue;

      const { templates: chainTemplates, maxStacks: chainMax } = collectRedirectStackingTemplates(pName);
      const isPerTarget = template.target === 'AnyAffected' || (chainMax !== null && chainMax > 1);
      if (chainMax && (maxStacks === null || chainMax > maxStacks)) maxStacks = chainMax;

      for (const { template: rt, treatAsCaster } of chainTemplates) {
        const classifications = classifyTemplateForStacking(rt, { treatAsCaster });
        for (const cls of classifications) {
          const scale = Math.abs(rt.scale || 0);

          // Locate (or create) the patch entry for this effect.
          let entry;
          if (cls.subKey) {
            if (!patches[cls.effectKey]) patches[cls.effectKey] = {};
            if (!patches[cls.effectKey][cls.subKey]) {
              patches[cls.effectKey][cls.subKey] = { scale: 0, table: rt.table, perTarget: 0 };
            }
            entry = patches[cls.effectKey][cls.subKey];
          } else {
            const existing = patches[cls.effectKey];
            if (!existing || typeof existing !== 'object' || !('scale' in existing)) {
              patches[cls.effectKey] = { scale: 0, table: rt.table, perTarget: 0 };
            }
            entry = patches[cls.effectKey];
          }

          if (isPerTarget) {
            entry.perTarget = (entry.perTarget || 0) + scale;
            if (scale > 0 && rt.table) redirectPerTargetSigs.push({ scale, table: rt.table });
          } else {
            entry.scale = (entry.scale || 0) + scale;
          }
          if (!entry.table) entry.table = rt.table;
        }
      }
    }
  }

  // === Self-stacking via stack_limit (e.g., Siphon Speed, Healing Flames) ===
  // Independent of AoE per-target detection: applies whenever the power has
  // Self-targeted Stack/RefreshToCount templates with stack_limit > 1. Composes
  // with the Execute_Power redirect path by taking max(maxStacks, ...).
  //
  // Exclude keys already modeled as `perTarget` by the AoE branch above — a key
  // must not be BOTH perTarget and stacksLinear or the InfoPanel double-scales it
  // (Consume Psyche's regen/recovery are perTarget; without this they'd also be
  // stacksLinear → ~N² at 10 foes).
  const selfStacking = detectSelfStacking(baseTemplatesWithMeta, new Set(Object.keys(patches)));
  let stacksLinear = null;
  let stackCaps = null;
  if (selfStacking) {
    if (maxStacks === null || selfStacking.maxStacks > maxStacks) {
      maxStacks = selfStacking.maxStacks;
    }
    stacksLinear = selfStacking.stacksLinear;
    stackCaps = selfStacking.stackCaps || null;
  }

  if (Object.keys(patches).length === 0 && maxStacks === null && !stacksLinear) return null;
  return { patches, maxStacks, stacksLinear, stackCaps, redirectPerTargetSigs, aoePerTargetSigs };
}

/**
 * Merge stacking patches into an existing effects object.
 * Updates scale values and adds perTarget fields.
 */
function mergeStackingPatches(effects, stackingResult) {
  if (!stackingResult) return;

  const { patches, maxStacks, stacksLinear, stackCaps } = stackingResult;

  // MERGE (not overwrite): the absorb pre-scan / an earlier detector may have
  // already set maxStacks/stacksLinear (Psychokinetic Barrier's absorb via the
  // Stack path). Take the larger cap and the union of keys so no earlier entry
  // is lost when the RefreshToCount debuff-resistance bumps maxStacks 2 → 3.
  if (maxStacks) {
    effects.maxStacks = Math.max(effects.maxStacks || 0, maxStacks);
  }

  if (stacksLinear && stacksLinear.length > 0) {
    const merged = new Set([...(effects.stacksLinear || []), ...stacksLinear]);
    effects.stacksLinear = [...merged].sort();
  }

  if (stackCaps && Object.keys(stackCaps).length > 0) {
    effects.stackCaps = { ...(effects.stackCaps || {}), ...stackCaps };
  }

  // Prune caps that no longer diverge from the final maxStacks (== or > it are
  // redundant — min(n, cap) already collapses to min(n, maxStacks)).
  if (effects.stackCaps) {
    for (const key of Object.keys(effects.stackCaps)) {
      if (!effects.stacksLinear?.includes(key)
          || effects.stackCaps[key] >= (effects.maxStacks || Infinity)) {
        delete effects.stackCaps[key];
      }
    }
    if (Object.keys(effects.stackCaps).length === 0) delete effects.stackCaps;
  }

  for (let [key, patchValue] of Object.entries(patches)) {
    // The MaxHP-fraction absorb increment (PROD6C-3j) is a companion to `maxHPFraction`, not a
    // by-type sub-value — lift it off before the shape-based routing below sees a scale-less
    // object and treats it as one. It only lands where the pre-scan actually recovered a
    // fraction: a deferred (duration-only) absorb has no magnitude for an increment to grow.
    if (key === 'absorb' && 'maxHPFractionPerTarget' in patchValue) {
      const { maxHPFractionPerTarget, ...rest } = patchValue;
      if (effects.absorb?.maxHPFraction != null) {
        effects.absorb.maxHPFractionPerTarget = maxHPFractionPerTarget;
      }
      if (!('scale' in rest)) continue;
      patchValue = rest;
    }
    if (typeof patchValue === 'object' && !('scale' in patchValue)) {
      // By-type patch (e.g., resistance: { smashing: {...} })
      if (!effects[key] || typeof effects[key] !== 'object') {
        effects[key] = {};
      }
      for (const [subKey, subVal] of Object.entries(patchValue)) {
        const existing = effects[key][subKey];
        if (existing && typeof existing === 'object') {
          // For redirect stacking: add perTarget to existing base scale
          if (subVal.scale === 0 && existing.scale) {
            effects[key][subKey] = { ...existing, perTarget: subVal.perTarget };
          } else {
            effects[key][subKey] = { scale: subVal.scale, table: subVal.table || existing.table, perTarget: subVal.perTarget };
          }
        } else {
          effects[key][subKey] = subVal;
        }
      }
    } else {
      // Simple effect patch (e.g., tohitBuff, damageBuff, regenBuff).
      const existing = effects[key];
      // `specialBuff`/`specialDebuff` are KEYED strength containers
      // ({ recharge, defense, tohit, … }), but classifyTemplateForStacking
      // returns 'specialBuff' WITHOUT a subKey, so the patch arrives shapeless.
      // Applying it flat would clobber the container (or create a bare
      // { scale, table } — breaking the NumberOrScaled type and dropping the
      // strength buff in the calc). The patch only adds perTarget scaling, which
      // collectStrengthBuffs doesn't read off specialBuff values anyway (it uses
      // stacksLinear/maxStacks), so skip it and keep extractEffects' keyed
      // container authoritative.
      if (key === 'specialBuff' || key === 'specialDebuff'
          || (existing && typeof existing === 'object' && !('scale' in existing))) {
        continue;
      }
      if (existing && typeof existing === 'object' && 'scale' in existing) {
        // For redirect stacking: add perTarget to existing base scale
        if (patchValue.scale === 0 && existing.scale) {
          effects[key] = { ...existing, perTarget: patchValue.perTarget };
        } else {
          effects[key] = { scale: patchValue.scale, table: patchValue.table || existing.table, perTarget: patchValue.perTarget };
        }
      } else if (patchValue.scale > 0) {
        effects[key] = patchValue;
      } else if (existing !== undefined && patchValue.perTarget) {
        // existing is a number or something else — wrap with perTarget
        const s = typeof existing === 'number' ? existing : (existing?.scale || 0);
        effects[key] = { scale: s, table: patchValue.table, perTarget: patchValue.perTarget };
      }
    }
  }
}

// Display name overrides for powers where clientmessages has stale/incorrect names
const DISPLAY_NAME_OVERRIDES = {
  // Bio Armor's "Adaptation"/"Evolving Armor" overrides were removed: they were
  // written for the old April-2019 clientmessages source whose display names
  // were swapped. The current pigg/bin export already carries the correct
  // `display_name` per power (internal "Evolution" → "Adaptation", internal
  // "Adaptation" → "Evolving Armor"), so overriding here re-introduced the swap.
  // Trust `display_name` from the source instead.
};

// Icon overrides for powers where binary data references a renamed/missing icon file
const ICON_OVERRIDES = {
  'regeneration_resist.png': 'regeneration_resilience.png',  // Resilience icon renamed on HC
  'electriccontrol_paralyzingblastpatch.png': 'electriccontrol_paralyzingblast.png',  // Paralyzing Blast (was Tesla Coil)
  "martialarts_warrior'schallenge.png": 'martialarts_warrior%27schallenge.png',  // Apostrophe in filename
  'psionicarmor_worldofconfusion.png': 'psionicarmor_auraofinsanity.png',  // Aura of Insanity uses wrong icon name
  // Sonic Melee icons now extracted from live pigg — no overrides needed
};

// Ensure icon path has a file extension. Bin export emits bare names like
// "atomicmanipulation_weakpunch"; the planner's icon resolver expects ".png"
// (or .ico for set icons). Append .png if no extension is present.
function normalizeIconPath(icon) {
  if (!icon) return icon;
  // Already has an extension
  if (/\.[a-z0-9]{2,4}$/i.test(icon)) return icon;
  return icon + '.png';
}

/**
 * Convert a single power file
 */
// Thunderspy stores all damage under a single generic `Damage` attrib, so
// extractDamage types it as `Special`; the real element lives only in the
// power's shortHelp (e.g. "Ranged, Minor DMG(Fire)", "DMG(Energy/Smash)").
// These helpers recover the primary element from the shortHelp and re-type the
// generic-Special damage entries. Multi-type powers (Energy/Smash) collapse to
// the primary (first) element since the binary carries no per-component type.
const _DMG_TYPE_MAP = {
  smash: 'Smashing', smashing: 'Smashing', lethal: 'Lethal', fire: 'Fire',
  cold: 'Cold', energy: 'Energy', negative: 'Negative', 'negative energy': 'Negative',
  psionic: 'Psionic', toxic: 'Toxic', special: 'Special',
};

function _damageTypeFromShortHelp(shortHelp) {
  if (!shortHelp) return null;
  // `DoT(...)` as well as `DMG(...)`: a pure damage-over-time attack (e.g.
  // "DoT(Fire)") carries its element only in the DoT clause, and the bag typer
  // left those `Special`. First clause = primary element (this stays a single
  // value; the per-template bag can't hold a set — see damageTypeSetFromPower).
  const m = shortHelp.match(/D(?:MG|oT)\(([^)]+)\)/i);
  if (!m) return null;
  const first = m[1].split(/[/,]/)[0].trim().toLowerCase();
  return _DMG_TYPE_MAP[first] || null;
}

// The power's damage-type SET (chip source), sourced Rule-0-honestly from the two
// structured fields the tspy binary carries — NEVER stamped onto individual atoms
// (per-template element is genuinely absent, so per-atom typing would fabricate the
// multi-component split). See the design spec + DATA-GAP-REGISTER#TSPY-3.
//   - `attack_types`: raw ints already in the export; value ÷4 indexes ATTRIB_NAME,
//     indices 29–36 being the damage elements (26/27/28 are Melee/Ranged/Area
//     position, ignored). Power-level, lossy (undercounts secondaries), ~0 false types.
//   - shortHelp `DMG()`/`DoT()` clauses: complementary — recovers DoT secondaries
//     `attack_types` drops. Union ≈ 78% exact vs the HC oracle; errors are undercount
//     only (never invents a type), residual = secondaries stated only in prose.
// The JS ÷4 map mirrors the parser's ATTRIB_NAME[29..36]; the HC-oracle guard
// (scripts/audit-damage-type-recovery.cjs) self-checks it (recovered ⊆ atom truth).
const DAMAGE_ATTRIB_INDEX = {
  29: 'Smashing', 30: 'Lethal', 31: 'Fire', 32: 'Cold',
  33: 'Energy', 34: 'Negative', 35: 'Psionic', 36: 'Toxic',
};
function damageTypeSetFromPower(powerJson) {
  const set = new Set();
  for (const v of powerJson.attack_types || []) {
    if (typeof v === 'number' && v % 4 === 0) {
      const el = DAMAGE_ATTRIB_INDEX[v / 4];
      if (el) set.add(el);
    }
  }
  for (const m of (powerJson.display_short_help || '').matchAll(/D(?:MG|oT)\(([^)]+)\)/gi)) {
    for (const part of m[1].split(/[/,]/)) {
      const el = _DMG_TYPE_MAP[part.trim().toLowerCase()];
      if (el && el !== 'Special') set.add(el);
    }
  }
  return [...set].sort();
}

/** Re-type generic `Special` damage entries to the shortHelp's primary element.
 *  No-op when the element can't be resolved or is itself Special. Pure helper —
 *  callers gate on dataset (Thunderspy) so HC/Rebirth real-Special damage is
 *  never touched. */
function applyThunderspyDamageType(damage, shortHelp) {
  const t = _damageTypeFromShortHelp(shortHelp);
  if (!t || t === 'Special' || !damage) return damage;
  const fix = (e) => (e && e.type === 'Special' ? { ...e, type: t } : e);
  return Array.isArray(damage) ? damage.map(fix) : fix(damage);
}

// Foe/location target types where a positive caster resource SELF-buff can't be real.
const TSPY_FOE_TARGETS = new Set(['Foe', 'Location', 'DeadFoe']);
// `targets_affected` entries that mean "only the caster's henchmen" — never the
// caster. When every affected target is a pet, a caster-facing resource buff on the
// power is really a PET buff whose per-template target the binary dropped.
const TSPY_PET_TARGETS = new Set(['MyPet']);

// Foe-facing recipients for the applied-mez target-trap guard. Thunderspy's schema
// drops the per-template target, so an applied mez/KB whose index the parser recovers
// is routed by the power's `targets_affected` instead (the §7 discipline). Applied
// control is always foe-facing (even PBAoE controls the caster casts on Self —
// Psychic Wail, EMP Pulse, Mud Pots — carry `targets_affected=['Foe']`); a mez/KB on
// a Self/ally-only power is a self-buff whose index merely names a mez (the Incarnate
// `+mez-strength` / Alpha-slot definitions), not an applied effect.
const TSPY_MEZ_FOE_TARGETS = new Set(['Foe', 'DeadFoe', 'DeadOrAliveFoe', 'Any']);
// The applied-control keys the parser recovers from the tspy index array. Dropped by
// guardThunderspyAppliedMez on a power that affects no foe.
const TSPY_APPLIED_MEZ_KEYS = ['hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear', 'knockback', 'knockup'];

/**
 * Disambiguate Thunderspy `Ones`-relabel recoveries (recharge / recovery / regen /
 * endurance) that the binary can't classify on its own.
 *
 * The parser recovers the modified stat from the post-`requires` index array, but
 * Thunderspy's AttribMod schema drops BOTH the effect's **aspect** and its
 * **per-template target** — the two fields HC uses to separate a real caster buff
 * from a resistance or a foe-side effect. Two false-positive classes result, and the
 * only signals that survive into the export are the power's `target_type` and its
 * resolved shortHelp:
 *
 *  - **Aspect-trap (recharge).** A `Ones` "resistance to recharge slow" template
 *    (Grant Cover's +RES Recharge Debuff, the Kheldian Absorption/Incandescence
 *    passives, Cosmic/Dark Balance's slow-resist, plus stray placeholder templates
 *    like Boost Range / Temporal Manipulator) is byte-identical to a real +recharge
 *    buff once the aspect is gone. Every genuine +recharge power advertises it in
 *    shortHelp ("+Recharge"/"+Rech"); none of the resistance/placeholder ones do — so
 *    keep a recovered recharge BUFF only when the shortHelp advertises it. Recharge
 *    DEBUFFS (foe -recharge) are unaffected: sign/`*_Slow` table already routes them.
 *  - **Target-trap (recovery/regen).** A positive Recovery/Regeneration template on a
 *    FOE attack (Disrupting Torrent, Touch of Fear) reads as a caster self-buff. Drop
 *    those on foe/location-targeted powers. Endurance is intentionally exempt — a foe
 *    Electric attack's +Endurance IS a genuine self end-gain (drain-to-self), matching
 *    the HC data.
 *  - **Pet target-trap (recovery/regen/endurance/defense).** The Mastermind pet-upgrade
 *    powers are auto-pulse PBAoEs the MM casts on Self (`target_type='Self'`) but whose
 *    effects land on the henchmen: the binary flags this with `targets_affected=['MyPet']`.
 *    Every one carries an identical, unadvertised `Recovery` 0.15 / 240s template that,
 *    with its per-template target dropped, reads as a caster self-buff and leaks +15%
 *    Recovery into the MM's totals; Fortify Pack likewise leaks a pet +Defense/+Regen,
 *    and the `MyPet`-cast pet buffs (Repair, Serum) are excluded twice: the totals' ally
 *    filter sees their mapped targetType, and this guard drops them. When EVERY affected target is
 *    a pet, drop the caster-facing recovery/regen/endurance/defense — BUT shortHelp-aware,
 *    because `targets_affected` under-reports: Rally the Militia is `['MyPet']` yet its
 *    shortHelp is "Self, Pets +Defense, +Regeneration" — it genuinely buffs the MM too, so
 *    a stat advertised for Self survives (mirrors the Touch-of-the-Beyond foe exception).
 *
 * Thunderspy-only; callers gate on datasetId. Part of the Thunderspy parser/converter
 * recovery work tracked as TSPY-3 in docs/DATA-GAP-REGISTER.md (the referenced
 * parser_logs/THUNDERSPY_TODO.md no longer exists in this repo).
 */

/**
 * Slots whose target-trap drop must ALSO be recorded on the emitted atoms, and the
 * atom predicate identifying the atoms behind each. Plan B's atom-native resource
 * appliers (`regenBuffValue` / `recoveryBuffValue`) read the atom list, not the
 * bag, so a slot deleted here would otherwise silently reappear in their totals.
 *
 * `ignoreStrength: false` matters: the guard drops only `regenBuff`/`recoveryBuff`,
 * never the `*Unenhanced` twins, so a trapped power keeping an IgnoreStrength half
 * must keep the atom behind it too.
 *
 * Only regen/recovery are listed. The guard also drops `rechargeBuff`,
 * `enduranceGain` and `defenseBuff`, but no atom-native applier reads those from a
 * trapped power today (defense migrated in Slice 4 and its shadow is green — the
 * pet-only `defenseBuff` drops reconstruct to nothing on the atom side). Adding a
 * slot here is the required step when one of those migrates.
 */
const NOT_ON_CASTER_SLOTS = {
  regenBuff: { effectType: 'Regeneration', ignoreStrength: false },
  recoveryBuff: { effectType: 'Recovery', ignoreStrength: false },
};

/**
 * Mark the emitted atoms behind a target-trapped slot `notOnCaster`, so the
 * atom-native appliers exclude them from the CASTER's totals exactly as the bag's
 * deletion does. See `AtomicEffect.notOnCaster` for why this is a converter verdict
 * and not a runtime re-derivation (it keys on shortHelp text + `targets_affected`,
 * neither of which is on the wire, and the trapped atoms are byte-identical to the
 * legitimate Target-recovery buffs the bag keeps).
 *
 * Runs POST-emit — `power.atoms` is already the encoded tuple list at this point —
 * so it patches tuples in place by schema field index rather than re-encoding.
 * Gated atoms are left alone: the trap is about the bag's BASE slot, and the
 * appliers only ever consider base atoms.
 */
function stampNotOnCaster(power, slot) {
  const spec = NOT_ON_CASTER_SLOTS[slot];
  if (!spec || !power.atoms) return;
  power.atoms = power.atoms.map((t) => {
    if (_atomField(t, 'gated') === true) return t;
    if (_atomField(t, 'effectType') !== spec.effectType) return t;
    if (!!_atomField(t, 'ignoreStrength') !== spec.ignoreStrength) return t;
    return _withAtomField(t, 'notOnCaster', true);
  });
}
function guardThunderspyOnesBuffs(power, targetsAffected) {
  const e = power.effects;
  if (!e) return;
  let changed = false;
  const drop = (k) => {
    if (e[k] !== undefined) {
      delete e[k];
      if (e.durations) delete e.durations[k];
      stampNotOnCaster(power, k);
      changed = true;
    }
  };

  const sh = power.shortHelp || '';
  if (e.rechargeBuff && !/\+\s*rech/i.test(sh)) drop('rechargeBuff');
  // Resource target-trap, but shortHelp-aware so a genuine self-buff-on-a-foe-attack
  // survives: Touch of the Beyond (a foe fear attack) explicitly advertises
  // "Self +Regeneration", so its regenBuff is real even though the power targets a foe.
  // Only Disrupting Torrent / Dark-Melee Touch of Fear (foe, no self-buff advertised)
  // are the phantom cases. `+Rec\b`/`+Recovery` matches recovery without catching
  // `+Recharge`; `+Regen(eration)` matches regen.
  if (TSPY_FOE_TARGETS.has(power.targetType)) {
    if (e.recoveryBuff && !/\+\s*rec(?:overy|\b)/i.test(sh)) drop('recoveryBuff');
    if (e.regenBuff && !/\+\s*regen/i.test(sh)) drop('regenBuff');
  }
  // Pet target-trap: effects on a pet-only power buff the henchmen, not the MM — unless
  // the shortHelp advertises the caster (`Self`) as a beneficiary of that same stat, in
  // which case `targets_affected` merely under-reports (Rally the Militia buffs Self+Pets).
  const ta = targetsAffected || [];
  const petOnly = ta.length > 0 && ta.every((t) => TSPY_PET_TARGETS.has(t));
  if (petOnly) {
    const hasSelf = /\bself\b/i.test(sh);
    if (e.recoveryBuff && !(hasSelf && /\+\s*rec(?:overy|\b)/i.test(sh))) drop('recoveryBuff');
    if (e.regenBuff && !(hasSelf && /\+\s*regen/i.test(sh))) drop('regenBuff');
    if (e.enduranceGain && !(hasSelf && /\+\s*end/i.test(sh))) drop('enduranceGain');
    if (e.defenseBuff && !(hasSelf && /\+\s*def/i.test(sh))) drop('defenseBuff');
  }

  if (!changed) return;
  // Re-derive the perma `buffDuration` from whatever durations survive, so a removed
  // effect can't leave a stale Track duration behind (mirrors the main derivation).
  if (e.durations && Object.keys(e.durations).length) {
    const counts = {};
    for (const d of Object.values(e.durations)) counts[d] = (counts[d] || 0) + 1;
    let best = null, bestCount = 0;
    for (const [d, c] of Object.entries(counts)) {
      const v = parseFloat(d);
      if (c > bestCount || (c === bestCount && v > (best || 0))) { best = v; bestCount = c; }
    }
    if (best && best > 0) e.buffDuration = best; else delete e.buffDuration;
  } else {
    if (e.durations) delete e.durations;
    delete e.buffDuration;
  }
}

/**
 * Veto the Thunderspy applied-mez / offensive-KB target-trap.
 *
 * The parser recovers the APPLIED mez/knockback attrib from the post-`requires`
 * index array (the front string is only the enhancement/duration category), but
 * this schema drops the per-template TARGET — so a Self/ally-only power whose index
 * happens to name a mez (the Incarnate `+mez-strength` Hybrid buffs, the Alpha-slot
 * `Hold`/`Immobilize` enhancement definitions) is byte-indistinguishable from a real
 * applied hold once recovered. `targets_affected` is the surviving discriminator: a
 * genuine control always affects a foe (even a PBAoE nuke the caster casts on Self —
 * Psychic Wail, EMP Pulse — lists `Foe`), while the self-buff traps affect only
 * `Self`/`Leaguemate`. Drop the recovered control keys when the power affects no foe.
 *
 * EXCEPT mez PROTECTION, which shares those bag keys and is also foe-less by
 * definition. A NEGATIVE-magnitude mez at aspect=Current is a protection magnitude,
 * not applied control (the same discriminator the ally-aura branch of
 * `classifyPseudoPetTemplate` uses — applied control is always positive), so the
 * recovered attrib IS the real one there and there is nothing to veto. Recipient is
 * not part of the test: the ally-cast protections (Clear Mind, Thaw, Increase
 * Density) carry `toWho: Target`, and a self armor carries `Self`. Blanket-dropping
 * these cost every Thunderspy armor and ally mez-shield its status protection —
 * Fortification's four −24 `Melee_Res_Boolean` mods are byte-identical to the
 * Rebirth twin's, whose bag keeps hold/sleep/stun/immobilize.
 * Reads `power.atoms`, already encoded by the time this runs.
 *
 * Thunderspy-only; caller gates on datasetId. Part of the Thunderspy parser/converter
 * recovery work tracked as TSPY-3 in docs/DATA-GAP-REGISTER.md (the referenced
 * parser_logs/THUNDERSPY_TODO.md no longer exists in this repo).
 */
function protectionBackedMezKeys(atoms) {
  const keys = new Set();
  for (const t of atoms || []) {
    if (t[0] !== 'Mez') continue;
    if (!(t[2] < 0)) continue;
    if ((t[6] || '').toLowerCase() !== 'cur') continue;
    const sub = (t[1] || '').toLowerCase();
    const key = MEZ_TYPES[sub] || KNOCKBACK_TYPES[sub];
    if (key) keys.add(key);
  }
  return keys;
}

function guardThunderspyAppliedMez(power, targetsAffected) {
  const e = power.effects;
  if (!e) return;
  const ta = targetsAffected || [];
  // Empty/unknown recipient list → keep (the vast majority of mez is foe control;
  // only an explicit non-foe list marks a trap).
  if (ta.length === 0) return;
  if (ta.some((t) => TSPY_MEZ_FOE_TARGETS.has(t))) return;
  const protection = protectionBackedMezKeys(power.atoms);
  let changed = false;
  for (const k of TSPY_APPLIED_MEZ_KEYS) {
    if (protection.has(k)) continue;
    if (e[k] !== undefined) {
      delete e[k];
      if (e.durations) delete e.durations[k];
      changed = true;
    }
  }
  if (!changed) return;
  // A dropped mez leaves behind the effectDuration / durations / buffDuration it
  // seeded (Power Boost / Build Up have no other captured effect). Clean the empty
  // durations map, and if only duration/stacking metadata remains, drop the now-
  // hollow effects object — mirrors the Swap-Ammo META_ONLY cleanup below.
  if (e.durations && Object.keys(e.durations).length === 0) delete e.durations;
  const META_ONLY = new Set(['durations', 'buffDuration', 'effectDuration', 'maxStacks', 'stacksLinear']);
  if (Object.keys(e).every((k) => META_ONLY.has(k))) delete power.effects;
}

// ---------------------------------------------------------------------------
// GlobalStrengthsDisallowed enrichment (HC only).
//
// The i24 parse table has no GlobalStrengthsDisallowed — it is an HC addition
// with no counterpart in the client bin, so the `raw defs/` .powers oracle is
// the only source. Its sibling StrengthsDisallowed IS serialized (the bin
// parser reads it into `strengths_disallowed`, and 966 powers carry it in both
// places with byte-identical values), so that half comes from the export
// instead — which is what gives Rebirth its 1,970 entries and stays current
// across HC reworks the dev drop predates.
//
// Semantics (calc-relevant, esp. kRechargeTime on T9 armors / Rune of
// Protection / MM summons):
//  - StrengthsDisallowed: NO strength applies to that attribute of this power —
//    neither slotted enhancement nor global buffs (Hasten, set bonuses).
//  - GlobalStrengthsDisallowed: only GLOBAL strength is ignored; slotted
//    enhancement still applies (Kuji-In Rin).
let _strengthsDisallowedIndex = null;
function getStrengthsDisallowedIndex() {
  if (_strengthsDisallowedIndex) return _strengthsDisallowedIndex;
  const idx = new Map();
  const rawDefsRoot = path.join(__dirname, '../raw defs');
  if (datasetId !== 'homecoming' || !fs.existsSync(rawDefsRoot)) {
    _strengthsDisallowedIndex = idx;
    return idx;
  }
  const stripK = (tok) => (tok.startsWith('k') ? tok.slice(1) : tok);
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.powers')) continue;
      const txt = fs.readFileSync(p, 'utf8');
      if (!txt.includes('StrengthsDisallowed')) continue;
      const nameM = txt.match(/^Power\s+(\S+)/m);
      if (!nameM) continue;
      const entry = { strengths: [], global: [] };
      for (const m of txt.matchAll(/^\s*(Global)?StrengthsDisallowed\s+(.+?)\s*$/gm)) {
        const list = m[2].split(/[\s,]+/).filter(Boolean).map(stripK);
        (m[1] ? entry.global : entry.strengths).push(...list);
      }
      if (entry.strengths.length || entry.global.length) {
        idx.set(nameM[1].toLowerCase(), entry);
      }
    }
  };
  walk(rawDefsRoot);
  _strengthsDisallowedIndex = idx;
  return idx;
}

/**
 * Thunderspy drops the per-template `target` (the [[tspy-player-vocab-gap]] schema gap —
 * it also drops `aspect`), so a tspy movement template arrives with `target: ''`. The bag
 * routes movement to the self `movement` slot only when `target === 'Self'`, and the atom
 * bridge's `toWho` comes from the same field — so an empty target means every Thunderspy
 * travel power (Super Speed, Combat Jumping, Hover, Sprint…) contributes +0 movement, in
 * both the bag and the atom paths. The power-level `targets_affected` is the authoritative
 * recipient list (GAME-DATA-PRINCIPLES §7), so resolve the empty target from it here,
 * BEFORE `extractEffects`/`collectAtomTemplates` read it — one fix, both paths.
 *
 * Deliberately narrow: fires ONLY for a movement-attrib template whose target is empty AND
 * whose power is a pure self-buff (`targets_affected === ['Self']`). That covers the 219
 * self-targeted tspy travel/sprint powers without touching the foe-slow (`['Foe']`) or mixed
 * (`['Foe','Self']`) cases, where a per-template self/foe split can't be read from the
 * power-level list and mislabeling a foe slow as a self buff would be worse than the status
 * quo. HC/Rebirth templates carry real targets, so the empty-target guard makes this a
 * no-op there — it needs no dataset flag.
 */
function resolveThunderspyMovementTargets(powerJson) {
  const ta = powerJson.targets_affected;
  if (!Array.isArray(ta) || ta.length !== 1 || ta[0] !== 'Self') return;
  const isMoveAttrib = (a) => MOVEMENT_TYPES[String(a || '').toLowerCase()] !== undefined;
  const walk = (groups) => {
    for (const g of groups || []) {
      for (const t of g.templates || []) {
        if (!t.target && Array.isArray(t.attribs) && t.attribs.some(isMoveAttrib)) {
          t.target = 'Self';
        }
      }
      if (g.child_effects) walk(g.child_effects);
    }
  };
  walk(powerJson.effects);
}

function convertPower(powerJson, availableLevel, archetypeId, powerType) {
  // Thunderspy movement target-trap: resolve empty movement-template targets from
  // targets_affected before any collector reads them (see the helper's docstring).
  resolveThunderspyMovementTargets(powerJson);

  // Map target type to valid TypeScript type (or undefined if unknown)
  const rawTargetType = powerJson.target_type;
  const mappedTargetType = rawTargetType ? TARGET_TYPE_MAP[rawTargetType] : undefined;

  const power = {
    name: DISPLAY_NAME_OVERRIDES[powerJson.name] || displayText(powerJson.display_name) || powerJson.name,
    internalName: powerJson.name,
    available: availableLevel,
    // `description` is required on Power, so an unresolvable help string
    // degrades to empty rather than to a missing field.
    description: (displayText(powerJson.display_help) ?? '').replace(/<[^>]+>/g, '').trim(),
    // An unresolved message-store key is not text — see `_display-text.cjs`.
    // Dropping it shows no tags, which is true; keeping it showed a chip
    // reading "P2937209522" on Mercenaries > Soldiers.
    shortHelp: displayText(powerJson.display_short_help),
    icon: normalizeIconPath(ICON_OVERRIDES[powerJson.icon] || powerJson.icon),
    // Map bin's "GlobalBoost" to the planner's "Global Enhancement" type.
    // Other types (Click/Toggle/Auto) match between bin and planner.
    powerType: powerJson.type === 'GlobalBoost' ? 'Global Enhancement' : powerJson.type,
    targetType: mappedTargetType,
    effectArea: EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area,
  };

  // Cast-through-mez: which mez states this power can still be activated through
  // (Blaster Defiance lets low-tier attacks fire while Held/Slept/Stunned/
  // Terrorized; some click powers are flagged similarly). The bin parser captures
  // it as `cast_through`; surface it for the Info panel. Omit when empty so the
  // vast majority of powers carry nothing.
  if (Array.isArray(powerJson.cast_through) && powerJson.cast_through.length) {
    power.castThroughMez = powerJson.cast_through;
  }

  // Toggle-ignore-mez: mez states that DON'T detoggle this power — the toggle
  // keeps running while you're Held/Slept/Stunned (e.g. mez-protection toggles
  // that must survive the very mez they guard against). Captured by the bin
  // parser as `toggle_ignore`. Omit when empty.
  if (Array.isArray(powerJson.toggle_ignore) && powerJson.toggle_ignore.length) {
    power.toggleIgnoreMez = powerJson.toggle_ignore;
  }

  // StrengthsDisallowed from the bin export (all forks); GlobalStrengthsDisallowed
  // from the `raw defs/` oracle, which is the only source for it (see
  // getStrengthsDisallowedIndex above). Sparse — mostly Range on melee attacks and
  // RechargeTime on fixed-cooldown powers; omit when absent.
  if (Array.isArray(powerJson.strengths_disallowed) && powerJson.strengths_disallowed.length) {
    power.strengthsDisallowed = powerJson.strengths_disallowed;
  }
  if (powerJson.full_name) {
    const sd = getStrengthsDisallowedIndex().get(powerJson.full_name.toLowerCase());
    if (sd && sd.global.length) power.globalStrengthsDisallowed = sd.global;
  }
  // ProcMainTargetOnly — procs roll single-target here regardless of the power's
  // radius. Authored per AT copy, so it must come from the power, not a name.
  // See the field doc on `Power.procsOnlyOnMainTarget`.
  if (powerJson.procs_only_on_main_target) power.procsOnlyOnMainTarget = true;
  // ProcAllowed kNone — no PPM proc ever rolls against this power's recharge.
  // Sparse-false, mirroring how the exporter emits it. See the field doc on
  // `Power.procsAllowed`.
  if (powerJson.procs_allowed === false) power.procsAllowed = false;

  // Chain / target-cap RPN expressions (bin fields 43b / 38 — Electrical Affinity
  // circuits, Chain Lightning, Gauntlet, …). Raw token lists carried through for
  // the Info panel to humanize; sparse (only chain / conditional-cap powers have
  // them), so omit when absent to keep the vast majority of powers untouched.
  //  - chain_target_expression: next-target selection weighting (who the chain
  //    jumps to next — e.g. the most-injured ally for Rejuvenating Circuit).
  //  - max_targets_expression: a computed target cap that overrides the static
  //    `stats.maxTargets` when a condition holds (Static stacks, Gauntlet mode).
  if (powerJson.chain_target_expression) {
    power.chainTargetExpression = powerJson.chain_target_expression;
  }
  if (powerJson.max_targets_expression) {
    power.maxTargetsExpression = powerJson.max_targets_expression;
  }

  // Basic stats
  power.stats = {
    accuracy: powerJson.accuracy,
    range: powerJson.range,
    radius: powerJson.radius,
    arc: powerJson.arc,
    recharge: powerJson.recharge_time,
    endurance: powerJson.endurance_cost,
    castTime: powerJson.activation_time,
    // Interruptible channel (Trip Mine, Rest, Aid Self, rez powers, and the
    // single-form snipes on servers that bake it onto the base power rather
    // than a Normal redirect). 0 for the vast majority; dropped below when 0.
    interruptTime: powerJson.interrupt_time,
    activatePeriod: powerJson.activate_period,
    maxTargets: powerJson.max_targets_hit,
  };

  // Animation root/lock time — only surface when it diverges from castTime
  // (the common case is root == full activation, which tells us nothing new).
  if (powerJson.time_to_root != null && powerJson.time_to_root !== powerJson.activation_time) {
    power.stats.timeToRoot = powerJson.time_to_root;
  }

  // Remove zero/null values
  Object.keys(power.stats).forEach(key => {
    if (!power.stats[key]) delete power.stats[key];
  });

  // Allowed enhancements (always include, even if empty, for type safety).
  // Accept both CoD2's descriptive names (via BOOST_TYPE_MAP) and the
  // bin-crawler's short names (via BIN_BOOST_MAP). Anything else is noise
  // (CoD2 emits origin tags like 'Natural_Boost' for some powers) and
  // gets filtered out.
  power.allowedEnhancements = (powerJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b] || BIN_BOOST_MAP[b])
    .filter(Boolean);

  // Allowed IO set categories. Preferred source: `allowed_set_categories`
  // from the exporter, which reverses boostsets.bin's per-set power lists
  // into the authoritative per-power answer the game itself uses.
  //
  // Strict mode: if the field is present in the JSON (whether as `null`,
  // an empty array, or a non-empty array) we trust it. The game's engine
  // says "no IO sets slot here" for powers like SR Quickness, Lightning
  // Reflexes, and Mental Training that only carry SpeedRunning /
  // SpeedFlying — those still accept single Run Speed / Fly IOs via
  // `allowedEnhancements`, they just don't accept any IO set pieces.
  // Verified against in-game slotting.
  //
  // The exporter emits `null` when no boost set's `allowed_powers` list
  // includes this power, and an array (possibly empty) otherwise. Both
  // null and empty array mean the same thing here: leave
  // `allowedSetCategories` unset on the output. Only fall through to
  // legacy inference when the field is truly `undefined` (old exports
  // predating the boostsets.bin integration).
  if (powerJson.allowed_set_categories !== undefined) {
    if (Array.isArray(powerJson.allowed_set_categories) && powerJson.allowed_set_categories.length > 0) {
      // Strip wrong-archetype ATO categories. The binary in some HC patches
      // and on Rebirth includes the wrong AT's ATO category in the
      // per-power `allowed_set_categories` (e.g. Arachnos Soldier attack
      // powers list "Blaster Archetype Sets" alongside "Soldiers of
      // Arachnos Archetype Sets"). The game doesn't actually let you slot
      // Blaster ATOs into a Crab Spider's gun — boostsets.bin's per-set
      // power list is the truer source for the picker. Filter here so the
      // planner UI matches in-game slottability.
      //
      // The own-category set comes straight from the ATO sets' own
      // allowed_powers lists (multiple own categories are natural: control +
      // damage ATOs, the shared VEAT/Kheldian categories).
      const ownAtos = ownAtoCategories(powerJson.full_name);
      const { allCategories } = getAtoIndex();
      const filtered = powerJson.allowed_set_categories.filter(cat => {
        if (!allCategories.has(cat)) return true; // not an AT ATO at all — keep
        return ownAtos.has(cat); // keep only ATOs whose set actually slots here
      });
      // Datasets whose bin omits per-power ATOs (Thunderspy): supply them from
      // the ATO index. Without this, no Thunderspy power accepts its ATOs
      // (reported for Illusion Control's holds). No-op for HC/Rebirth (flag
      // off — their per-power lists already carry the categories).
      if (BINS_OMIT_PER_POWER_ATOS) {
        filtered.push(...ownAtos);
        // Universal Damage sets slot into ANY damaging power. HC/Rebirth get
        // this from boostsets.bin's ECUniversalDamage set (Overwhelming Force,
        // 1627-power pool). Thunderspy's boostsets.bin ships that set as a
        // broken 3-power placeholder stub (display "SumoBoostName", empty EC),
        // so no Thunderspy power picks up "Universal Damage Sets" from the
        // per-power index. Infer it here from the Damage boost — matching the
        // legacy inference rule in inferAllowedSetCategories.
        if ((powerJson.boosts_allowed || []).includes('Damage')) {
          filtered.push('Universal Damage Sets');
        }
      }
      power.allowedSetCategories = [...new Set(filtered)].sort();
    }
    // else: leave allowedSetCategories unset — no IO sets slot here.
  } else {
    // Legacy inference path. See inferAllowedSetCategories for the table.
    // Special case 1: leap/charge attacks (Savage Leap, Feral Charge,
    // Lightning Rod, etc.) have main effect_area=SingleTarget but deliver
    // damage via an Execute_Power redirect that's actually AoE.
    // Special case 2: location-targeted teleport AoEs (Shield Charge) have
    // effect_area=Location but the player teleports TO the spot and damages
    // foes around the landing point — that's melee delivery, not ranged.
    const redirectArea = inferEffectiveArea(powerJson);
    const hasTeleportAttrib = (powerJson.effects || []).some(eff =>
      (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'teleport')
    );
    const isLocationTeleport = (powerJson.effect_area === 'Location' && hasTeleportAttrib);
    const effectiveArea = redirectArea
      ?? (isLocationTeleport ? 'AoE' : (EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area));
    const boostsForCategory = (redirectArea || isLocationTeleport)
      ? (powerJson.boosts_allowed || []).filter(b => b !== 'Range')
      : (powerJson.boosts_allowed || []);
    const inferred = inferAllowedSetCategories(
      boostsForCategory,
      effectiveArea,
      powerJson.range,
      powerJson.powerset || powerJson.full_name,
      hasTeleportAttrib,
    );
    // AT ATO categories come from the boostsets reverse index, not inference.
    inferred.push(...ownAtoCategories(powerJson.full_name));
    if (inferred.length > 0) {
      power.allowedSetCategories = [...new Set(inferred)].sort();
    }
  }

  // NOTE: Do NOT infer allowedEnhancements from set categories.
  // The raw data's boosts_allowed is the authoritative source.
  // If boosts_allowed is empty, the power genuinely accepts no generic IOs.
  // allowedSetCategories only determines which IO SETS can be slotted.

  // Max slots — if allowedEnhancements is empty, the power accepts no enhancements
  power.maxSlots = (power.allowedEnhancements.length === 0) ? 0 : (powerJson.max_boosts || 6);

  // Extract effects from templates
  // Recursively collect from child_effects AND follow Execute_Power redirects
  // (e.g. Fault → Redirects.Stone_Melee.Fault_Brute / Fault_Cone_Brute, where
  // the actual damage/knockback/stun lives in the redirect targets).
  let { templates: allTemplates, usedInfoRedirect } = collectBaseTemplates(powerJson);

  // Also collect templates from activation_effects. Two distinct patterns share
  // this slot:
  //   1. Continuous self-targeted toggle/auto buffs (Integration +regen,
  //      Reaction Time +recovery) — keep target=Self only, skip IgnoreStrength
  //      duplicates (the enhanceable copy is the unflagged one).
  //   2. Click powers whose effects live entirely behind an ActivationEffect
  //      Execute_Power redirect (Ground Zero → Ground_Zero_Ally + Foe; the
  //      redirect targets emit AnyAffected damage/heal templates). Those need
  //      to bypass the Self filter — the redirect target dictates the target.
  //
  // Regeneration is an exception to the IgnoreStrength filter. Integration's
  // small unenhanceable "ride-along" 0.5-scale regen is a legitimate buff
  // portion that the game lists as a separate Combat Attributes breakdown
  // entry; dropping it makes SK overstate the enhanceable portion by
  // applying Heal enhancement to the unenhanceable scale. Let those through
  // so extractEffects can route them to regenBuffUnenhanced.
  const isDropForActivationEffects = (t) => {
    if (!(t.flags || []).some(f => f.startsWith('IgnoreStrength'))) return false;
    const hasRegen = (t.attribs || []).some(a => a?.toLowerCase() === 'regeneration');
    return !hasRegen;
  };
  if (powerJson.activation_effects?.length) {
    // Direct templates from activation_effects (no redirect traversal).
    const directBuffs = collectAllTemplates(powerJson.activation_effects)
      .filter(t => t.target === 'Self' && !isDropForActivationEffects(t));
    if (directBuffs.length > 0) {
      allTemplates = allTemplates.concat(directBuffs);
    }
    // Templates surfaced by following Execute_Power redirects within
    // activation_effects. Exclude anything that already came in via the
    // directBuffs pass (matched on identity since both pulls share array refs).
    const directSet = new Set(directBuffs);
    const redirected = collectTemplatesDeep(powerJson.activation_effects)
      .filter(t => !directSet.has(t) && !isDropForActivationEffects(t));
    if (redirected.length > 0) {
      allTemplates = allTemplates.concat(redirected);
    }
  }

  if (allTemplates.length > 0) {
    let damage = extractDamage(allTemplates, powerJson);
    // The `*_Info` display power explicitly declares the power's damage types, so
    // trust it — don't run it through the Fiery-Embrace-bonus heuristic, which
    // would wrongly strip Remote Bomb's genuine base Fire damage as an FE bonus.
    if (!usedInfoRedirect) damage = _filterFieryEmbraceBonus(damage, powerJson);
    if (damage) power.damage = damage;
    // Assassin's Strike: damage is kMeter-branched in the redirect (skipped
    // above), so the normal path finds none. Pull the not-hidden base directly.
    // Assassin's Strike: pull the not-hidden base when the kMeter branch was
    // skipped (energy-melee shape) AND the data-driven from-Hide multiplier
    // (which replaces the generic +100% crit from Hide). Some sets surface the
    // base via the normal path (sonic-melee shape) yet still need the bonus, so
    // run this regardless of whether power.damage is already set — it's a no-op
    // for anything that isn't a kMeter-redirect AS.
    {
      const as = extractAssassinStrikeDamage(powerJson);
      if (as) {
        if (!power.damage && as.damage) power.damage = as.damage;
        if (as.fromHideBonus != null) power.fromHideBonus = as.fromHideBonus;
        // The fast mid-combat (Quick) cast — the attack-chain builder uses it as
        // the default form, with the slow base cast reserved for the from-Hide
        // (opener / post-Placate) form. Only present on the HC two-redirect AS.
        const fastCast = extractAssassinStrikeFastCast(powerJson);
        if (fastCast != null) power.midCombatCast = fastCast;
      }
    }

    const effects = extractEffects(allTemplates, powerJson.name);

    // Detect per-target stacking (Stack/Continuous/RefreshToCount templates,
    // Execute_Power redirects). For redirect-only powers (Consume/Devour Psyche:
    // empty base effects + an "Always" redirect to Redirects.Psionic_Armor.*),
    // the base powerJson carries no templates — feed the resolved redirect JSON
    // instead so its self-buff stacking is seen (it also carries the AoE
    // geometry — effect_area/max_targets/targets_affected — the detector reads).
    let stackingSource = powerJson;
    if ((!powerJson.effects || powerJson.effects.length === 0) && powerJson.redirect?.length) {
      const redirectJson = loadDefaultRedirectJson(powerJson);
      // Only reach into the redirect when it carries a self RefreshToCount buff —
      // the accumulate-per-foe mechanic the base-effects detector can't see
      // (Consume/Devour Psyche's +Regen/+Recovery ×10). Redirects whose self-
      // buffs are plain Stack/Replace were already invisible to stacking
      // detection; keep them that way rather than newly surfacing the AoE
      // per-target heuristic on rez/utility redirects — a fixed self-restore in
      // a foe-AoE (Memento Mori's +30 End rez) is NOT genuinely per-foe.
      if (redirectJson?.effects?.length && redirectHasSelfRefreshStacking(redirectJson)) {
        stackingSource = redirectJson;
      }
    }
    const stackingResult = detectStackingEffects(stackingSource);
    if (stackingResult) {
      // Same `*Unenhanced` remap the conditional path does: an IgnoreStrength
      // template routes its base value to `<slot>Unenhanced`, so its per-target
      // increment must land there too. Without it the patch MINTS an empty
      // enhanceable twin and the one template reads as two buffs (Thunderspy
      // Invincibility, whose +ToHit carries IgnoreStrength where HC's does not).
      _remapUnenhancedPatchKeys(stackingResult.patches || {}, effects);
      mergeStackingPatches(effects, stackingResult);
      // Stamp the redirect-derived per-target increment onto the matching emitted
      // atoms (allTemplates). The redirect chain's own template objects (seen by
      // detectStackingEffects) are parsed separately and are NOT these, so the
      // AoE-path `_perTargetIncrement` stamp couldn't reach them — match by
      // (|scale|, table). Only the increment (KineticTransferBuff scale-2) matches;
      // the base one-shot (KineticTransferBuffSelf scale-4) has a different scale
      // and stays base, so `damageBuffValue` reads Fulcrum Shift as {4, perTarget:2}.
      //
      // The AoE-path signatures are replayed the same way, but ONLY when the
      // detector ran over a redirect (`stackingSource !== powerJson`) — Consume /
      // Devour Psyche, whose +Regen/+Recovery RefreshToCount ×10 increment lives
      // entirely in `Redirects.Psionic_Armor.*`. On the normal path the AoE
      // stamp already landed on these very template objects, so replaying by
      // signature would only risk stamping an unrelated same-(scale,table)
      // template that is not an increment at all.
      const sigs = [
        ...(stackingResult.redirectPerTargetSigs || []),
        ...(stackingSource !== powerJson ? stackingResult.aoePerTargetSigs || [] : []),
      ];
      for (const sig of sigs) {
        for (const t of allTemplates) {
          if (t._perTargetIncrement) continue;
          if (Math.abs(t.scale || 0) === sig.scale && t.table === sig.table) {
            t._perTargetIncrement = sig.scale;
          }
        }
      }
    }

    if (Object.keys(effects).length) power.effects = effects;

    // Resolve location pseudo-pet redirect lists into synthesized ability lists
    // (Storm Cell, Category Five, Freezing Rain, …) so the runtime can surface
    // their DoT + debuffs. See PSEUDO-PET-POWER-RESOLUTION.md.
    attachResolvedPseudoPets(powerJson, power.effects);

  }

  // Atom emit — deliberately OUTSIDE the `allTemplates.length` guard above.
  //
  // `allTemplates` is the BAG's view. Gating the atom list on it means "a power gets
  // atoms only if the bag found something," which is backwards: the atom list exists
  // precisely to carry what the bag cannot. A power whose every effect group is gated
  // (all 16 Mastermind upgrade powers — Equip Robot, Train Beasts, Enchant Undead… —
  // plus Heat Loss) has ZERO base templates but a full set of gated ones, and shipped
  // with no atoms at all until 2026-07-15. Same family as the pool/epic gap: the bag
  // fallback made it behavior-preserving and therefore invisible.
  //
  // Guard on `atomTemplates` instead. When `allTemplates` is empty the base set is
  // empty, so every atom stamps `gated: true` and `baseAtoms` stays empty — appliers
  // see exactly what they saw before. The hard invariant inside `encodeAtomsForEmit`
  // (unstamped count === templatesToAtoms(allTemplates).length) enforces that.
  //
  // Union of two sources (both collectors push the same template objects, so `Set`
  // identity is exact):
  //
  //   1. `allTemplates` — everything the bag saw. Not just `powerJson.effects`: a
  //      power's templates may come from a redirect chain (Fault), an `_Info` display
  //      power (Remote Bomb), or `activation_effects` (Dull Pain, whose `effects` is
  //      empty). Dropping this source silently emptied the atom list for every such
  //      power.
  //   2. `collectAtomTemplates(powerJson.effects)` — adds back the gated groups the
  //      bag's collector drops (mode/stance, PvP, hidden-state, chance-0 procs)
  //      because a single-valued slot cannot hold both the base and the gated variant.
  //      The atom list can, and each atom carries its own gate. This is what gives the
  //      conditional/stance bags their atoms.
  //
  // Atoms from source 2 that source 1 didn't already have are the gated ones;
  // `encodeAtomsForEmit` stamps them `gated: true` off this base set, so a consumer can
  // recover the bag's exact base view (`baseAtoms`) or the full truth, without
  // re-deriving the collector's filter at runtime.
  //
  // Known residual: gated groups nested inside a REDIRECT chain or under
  // `activation_effects` are still not collected — source 2 only descends the power's
  // own `effects`. Those paths apply their own modeling filters (the
  // activation_effects Self / IgnoreStrength-dupe rules) that are not safe to bypass
  // wholesale here.
  {
    const atomTemplates = [...new Set([
      ...allTemplates,
      ...collectAtomTemplates(powerJson.effects || []),
    ])];
    if (atomTemplates.length > 0) {
      // The base-set hard invariant is asserted inside `encodeAtomsForEmit`.
      const atoms = encodeAtomsForEmit(atomTemplates, allTemplates, powerJson.name);
      if (atoms) power.atoms = atoms;
    }
  }

  // Multi-pet summon count correction (Phantom Army FX double-count → 3; Gang War
  // dropped + pose-collapse/chance-weight → 9). Runs OUTSIDE the allTemplates
  // guard above because Gang War's summon templates are dropped by the
  // activation_effects buff filter, leaving allTemplates empty — the corrected
  // summon is rebuilt directly from powerJson. See HOMECOMING_PARSER.
  {
    const eff = power.effects || {};
    normalizeSummonEntities(powerJson, eff);
    // Merge a P-hash entity that resolves (via its priority_list) to one of its
    // named siblings — Fire Imps' first imp, Gremlins' first gremlin. See fn doc.
    resolvePhashSiblings(powerJson, eff);
    // Surface a tier-conditional summon the gate filter dropped (Soul Extraction
    // → one Ghost, tier matches the sacrificed henchman). See fn doc.
    rebuildTierConditionalSummon(powerJson, eff);
    if (eff.summon && !power.effects) power.effects = eff;
  }

  // Conditional bonus effects (Mechanic Adjusters). These are positive state
  // gates the base collectors silently filtered out (drowning bonus, Domination
  // boost, Disintegration bonus damage, etc.). Each emits a toggle in the
  // InfoPanel that adds its damage/effects on top of the base when active.
  if (powerJson.effects?.length) {
    const conditional = extractConditionalEffects(powerJson.effects, powerJson);
    if (conditional) power.conditionalEffects = conditional;

    // Special effects (chance procs / state grants) for the SPECIAL section.
    // Pass the conditional list so grant procs can use a recognized label
    // rather than a generic "trigger".
    const special = extractSpecialEffects(powerJson.effects, conditional);
    if (special) power.specialEffects = special;

    // Damage delivered via a `Grant_Power → Temporary_Powers` hop (Molten
    // Embrace's Fire DoT, Hidden Flame, Envenomed Blades, …) — the granted
    // proc's damage is invisible inline, so resolve it from the exported grant
    // target and surface it on the power.
    const granted = resolveGrantedDamageProcs(powerJson);
    if (granted) power.grantedDamageProcs = granted;
  }

  // Storm Cell's powered-up state lives on the pseudo-pet (resolvedEntities), not
  // the parent's gated effects, so it doesn't generate the "Storm Cell Active"
  // conditional from its own predicate. Surface the shared GLOBAL toggle here so
  // the InfoPanel can drive the High Winds display (WindSpeed debuffs + lightning).
  // Gate on a `poweredUpEffects` ability — that WindSpeed link is unique to Storm
  // Cell, so Category Five (always at max strength) and other gated pseudo-pets
  // (Tide Pool) don't get a mislabeled toggle.
  const resolvedEnts = power.effects?.summon?.resolvedEntities;
  if (resolvedEnts && resolvedEnts.some(ent => ent.abilities.some(a => a.poweredUpEffects))) {
    const exists = (power.conditionalEffects || []).some(c => c.id === 'stormblast_instormcell');
    if (!exists) {
      power.conditionalEffects = [
        ...(power.conditionalEffects || []),
        { id: 'stormblast_instormcell', label: 'Storm Cell Active', scope: 'global', defaultActive: false },
      ];
    }
  }

  // Conditional summon entities (Oil Slick Arrow's ignited burn patch) — surface
  // a per-power toggle so the InfoPanel can fold the triggered entity's damage in.
  for (const ce of power.effects?.summon?.conditionalEntities ?? []) {
    const exists = (power.conditionalEffects || []).some(c => c.id === ce.toggleId);
    if (!exists) {
      power.conditionalEffects = [
        ...(power.conditionalEffects || []),
        { id: ce.toggleId, label: ce.label, scope: 'per-power', defaultActive: false },
      ];
    }
  }

  // Dual Pistols Swap Ammo: pull the per-ammo secondary effects out of base into
  // mutually-exclusive `swap-ammo` conditionals (only one ammo loaded at a time).
  const ammo = extractDualPistolsAmmo(powerJson, power.effects);
  if (ammo) {
    if (power.effects) {
      for (const key of ammo.baseKeysToRemove) {
        delete power.effects[key];
        if (power.effects.durations) delete power.effects.durations[key];
      }
      if (power.effects.durations && Object.keys(power.effects.durations).length === 0) {
        delete power.effects.durations;
      }
      // If only duration/stacking metadata remains (the real effects all moved
      // to ammo conditionals), drop the now-meaningless base effects object.
      const META_ONLY = new Set(['durations', 'buffDuration', 'effectDuration', 'maxStacks', 'stacksLinear']);
      if (Object.keys(power.effects).every((k) => META_ONLY.has(k))) delete power.effects;
    }
    power.conditionalEffects = [...(power.conditionalEffects || []), ...ammo.conditionals];
  }

  // Snipe powers ship two redirect targets — Normal (charged, slower cast,
  // higher damage; the one collectRedirectTemplates already extracted) and
  // Quick (instant-cast variant fired in combat or with the Marksman buff).
  // Pull the Quick variant's damage and cast stats into power.quickSnipe so
  // the In-Combat toggle can swap in the fast-snipe values at display time.
  const quickSnipe = extractQuickSnipeData(powerJson);
  if (quickSnipe) {
    power.quickSnipe = quickSnipe;
    // The slotted snipe's base cast/interrupt is the Normal (charged) variant's,
    // not the redirect shell's (which mirrors the Quick anim). Source it so a
    // not-in-combat snipe shows its true interruptible cast (~3.67s) instead of
    // looking instant — the In-Combat toggle then swaps in quickSnipe's 1.67s.
    const base = extractSnipeBaseTiming(powerJson);
    if (base?.castTime != null) power.stats.castTime = base.castTime;
    if (base?.interruptTime != null) power.stats.interruptTime = base.interruptTime;
    if (base?.timeToRoot != null) power.stats.timeToRoot = base.timeToRoot;
    else delete power.stats.timeToRoot; // base overrides the shell's castTime; a stale root value from the (unread) shell would mismatch it
  }

  // Mode-gated redirect variants (Kheldian forms, Primalist forms, Titan Momentum, Seismic
  // Power): what this power becomes while a caster mode is live. See extractModeVariants.
  const modeVariants = extractModeVariants(powerJson, archetypeId, powerType);
  if (modeVariants) {
    power.modeVariants = modeVariants;
  }

  // Requirements
  if (powerJson.requires) {
    power.requires = powerJson.requires;
  }

  // Game "modes" (combat states: Kheldian Nova/Dwarf forms, Titan Momentum,
  // Domination, Granite, Swap-Ammo, travel toggles). The exporter resolves the
  // per-server mode registry from attrib_names.bin and stamps three power-level
  // arrays plus a `mode_name` on each Set_Mode template. We surface a lean slice:
  //   - setsModes:     modes this power ACTIVATES (from Set_Mode `mode_name`) —
  //                    the calc uses these to know which modes are live.
  //   - modesSuspended: modes that SUSPEND this power's own effects (Granite
  //                    suspends the other Stone toggles; forms suspend human
  //                    toggles) — the calc drops the effect contribution when a
  //                    live mode intersects.
  //   - modesRequired:  modes the power needs to be USABLE (FastMode/Momentum,
  //                    Domination, form-gated attacks).
  //   - modesDisallowed: modes that make the power UNCASTABLE. This is the half
  //                    that says a human-form Kheldian attack cannot be used in
  //                    Nova, and it is not derivable from the other three: the
  //                    tier-one attacks are absent from it for the ONE form they
  //                    have a `modeVariants` redirect into, which is exactly how
  //                    the binary distinguishes "disabled in this form" from
  //                    "becomes the form's version" (Gleaming Bolt disallows
  //                    Nova and redirects under Dwarf; Glinting Eye the reverse).
  //                    It was dropped on the grounds of being "~5.8k files of
  //                    pure Disable_All noise" — true of the bulk, but the
  //                    remainder carries the four Kheldian form modes across
  //                    ~500 powers including the pools.
  // `Disable_All` (ubiquitous) and `ServerTrayOverride` (mode index 0 — the
  // system tray slot, no gameplay meaning) are stripped everywhere.
  assignModes(power, powerJson);

  // Mechanic power type detection
  const showInManage = powerJson.show_in_manage !== false; // defaults to true
  const maxBoosts = powerJson.max_boosts || 0;
  const autoIssue = powerJson.auto_issue === true;
  const showInInventory = powerJson.show_in_inventory || 'Show';
  const showInInfo = powerJson.show_in_info !== false; // defaults to true

  if (!showInManage && maxBoosts === 0) {
    if (autoIssue && availableLevel === -1) {
      power.mechanicType = 'childToggle';
    } else if (showInInventory === 'Never' && !showInInfo) {
      power.mechanicType = 'hiddenAuto';
    } else {
      power.mechanicType = 'hiddenPassive';
    }
  } else if (maxBoosts === 0 && availableLevel >= 0 && (!showInManage || powerJson.type === 'Auto')) {
    power.mechanicType = 'parentMechanic';
  }

  // Thunderspy: recover the real damage element from the shortHelp (the binary
  // only carries a generic `Damage` attrib → extractDamage typed it `Special`).
  if (datasetId === 'thunderspy') {
    if (power.damage) power.damage = applyThunderspyDamageType(power.damage, power.shortHelp);
    for (const ce of power.conditionalEffects || []) {
      if (ce.damage) ce.damage = applyThunderspyDamageType(ce.damage, power.shortHelp);
    }
    // Chip source for Thunderspy only — its damage atoms are `Unmapped`, so the
    // planner cannot derive the type set from them (HC/Rebirth do). Power-level
    // set, never stamped onto atoms. Omit when empty (non-damage powers).
    const damageTypes = damageTypeSetFromPower(powerJson);
    if (damageTypes.length) power.damageTypes = damageTypes;
    guardThunderspyOnesBuffs(power, powerJson.targets_affected);
    guardThunderspyAppliedMez(power, powerJson.targets_affected);
  }

  return power;
}

/**
 * Convert an entire powerset
 */
function convertPowerset(category, powersetName) {
  const categoryInfo = CATEGORY_MAP[category];
  if (!categoryInfo) {
    console.error(`Unknown category: ${category}`);
    console.log('Available categories:', Object.keys(CATEGORY_MAP).join(', '));
    process.exit(1);
  }

  const rawPath = path.join(RAW_DATA_PATH, category, powersetName);
  const indexPath = path.join(rawPath, 'index.json');

  if (!fs.existsSync(indexPath)) {
    console.error(`Powerset not found: ${rawPath}`);
    process.exit(1);
  }

  const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Compatibility shim: bin-crawler export uses `powers` + `help` where CoD2
  // used `power_names` + `display_help`. Normalize to the CoD2-style names the
  // rest of this script expects so we don't have to rewrite every usage.
  if (!indexJson.power_names && indexJson.powers) indexJson.power_names = indexJson.powers;
  if (!indexJson.display_help && indexJson.help) indexJson.display_help = indexJson.help;
  if (!indexJson.display_short_help && indexJson.short_help) indexJson.display_short_help = indexJson.short_help;

  // Three parallel output directories — see src/data/README.md for the layering.
  const relPath = path.join(
    categoryInfo.archetype,
    categoryInfo.type,
    toKebabCase(indexJson.display_name),
  );
  const generatedDir = path.join(OUTPUT_GENERATED_PATH, relPath);
  const overridesDir = path.join(OUTPUT_OVERRIDES_PATH, relPath);
  const composedDir = path.join(OUTPUT_PATH, relPath);

  for (const d of [generatedDir, overridesDir, composedDir]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  console.log(`Converting ${indexJson.display_name} to ${composedDir}`);

  // Convert each power
  const powers = [];
  const powerFiles = fs.readdirSync(rawPath).filter(f => f.endsWith('.json') && f !== 'index.json');

  for (const file of powerFiles) {
    const powerJson = JSON.parse(fs.readFileSync(path.join(rawPath, file), 'utf-8'));

    // Skip GlobalBoost powers — these are hidden, auto-issued global-enhancement
    // procs (the engine fires them automatically; the player never picks them).
    // They share their parent's display name (e.g. Build_Up_Proc → "Reach for the
    // Limit"), so emitting them as powerset powers creates a duplicate that
    // becomes pickable once the real power satisfies the proc's `requires`.
    if (powerJson.type === 'GlobalBoost') {
      continue;
    }

    // Find the available level for this power. The bin-export `powers` array
    // is alphabetical (CoD2's `power_names` was game-pick order), so we use
    // available_level as the canonical sort key — matches in-game pick order.
    // Match on the exact last dotted segment — plain `endsWith` on the
    // full name would mis-match siblings like Power_Bolt vs Focused_Power_Bolt.
    const targetName = powerJson.name.toLowerCase();
    const powerIndex = indexJson.power_names.findIndex(n => {
      const leaf = n.split('.').pop().toLowerCase();
      return leaf === targetName;
    });
    // Corpus-unreachable (27,312/27,312 powers hit the index, censused 2026-07-19):
    // a miss means a broken export or a name-matching regression, and the old
    // silent fallback (availableLevel 0, sort key 999) shipped a plausible-wrong
    // pick order as authoritative. Fail the conversion instead.
    if (powerIndex < 0) {
      throw new Error(
        `${category}/${powersetName}: power ${powerJson.name} (${file}) is not in the powerset index's power_names — cannot derive available_level`,
      );
    }
    let availableLevel = indexJson.available_level[powerIndex];
    // The bin/pigg source stores the "-1 = auto-granted, not player-pickable"
    // sentinel UNSIGNED, so it arrives as 0xFFFFFFFF (4294967295) — or another
    // high-bit value for -2, etc. Normalize back to a signed negative so the
    // `available < 0` checks (picker filter, mechanicType detection below)
    // recognize granted toggles (ammo, adaptations, Staff forms) again.
    if (availableLevel >= 0x80000000) availableLevel -= 0x100000000;

    const power = convertPower(powerJson, availableLevel, categoryInfo.archetype, categoryInfo.type);
    powers.push({ power, powerIndex, availableLevel, file });
  }

  // Sort by available_level (game pick order). Ties broken by powerIndex so
  // same-level powers (e.g. two level-0 starters) keep a deterministic order
  // matching the bin's input listing.
  powers.sort((a, b) => {
    if (a.availableLevel !== b.availableLevel) return a.availableLevel - b.availableLevel;
    return a.powerIndex - b.powerIndex;
  });

  // Write individual power files into the three layers.
  //   - generated/<power>.ts: always rewritten with the fresh extraction
  //   - overrides/<power>.ts: scaffolded as empty `{}` only if missing
  //   - powersets/<power>.ts: composed export scaffolded only if missing
  // Re-running convert-powerset never clobbers hand-edited overrides/composed.
  for (const { power, file } of powers) {
    const powerFileName = toKebabCase(power.internalName) + '.ts';
    // The exported const identifier is derived from the INTERNAL name (which also
    // names the file), NOT the display name. The display name is mutable (pigg
    // patches, overrides) and can be crossed within a set — e.g. Bio Armor's
    // internal "Adaptation" displays "Evolving Armor" and vice-versa. Tying the
    // module identifier to the volatile display name made the export const flip on
    // every display-name correction, stranding the composed/index imports. Internal
    // names are stable, so file name === export name, forever.
    const exportName = power.internalName.replace(/[^a-zA-Z0-9]/g, '');
    // The composed file's absolute imports point at this dataset's own
    // `generated/` and `overrides/` trees under `@/data/datasets/<id>/`.
    const importRoot = `@/data/datasets/${datasetId}`;
    const genRel = path.posix.join(
      `${importRoot}/generated/powersets`,
      categoryInfo.archetype, categoryInfo.type,
      toKebabCase(indexJson.display_name), toKebabCase(power.internalName),
    );
    const ovrRel = path.posix.join(
      `${importRoot}/overrides/powersets`,
      categoryInfo.archetype, categoryInfo.type,
      toKebabCase(indexJson.display_name), toKebabCase(power.internalName),
    );

    // 1. generated layer — always overwritten
    const generatedContent = `/**
 * ${power.name} — GENERATED LAYER
 * AUTO-GENERATED by \`node scripts/convert-powerset.cjs ${category} ${powersetName}\`.
 * Do not hand-edit. Manual deltas go in the parallel overrides file.
 *
 * Source: ${category}/${powersetName}/${file}
 */

import type { Power } from '@/types';

export const ${exportName}: Power = ${serializePower(power)};
`;
    fs.writeFileSync(path.join(generatedDir, powerFileName), generatedContent);

    // 2. & 3. overrides + composed.
    //    An override file exists ONLY when it carries a real hand-written delta.
    //    Empty `{}` stubs are no longer scaffolded — a no-delta power gets a
    //    composed file that re-exports the generated base directly (no override
    //    import, no `withOverrides` call). To ADD an override: hand-create the
    //    parallel overrides/<power>.ts with a non-empty `overrides` object, then
    //    re-run the converter — it detects the file here and rewires the composed
    //    file to layer it. See src/data/README.md.
    const composedPath = path.join(composedDir, powerFileName);
    const overridePath = path.join(overridesDir, powerFileName);
    // hasOverride = an override file exists AND its object literal is non-empty.
    // A lingering empty `{}` stub is treated as "no override" so it projects to
    // the base-only composed form (and can be safely deleted).
    let hasOverride = false;
    if (fs.existsSync(overridePath)) {
      const existing = fs.readFileSync(overridePath, 'utf-8');
      const m = existing.match(/Partial<Power>\s*=\s*(\{[\s\S]*?\})\s*;/);
      hasOverride = m ? m[1].replace(/\s+/g, '') !== '{}' : false;
    }
    // The composed file is purely mechanical and ALWAYS rewritten — this keeps
    // its import/export identifier in sync with the generated export const (a
    // rename would otherwise strand the old import).
    const composedContent = hasOverride
      ? `/**
 * ${power.name} — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via \`withOverrides\`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs ${category} ${powersetName}
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ${exportName} as base } from '${genRel}';
import { overrides } from '${ovrRel}';

export const ${exportName}: Power = withOverrides(base, overrides);
`
      : `/**
 * ${power.name} — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * \`overrides\` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs ${category} ${powersetName}
 */
import type { Power } from '@/types';
import { ${exportName} as base } from '${genRel}';

export const ${exportName}: Power = base;
`;
    fs.writeFileSync(composedPath, composedContent);

    console.log(`  - ${power.name}`);
  }

  // Local aliases for the index imports — derived from the INTERNAL name (the
  // stable module identifier, matching each composed file's export const). The
  // dedup guard is kept defensively, though internal names are unique within a set.
  const usedNames = new Map(); // name -> count
  const powerVarNames = powers.map(({ power: p }) => {
    const baseName = p.internalName.replace(/[^a-zA-Z0-9]/g, '');
    const count = usedNames.get(baseName) || 0;
    usedNames.set(baseName, count + 1);
    return count > 0 ? `${baseName}${count + 1}` : baseName;
  });

  // Dormant sets stay in the generated tree but are flagged so the app can
  // filter them from pickers uniformly (see src/data/powersets.ts). Only
  // player-selectable set types can be dormant; pets/inherent are never offered
  // in a picker, so an access gate there is normal, not a dormancy signal.
  const SELECTABLE_TYPES = new Set(['primary', 'secondary', 'epic']);
  const dormant = SELECTABLE_TYPES.has(categoryInfo.type)
    && deriveDormant(powers.map((x) => x.power));

  // Write index file
  const indexContent = `/**
 * ${indexJson.display_name} Powerset
 * ${indexJson.display_help?.replace(/<[^>]+>/g, '').trim()}
 *
 * Archetype: ${categoryInfo.archetype}
 * Category: ${categoryInfo.type}
 * Source: ${category}/${powersetName}
 */

import type { Powerset } from '@/types';

${powers.map(({ power: p }, i) => `import { ${p.internalName.replace(/[^a-zA-Z0-9]/g, '')} as ${powerVarNames[i]} } from './${toKebabCase(p.internalName)}';`).join('\n')}

export const powerset: Powerset = {
  id: '${categoryInfo.archetype}/${toKebabCase(indexJson.display_name)}',
  internalName: '${powersetName}',
  name: '${indexJson.display_name}',
  description: '${indexJson.display_help?.replace(/<[^>]+>/g, '').replace(/'/g, "\\'")}',
  icon: '${indexJson.icon}',
  archetype: '${categoryInfo.archetype}',
  category: '${categoryInfo.type}',
  powers: [
${powerVarNames.map(name => `    ${name},`).join('\n')}
  ],
${dormant ? '  dormant: true,\n' : ''}};

export default powerset;
`;

  // index.ts lives with the composed files and imports from them by their
  // kebab-case filename (same as pre-layering), so the import paths stay
  // stable across the layering migration.
  fs.writeFileSync(path.join(composedDir, 'index.ts'), indexContent);
  console.log(`\nWrote ${powers.length} powers to ${composedDir}`);

  return { powerset: indexJson, powers, outputDir: composedDir };
}

// ============================================
// DORMANCY DERIVATION
// ============================================

// A power whose `requires` expression contains an `accesslevel char> N` clause
// is locked to GMs/devs — normal players have access level 0, so the clause is
// always false for them. City of Heroes uses this to keep unfinished/unreleased
// content out of normal play.
const ACCESS_GATE_RE = /accesslevel char>/;

/**
 * Derive whether a player-selectable powerset is "dormant" — present in this
 * server's bins but not released to players.
 *
 * A set is dormant when the MAJORITY of its powers carry the dev-only access
 * gate. The majority threshold (not "all") tolerates a stray ungated component
 * power — e.g. Wind Control's "Breathless" is open while its other 9 powers are
 * gated (9/10) — without misfiring on a genuinely released set that merely
 * contains one or two dev-gated powers — e.g. Thunderspy's Organic Armor (2/12).
 * Validated 2026-07-08: across all three servers the dormant sets sit at
 * 0.90–1.00 gated and every released set at <=0.17, so any threshold in that
 * gap is safe.
 *
 * This replaces hand-maintained hide-lists (formerly HC_HIDDEN_POWERSETS in
 * src/data/powersets.ts). It is self-maintaining: when a server finishes a set
 * and drops the gate, the flag flips on the next `npm run regen`, no code edit.
 */
function deriveDormant(powers) {
  if (!powers || powers.length === 0) return false;
  const gated = powers.filter((p) => ACCESS_GATE_RE.test(p.requires || '')).length;
  return gated / powers.length > 0.5;
}

// Export for reuse by other scripts (the batch orchestrator, pool/epic
// converters, gates, and emitters all consume this module as a library).
module.exports = {
  deriveDormant,
  getStrengthsDisallowedIndex,
  applyThunderspyDamageType,
  damageTypeSetFromPower,
  DAMAGE_ATTRIB_INDEX,
  guardThunderspyOnesBuffs,
  guardThunderspyAppliedMez,
  resolveThunderspyMovementTargets,
  extractEffects,
  templatesToAtoms,
  projectAtomsToEffects,
  extractDamage,
  evalMagnitudeExpression,
  stdResultCoefficient,
  parseAbsorbMaxHPFraction,
  extractQuickSnipeData,
  inferAllowedSetCategories,
  inferEffectiveArea,
  normalizeIconPath,
  toKebabCase,
  CATEGORY_MAP,
  BOOST_TYPE_MAP,
  BIN_BOOST_MAP,
  EFFECT_AREA_MAP,
  SET_CATEGORY_MAP,
  TARGET_TYPE_MAP,
  DAMAGE_TYPES,
  DEFENSE_POSITIONS,
  ELUSIVITY_TYPES,
  MEZ_TYPES,
  KNOCKBACK_TYPES,
  MOVEMENT_TYPES,
  RESOURCE_TYPES,
  COMBAT_MODIFIERS,
  STEALTH_TYPES,
  CONTROL_TYPES,
  SPECIAL_ATTRIBS,
  RAW_DATA_PATH,
  collectAllTemplates,
  collectAtomTemplates,
  encodeAtomsForEmit,
  resolveRedirectPath,
  convertPower,
  classifyModeRedirect,
  extractModeVariants,
  assignModes,
  collectRedirectTemplates,
  collectBaseTemplates,
  _filterFieryEmbraceBonus,
  collectTemplatesDeep,
  resolveSummonRedirects,
  classifyPseudoPetEffect,
  attachResolvedPseudoPets,
  detectStackingEffects,
  mergeStackingPatches,
};

// Main execution (only when run directly)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node scripts/convert-powerset.js <category> <powerset>');
    console.log('Example: node scripts/convert-powerset.js defender_buff radiation_emission');
    console.log('\nAvailable categories:', Object.keys(CATEGORY_MAP).join(', '));
    process.exit(1);
  }

  convertPowerset(args[0], args[1]);
}
