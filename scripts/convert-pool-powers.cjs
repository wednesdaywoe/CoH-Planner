/**
 * Convert Pool Powers from raw Homecoming JSON data
 *
 * Reads raw JSON from raw_data_homecoming/powers/pool/ and generates
 * the POWER_POOLS_RAW object for
 * src/data/datasets/<id>/power-pools-raw.ts.
 *
 * Uses the same extractEffects/extractDamage pipeline as archetype powers
 * to ensure consistent effect extraction (including child_effects recursion).
 *
 * Usage:
 *   node scripts/convert-pool-powers.cjs                # Dry run (preview)
 *   node scripts/convert-pool-powers.cjs --apply        # Write power-pools-raw.ts
 *   node scripts/convert-pool-powers.cjs --pool fighting # One pool only
 */

const fs = require('fs');
const path = require('path');
const {
  BOOST_TYPE_MAP,
  SET_CATEGORY_MAP,
  extractEffects,
  extractDamage,
  extractModeVariants,
  guardThunderspyOnesBuffs,
  resolveThunderspyMovementTargets,
  inferAllowedSetCategories,
  normalizeIconPath,
  collectTemplatesDeep,
  collectAtomTemplates,
  collectBaseTemplates,
  encodeAtomsForEmit,
  RAW_DATA_PATH,
  BIN_BOOST_MAP,
  EFFECT_AREA_MAP,
  TARGET_TYPE_MAP,
  getStrengthsDisallowedIndex,
  deriveDormant,
} = require('./convert-powerset.cjs');

// HC bin export writes pool powers under `<RAW_DATA_PATH>/pool/`. The legacy
// CoD2 layout had an extra `powers/` segment in the path; the bin layout
// dropped it. Probe both so the converter works during transitions.
const RAW_POWERS_PATH = (() => {
  const newLayout = path.join(RAW_DATA_PATH, 'pool');
  const oldLayout = path.join(RAW_DATA_PATH, 'powers', 'pool');
  if (fs.existsSync(newLayout)) return newLayout;
  return oldLayout;
})();
const { parseDatasetArg, dataPath, datasetPath } = require('./_dataset-paths.cjs');
const datasetId = parseDatasetArg();

// All datasets write under `src/data/datasets/<id>/`.
const OUTPUT_PATH = datasetPath(datasetId, 'generated', 'power-pools.ts');
const COMPOSED_PATH = datasetPath(datasetId, 'power-pools-raw.ts');
const OVERRIDES_PATH = datasetPath(datasetId, 'overrides', 'power-pools.ts');

// Parse CLI args
const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');
const poolFilterIdx = args.indexOf('--pool');
const poolFilter = poolFilterIdx >= 0 ? args[poolFilterIdx + 1] : null;

// ============================================
// POOL ID → RAW DIRECTORY MAPPING
// ============================================

// Map processed pool IDs to raw data directory names
// Most are the same, but "presence" maps to "manipulation"
// Every pool listed here is converted unconditionally for every dataset; a pool
// absent from a dataset's export is skipped silently (convertPool returns null),
// so listing the union is safe. Release state is derived where the bins encode
// it: a pool whose powers carry the dev-only `accesslevel > 0` gate is flagged
// `dormant` (see `deriveDormant`) and hidden by the app. Per server devs
// (2026-07-08): HC has neither Gadgetry nor Utility Belt, Rebirth has Gadgetry
// only, Thunderspy has both. The accesslevel signal reproduces all of that
// EXCEPT Rebirth's Utility Belt — see POOL_DORMANCY_OVERRIDES below.
const POOL_DIR_MAP = {
  experimentation: 'experimentation',
  fighting: 'fighting',
  fitness: 'fitness',
  flight: 'flight',
  force_of_will: 'force_of_will',
  gadgetry: 'gadgetry',
  invisibility: 'invisibility',
  leadership: 'leadership',
  leaping: 'leaping',
  presence: 'manipulation',
  medicine: 'medicine',
  sorcery: 'sorcery',
  speed: 'speed',
  teleportation: 'teleportation',
  utility_belt: 'utility_belt',
};


// Dormancy overrides for pools that no bin signal can classify. Per a Rebirth
// dev (2026-07-08), Rebirth's Utility Belt is "present but locked — nobody owns
// it and there's no way to get the entitlement." It's ENTITLEMENT-gated: the
// powerset requires ownership of an account product (verified in powersets.bin —
// Rebirth UB carries account_product='ctpputbe', account_tooltip 'ctpputbe
// ProductOwned?'). The REQUIREMENT is in the data, but whether the product is
// GRANTED to players is server-side and is NOT — so it can't be derived. Proof
// it's non-derivable: on Rebirth, Sorcery ALSO carries an account product
// (ctppsorc) yet is fully available (its product is granted to everyone); only
// UB's product is granted to no one. account_product is identical in shape for
// the available set and the locked set. (Thunderspy's UB has no entitlement at
// all → available; HC gates via accesslevel GM-only, which deriveDormant
// catches.) So this stays hand-curated from dev word until Rebirth grants/ships
// UB, at which point delete the entry. Keep MINIMAL and dev-sourced.
const POOL_DORMANCY_OVERRIDES = {
  rebirth: new Set(['utility_belt']),  // entitlement-locked (product 'ctpputbe' granted to nobody) — not derivable.
};

// ============================================
// LOAD EXISTING DATA (for preserving metadata)
// ============================================

function loadExistingPools() {
  // Try the layered generated/ output first; fall back to the old single-file
  // location so the first run after the layering switch still has access to
  // hand-tagged metadata that lived in power-pools-raw.ts.
  for (const candidate of [OUTPUT_PATH, COMPOSED_PATH]) {
    try {
      const content = fs.readFileSync(candidate, 'utf-8');
      const match = content.match(/export\s+const\s+POWER_POOLS_RAW\s*=\s*(\{[\s\S]*\})\s*(?:as\s+const)?\s*;?\s*$/);
      if (match) {
        return new Function('return ' + match[1])();
      }
    } catch (_) { /* try next */ }
  }
  return {};
}

// ============================================
// CONVERT A SINGLE POOL POWER
// ============================================

function convertPoolPower(rawJson, rank, availableLevel) {
  const power = {};

  // Basic metadata
  power.name = rawJson.display_name || rawJson.name;
  power.fullName = rawJson.full_name;

  // StrengthsDisallowed from the bin export; GlobalStrengthsDisallowed from the
  // `raw defs/` oracle, the only source for it (HC only — see
  // getStrengthsDisallowedIndex in convert-powerset.cjs). Recharge carriers
  // here: Rune of Protection, Afterburner-class travel boosts.
  if (Array.isArray(rawJson.strengths_disallowed) && rawJson.strengths_disallowed.length) {
    power.strengthsDisallowed = rawJson.strengths_disallowed;
  }
  {
    const sd = rawJson.full_name
      && getStrengthsDisallowedIndex().get(rawJson.full_name.toLowerCase());
    if (sd && sd.global.length) power.globalStrengthsDisallowed = sd.global;
  }
  power.rank = rank;
  power.available = availableLevel;

  // Description & help
  power.description = rawJson.display_help || '';
  if (rawJson.display_short_help) {
    power.shortHelp = rawJson.display_short_help.replace(/\u00a0/g, ' ');
  }
  power.icon = normalizeIconPath(rawJson.icon || '');
  power.powerType = rawJson.type || 'Click';

  // Target type — map bin format ("Friend", "DeadOrAliveLeaguemate") to the
  // planner's normalized labels ("Ally (Alive)", "Teammate"). Required for
  // the dashboard's ally-only filter to skip ally-buff toggles like Grant
  // Invisibility — without this they bleed into caster totals.
  if (rawJson.target_type) {
    const mapped = TARGET_TYPE_MAP[rawJson.target_type];
    if (mapped) power.targetType = mapped;
  }

  // Mode-gated redirect variants — the same transform archetype powers get, so a pool power
  // the game redirects by mode (Teleport under ChainTeleport) is not left behind.
  const modeVariants = extractModeVariants(rawJson);
  if (modeVariants) {
    power.modeVariants = modeVariants;
  }

  // Requires
  if (rawJson.requires && rawJson.requires !== '') {
    power.requires = rawJson.requires;
  } else {
    power.requires = '';
  }

  // Slots
  power.maxSlots = rawJson.max_boosts !== undefined && rawJson.max_boosts !== null
    ? rawJson.max_boosts : 6;

  // Allowed enhancements: bin export uses short names (e.g. "Buff_Defense")
  // that match BIN_BOOST_MAP; the legacy CoD2 archive used long names that
  // matched BOOST_TYPE_MAP. Try both so either source works.
  const enhancements = (rawJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b] || BIN_BOOST_MAP[b])
    .filter(Boolean);
  power.allowedEnhancements = [...new Set(enhancements)].sort();

  // Allowed IO set categories. Prefer the exporter's authoritative
  // `allowed_set_categories` (reversed from boostsets.bin). Fall back to
  // inference only when the field is absent (old export). Strict mode: an
  // empty array means "game says no IO sets slot here" — the field stays
  // unset and only single IOs (allowedEnhancements) work.
  if (Array.isArray(rawJson.allowed_set_categories)) {
    if (rawJson.allowed_set_categories.length > 0) {
      power.allowedSetCategories = [...rawJson.allowed_set_categories].sort();
    }
    // else: leave unset.
  } else {
    const hasTeleportAttrib = (rawJson.effects || []).some(eff =>
      (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'teleport')
    );
    power.allowedSetCategories = inferAllowedSetCategories(
      rawJson.boosts_allowed || [],
      EFFECT_AREA_MAP[rawJson.effect_area] ?? rawJson.effect_area,
      rawJson.range,
      rawJson.powerset || rawJson.full_name,
      hasTeleportAttrib,
    );
  }

  // Thunderspy movement target-trap: resolve empty movement-template targets from
  // targets_affected before any collector reads them. The pool converter is a SEPARATE
  // pipeline from convert-powerset (the five-converters drift, [[three-power-converters]]),
  // so the fix that lands powerset movement must be called here too — this is where the
  // travel powers (Super Speed, Fly, Combat Jumping, Hover, Super Jump) actually live.
  resolveThunderspyMovementTargets(rawJson);

  // Effects object (legacy format: stats mixed in with effects)
  const effects = {};

  // Stats
  if (rawJson.accuracy) effects.accuracy = rawJson.accuracy;
  if (rawJson.range) effects.range = rawJson.range;
  if (rawJson.recharge_time) effects.recharge = rawJson.recharge_time;
  if (rawJson.endurance_cost) effects.endurance = rawJson.endurance_cost;
  if (rawJson.activation_time) effects.activationTime = rawJson.activation_time;
  // Toggle tick period — endurance/sec = endurance / activatePeriod. Missing this
  // field made every pool toggle's endurance display fall back to 0.5s and
  // overcount cost by 4× (Leadership Maneuvers/Tactics/Assault showed 1.56/s
  // instead of 0.39/s, etc).
  if (rawJson.activate_period) effects.activatePeriod = rawJson.activate_period;
  if (rawJson.effect_area && rawJson.effect_area !== 'None') {
    // Bin format uses "Sphere" for what the planner calls "AoE", etc.
    // Normalize through the same map convert-powerset.cjs uses.
    effects.effectArea = EFFECT_AREA_MAP[rawJson.effect_area] ?? rawJson.effect_area;
  }
  if (rawJson.radius && rawJson.radius > 0) effects.radius = rawJson.radius;
  if (rawJson.arc && rawJson.arc > 0) effects.arc = rawJson.arc;
  if (rawJson.max_targets_hit && rawJson.max_targets_hit > 0) {
    effects.maxTargets = rawJson.max_targets_hit;
  }

  // Extract effects from raw JSON using recursive template collection.
  //
  // `collectBaseTemplates` (shared with convert-powerset.cjs) covers BOTH shapes: a
  // power's own `effects`, and — when those are empty — its redirect chain. This
  // converter used to inline `collectTemplatesDeep(rawJson.effects)` behind an
  // `if (rawJson.effects?.length)` guard, so every redirect-only pool power produced
  // an empty bag: Aid Other, Teleport and Teleport Target have shipped with no effects
  // for as long as this file has existed. See collectBaseTemplates' docstring.
  const { templates: allTemplates } = collectBaseTemplates(rawJson);
  if (allTemplates.length > 0) {
    // Damage
    const damage = extractDamage(allTemplates);
    if (damage) effects.damage = damage;

    // All other effects (combat-suppression now flows from template.suppress_events
    // populated by the binary parser — no .def-file lookup needed).
    const extractedEffects = extractEffects(allTemplates, rawJson.name);
    if (Object.keys(extractedEffects).length > 0) {
      // Merge extracted effects into the effects object
      // Map certain effect keys to legacy naming for the transformation layer
      for (const [key, value] of Object.entries(extractedEffects)) {
        effects[key] = value;
      }
    }

    // NB per-target stacking (`detectStackingEffects`) is deliberately NOT run here,
    // unlike convert-epic-pools.cjs where it fixes Soul Drain's missing per-foe scaling.
    // It was tried for pipeline symmetry and REGRESSED Cross Punch: the detector's AoE
    // heuristic reads "a Self-targeted Stack template in an AoE" as a per-foe increment,
    // but Cross Punch's +5% ToHit / +5% Recharge are Fighting Synergy — granted per
    // FIGHTING POOL POWER OWNED (Boxing/Kick), applied once per cast, and it is a Cone
    // with max_targets_hit 5. The detector minted a bogus `perTarget: 0.05` and, worse,
    // a `tohitBuff` slot duplicating the existing IgnoreStrength `tohitBuffUnenhanced`
    // half, so the calc would have counted the buff twice.
    //
    // No pool power is known to be genuinely per-foe, so the honest position is to leave
    // the detector off here rather than run a heuristic whose only live effect is a false
    // positive. Revisit if a per-foe pool power ever appears — with a gate first.

  }

  // Plan B — emit the pre-projection atom list alongside the bag, exactly as
  // convert-powerset.cjs does for archetype powers. Pool powers went without it
  // until 2026-07-15, which meant every atom-native applier silently fell back to
  // the bag for Health, Stamina, Tough, Weave, Maneuvers, Assault et al. — safe
  // (that is what the fallback is for) but invisible, and a hard blocker on Phase 3,
  // since the bag could not be deleted while those pool powers (~15% of the corpus at
  // the time) had no atom representation. RESOLVED by this block: as of 2026-07-18 the
  // census shows 0% of powers lack atoms in EVERY dataset (docs/ATOMIC-STATE-AUDIT.md).
  // The bag's remaining reasons to exist are the unmigrated bag-consumed families and
  // Thunderspy's 21.7% only-`Unmapped` powers (TSPY-3) — NOT any power lacking atoms.
  //
  // Union of `allTemplates` (what the bag saw) with `collectAtomTemplates` (which adds
  // back the gated groups the bag's collector drops); the difference is stamped
  // `gated: true`. Guarded on `atomTemplates`, NOT on the bag's `allTemplates` — see
  // the same block in convert-powerset.cjs for why (Victory Rush is this converter's
  // instance: every one of its effect groups is rank-gated, so the bag sees nothing
  // while the atom list has 6).
  {
    const atomTemplates = [...new Set([
      ...allTemplates,
      ...collectAtomTemplates(rawJson.effects || []),
    ])];
    if (atomTemplates.length > 0) {
      const atoms = encodeAtomsForEmit(atomTemplates, allTemplates, rawJson.name);
      if (atoms) power.atoms = atoms;
    }
  }

  power.effects = effects;

  // Thunderspy: veto the `Ones`-relabel false positives (resistance-as-recharge,
  // foe-attack self-buffs) the binary can't disambiguate. No-op elsewhere.
  if (datasetId === 'thunderspy') {
    guardThunderspyOnesBuffs(power, rawJson.targets_affected);
  }

  return power;
}

// ============================================
// CONVERT A POOL
// ============================================

function convertPool(poolId) {
  // A disk-discovered pool absent from POOL_DIR_MAP converts from the
  // directory bearing its own name (the map's only real rename is
  // presence → manipulation/).
  const rawDir = POOL_DIR_MAP[poolId] || poolId;

  const poolPath = path.join(RAW_POWERS_PATH, rawDir);
  if (!fs.existsSync(poolPath)) {
    // Pool absent from this dataset's raw export (e.g. Gadgetry exists in
    // Rebirth but not HC). Skip silently — POOL_DIR_MAP is the union across
    // all datasets.
    return null;
  }

  // Load pool index
  const indexPath = path.join(poolPath, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error(`Pool index not found: ${indexPath}`);
    return null;
  }

  const poolIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Every pool index in all three exports carries display_name (censused
  // 2026-07-20), and it owns the id→name renames (invisibility →
  // "Concealment", manipulation/ → "Presence") — never hand-map these.
  if (!poolIndex.display_name) {
    throw new Error(`${indexPath}: missing display_name`);
  }

  // Build pool metadata from index
  const pool = {
    id: poolId,
    name: poolIndex.display_name,
    displayName: poolIndex.display_name,
    description: poolIndex.description || poolIndex.display_help || '',
    icon: poolIndex.icon || '',
    requires: poolIndex.requires || '',
    powers: [],
  };

  // Get power order from index. Old (CoD2) layout used `power_names`; the new
  // bin-export layout uses `powers`. Probe both.
  // NOTE: bin-export's `powers` array is alphabetical (CoD2's was game-pick
  // order). We sort by `available_level` after collecting so the displayed
  // pick order matches the game (Boxing/Kick before Tough/Weave, Hasten
  // before Burnout, Stealth before Infiltration, etc.).
  const powerNames = poolIndex.power_names || poolIndex.powers || [];
  const availableLevels = poolIndex.available_level || [];

  const collected = [];
  for (let i = 0; i < powerNames.length; i++) {
    const fullName = powerNames[i];
    const parts = fullName.split('.');
    const powerFile = parts[parts.length - 1].toLowerCase() + '.json';
    const filePath = path.join(poolPath, powerFile);

    if (!fs.existsSync(filePath)) {
      console.warn(`  Power file not found: ${powerFile} (from ${fullName})`);
      continue;
    }

    const rawJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // Bin reads available_level as u4. UINT_MAX (4294967295) is the unsigned
    // form of -1, used to mark auto-granted powers (Afterburner from Fly,
    // Translocation from Mystic Flight, Arcane Power from Arcane Bolt).
    // Normalize to -1 so the planner's `available < 0` filter catches them.
    let availableLevel = availableLevels[i];
    if (availableLevel === 4294967295 || availableLevel === undefined) {
      availableLevel = availableLevel === 4294967295 ? -1 : 0;
    }
    // Minimum number of other pool picks required to satisfy this power's
    // requires expression. Heuristic on the RPN form (see below), sufficient
    // for every pool currently in the game:
    //   no requires          → 0 prereqs (T1)
    //   only ORs, no ANDs    → 1 prereq  (e.g. Tough: "Boxing Kick ||")
    //   has at least one AND → 2 prereqs (e.g. Weave / Cross Punch:
    //                          "(A&B) || (C&D) || ..." — each OR branch
    //                          needs two concurrent picks)
    // This is what separates Tough (T3) from Cross Punch / Weave (T4):
    // both are available at level 14, but Tough only needs one prior
    // Fighting pick while Cross Punch needs two.
    const requires = (rawJson.requires || '').trim();
    const minPrereqs = requires === '' ? 0 : (requires.includes('&&') ? 2 : 1);
    collected.push({ rawJson, availableLevel, minPrereqs, originalIndex: i });
  }

  // Sort by (available_level, minPrereqs, originalIndex) so the pool's
  // visible tier order reflects the actual selection dependency chain:
  //   T1 picks that can be taken at level 1 with no prereqs
  //   T2 picks gated by 1 prior pool pick
  //   T3/T4 picks gated by 2+ prior pool picks
  // Auto-granted powers (available=-1) sort to the END so they don't steal
  // early ranks from real selectable powers.
  collected.sort((a, b) => {
    const aKey = a.availableLevel < 0 ? Number.MAX_SAFE_INTEGER : a.availableLevel;
    const bKey = b.availableLevel < 0 ? Number.MAX_SAFE_INTEGER : b.availableLevel;
    if (aKey !== bKey) return aKey - bKey;
    if (a.minPrereqs !== b.minPrereqs) return a.minPrereqs - b.minPrereqs;
    return a.originalIndex - b.originalIndex;
  });

  collected.forEach((entry, idx) => {
    const power = convertPoolPower(entry.rawJson, idx + 1, entry.availableLevel);
    pool.powers.push(power);
  });

  return pool;
}

// ============================================
// SERIALIZE OUTPUT
// ============================================

function serializeValue(val, indent) {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'string') return JSON.stringify(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(v => {
      if (typeof v === 'string') return `${' '.repeat(indent + 2)}${JSON.stringify(v)}`;
      return `${' '.repeat(indent + 2)}${serializeValue(v, indent + 2)}`;
    });
    return `[\n${items.join(',\n')}\n${' '.repeat(indent)}]`;
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const entries = keys.map(k => {
      // `atoms` is the Plan B wire list — one positional tuple per atom. Render each
      // tuple on ONE line; the generic array branch above would explode every scalar
      // onto its own line, inflating the compact encoding ~10× on disk. Mirrors
      // `serializePower` in convert-powerset.cjs.
      if (k === 'atoms' && Array.isArray(val[k]) && val[k].length) {
        const tuples = val[k]
          .map(t => `${' '.repeat(indent + 4)}${JSON.stringify(t)}`)
          .join(',\n');
        return `${' '.repeat(indent + 2)}${JSON.stringify(k)}: [\n${tuples}\n${' '.repeat(indent + 2)}]`;
      }
      const v = serializeValue(val[k], indent + 2);
      return `${' '.repeat(indent + 2)}${JSON.stringify(k)}: ${v}`;
    });
    return `{\n${entries.join(',\n')}\n${' '.repeat(indent)}}`;
  }

  return String(val);
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log(`=== CONVERT POOL POWERS ${applyChanges ? '(APPLYING)' : '(DRY RUN)'} ===\n`);

  const existingPools = loadExistingPools();
  // Discover pools on disk too — a new pool directory in the bin export must not
  // be silently skipped by a closed list (the convert-epic-pools pattern). Raw
  // dir names map back through POOL_DIR_MAP's rename (manipulation → presence);
  // an unmapped dir converts under its own name. Map order comes first so the
  // emitted object keeps its committed key order; genuine discoveries append.
  const rawDirToPoolId = Object.fromEntries(
    Object.entries(POOL_DIR_MAP).map(([id, dir]) => [dir, id]),
  );
  let discoveredIds = [];
  try {
    discoveredIds = fs.readdirSync(RAW_POWERS_PATH)
      .filter((entry) => fs.existsSync(path.join(RAW_POWERS_PATH, entry, 'index.json')))
      .map((dir) => rawDirToPoolId[dir] || dir)
      .filter((id) => !(id in POOL_DIR_MAP))
      .sort();
  } catch (_) {
    // RAW_POWERS_PATH missing — this dataset ships no pool dir; the map union
    // still runs so cross-dataset pools resolve their absence in convertPool.
  }
  const poolIds = poolFilter ? [poolFilter] : [...Object.keys(POOL_DIR_MAP), ...discoveredIds];
  const allPools = {};

  for (const poolId of poolIds) {
    console.log(`Converting ${poolId}...`);
    const pool = convertPool(poolId);

    if (pool) {
      // Dormant = not released on this server. Derived from the dev-only
      // `accesslevel > 0` gate (deriveDormant), OR an explicit server-side
      // override for the cases the client bins don't encode (see
      // POOL_DORMANCY_OVERRIDES). Flagged here; the app filters it from the
      // picker (src/data/power-pools.ts). Replaces the former DATASET_EXTRA_POOLS
      // allowlist.
      const overridden = POOL_DORMANCY_OVERRIDES[datasetId]?.has(poolId);
      if (deriveDormant(pool.powers) || overridden) pool.dormant = true;
      allPools[poolId] = pool;
      const why = overridden ? ' (DORMANT — server-side override)' : (pool.dormant ? ' (DORMANT — accesslevel-gated)' : '');
      console.log(`  ${pool.powers.length} powers converted${why}`);

      // Compare with existing
      const existing = existingPools[poolId];
      if (existing) {
        const existingNames = existing.powers.map(p => p.name);
        const newNames = pool.powers.map(p => p.name);
        const added = newNames.filter(n => !existingNames.includes(n));
        const removed = existingNames.filter(n => !newNames.includes(n));
        if (added.length) console.log(`  Added: ${added.join(', ')}`);
        if (removed.length) console.log(`  Removed: ${removed.join(', ')}`);
      }
    }
  }

  // If filtering to one pool, merge with existing
  if (poolFilter) {
    for (const [id, pool] of Object.entries(existingPools)) {
      if (!allPools[id]) allPools[id] = pool;
    }
  }

  // Generate output
  const totalPowers = Object.values(allPools).reduce((sum, p) => sum + p.powers.length, 0);
  const poolIdList = JSON.stringify(Object.keys(allPools));

  let output = `/**\n`;
  output += ` * Raw Power Pool data — GENERATED LAYER\n`;
  output += ` * Auto-generated from raw Homecoming JSON data.\n`;
  output += ` *\n`;
  output += ` * DO NOT EDIT THIS FILE DIRECTLY. Overrides live in\n`;
  output += ` * src/data/overrides/power-pools.ts and are merged by the\n`;
  output += ` * composed facade at src/data/power-pools-raw.ts.\n`;
  output += ` * Run: node scripts/convert-pool-powers.cjs --apply\n`;
  output += ` *\n`;
  output += ` * Total pools: ${Object.keys(allPools).length}\n`;
  output += ` * Total powers: ${totalPowers}\n`;
  output += ` * Pool IDs: ${poolIdList}\n`;
  output += ` */\n\n`;
  output += `export const POWER_POOLS_RAW = ${serializeValue(allPools, 0)};\n`;

  if (applyChanges) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.mkdirSync(path.dirname(OVERRIDES_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, output);
    console.log(`\nWritten to ${OUTPUT_PATH}`);
    console.log(`${Object.keys(allPools).length} pools, ${totalPowers} powers`);
    // Scaffold overrides + composed if missing (atomic: both or neither).
    if (!fs.existsSync(OVERRIDES_PATH) && !fs.existsSync(COMPOSED_PATH)) {
      fs.writeFileSync(OVERRIDES_PATH, `/**
 * Power Pool overrides — hand-written deltas keyed by a power's
 * \`fullName\` (e.g. \`Pool.Fighting.Boxing\`). The composed facade
 * (src/data/power-pools-raw.ts) merges each entry into its matching
 * generated power via \`withOverrides\`.
 *
 * Empty record means no overrides. Add entries here when the stale
 * CoD2 raw extraction disagrees with current HC game values. See
 * src/data/README.md for the layering convention.
 */
import type { Power } from '@/types';

export const POWER_POOL_OVERRIDES: Record<string, Partial<Power>> = {};
`);
      // `_layer` is server-agnostic and lives at `src/data/_layer.ts`.
      // The composed file is at `src/data/datasets/<id>/` — use the
      // absolute alias.
      const layerImport = '@/data/_layer';
      fs.writeFileSync(COMPOSED_PATH, `/**
 * Power Pool data — COMPOSED FACADE
 *
 * Merges the auto-generated extraction with hand-written per-power
 * overrides. The planner imports from here; see src/data/README.md.
 *
 * To re-generate the base data:
 *   node scripts/convert-pool-powers.cjs --apply
 */
import { applyAggregateOverrides } from '${layerImport}';
import { POWER_POOLS_RAW as base } from './generated/power-pools';
import { POWER_POOL_OVERRIDES } from './overrides/power-pools';

export const POWER_POOLS_RAW = applyAggregateOverrides(base, POWER_POOL_OVERRIDES);
`);
      console.log(`  Scaffolded composed facade: ${COMPOSED_PATH}`);
      console.log(`  Scaffolded overrides stub:  ${OVERRIDES_PATH}`);
    }
  } else {
    console.log(`\nWould write ${Object.keys(allPools).length} pools, ${totalPowers} powers`);
    console.log(`Run with --apply to write changes`);
  }
}

main();
