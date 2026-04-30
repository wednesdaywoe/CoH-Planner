/**
 * Convert Epic/Patron Pool Powers from raw Homecoming JSON data
 *
 * Reads raw JSON from raw_data_homecoming/powers/epic/ and generates
 * the EPIC_POOLS_RAW object for src/data/epic-pools-raw.ts.
 *
 * Preserves pool-level metadata (archetype, displayName, minLevel) from
 * the existing file, and reconverts power data using the same
 * extractEffects/extractDamage pipeline as archetype powers.
 *
 * Usage:
 *   node scripts/convert-epic-pools.cjs                  # Dry run (preview)
 *   node scripts/convert-epic-pools.cjs --apply          # Write epic-pools-raw.ts
 *   node scripts/convert-epic-pools.cjs --pool blaster_dark_mastery  # One pool only
 *   node scripts/convert-epic-pools.cjs --archetype blaster          # One archetype
 */

const fs = require('fs');
const path = require('path');
const {
  BOOST_TYPE_MAP,
  SET_CATEGORY_MAP,
  extractEffects,
  extractDamage,
  collectAllTemplates,
  RAW_DATA_PATH,
  EFFECT_AREA_MAP,
  BIN_BOOST_MAP,
  inferAllowedSetCategories,
  normalizeIconPath,
} = require('./convert-powerset.cjs');

// Bin export writes epic pool powers under `<RAW_DATA_PATH>/epic/`.
// Old CoD2 layout had an extra `powers/` segment. Probe both.
const RAW_POWERS_PATH = (() => {
  const newLayout = path.join(RAW_DATA_PATH, 'epic');
  const oldLayout = path.join(RAW_DATA_PATH, 'powers', 'epic');
  if (fs.existsSync(newLayout)) return newLayout;
  return oldLayout;
})();
const { parseDatasetArg, dataPath, datasetPath } = require('./_dataset-paths.cjs');
const datasetId = parseDatasetArg();

// HC keeps writing to legacy `src/data/` paths until the deferred powerset-
// tree migration. Other datasets write into their dataset folder.
const useLegacyOutput = datasetId === 'homecoming';
const OUTPUT_PATH = useLegacyOutput
  ? dataPath('generated', 'epic-pools.ts')
  : datasetPath(datasetId, 'generated', 'epic-pools.ts');
const COMPOSED_PATH = useLegacyOutput
  ? dataPath('epic-pools-raw.ts')
  : datasetPath(datasetId, 'epic-pools-raw.ts');
const OVERRIDES_PATH = useLegacyOutput
  ? dataPath('overrides', 'epic-pools.ts')
  : datasetPath(datasetId, 'overrides', 'epic-pools.ts');

// Parse CLI args
const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');
const poolFilterIdx = args.indexOf('--pool');
const poolFilter = poolFilterIdx >= 0 ? args[poolFilterIdx + 1] : null;
const archFilterIdx = args.indexOf('--archetype');
const archFilter = archFilterIdx >= 0 ? args[archFilterIdx + 1] : null;

// ============================================
// LOAD EXISTING DATA (for preserving metadata)
// ============================================

function loadExistingPools() {
  // Try the layered generated/ output first; fall back to the old single-file
  // location so the first run after the layering switch still has access to
  // hand-tagged metadata (archetype, minLevel) that lived in epic-pools-raw.ts.
  for (const candidate of [OUTPUT_PATH, COMPOSED_PATH]) {
    try {
      const content = fs.readFileSync(candidate, 'utf-8');
      const match = content.match(/export\s+const\s+EPIC_POOLS_RAW\s*=\s*(\{[\s\S]*\})\s*(?:as\s+const)?\s*;?\s*$/);
      if (match) {
        return new Function('return ' + match[1])();
      }
    } catch (_) { /* try next */ }
  }
  return {};
}

// ============================================
// CONVERT A SINGLE EPIC POWER
// ============================================

function convertEpicPower(rawJson, rank, availableLevel) {
  const power = {};

  // Basic metadata
  power.name = rawJson.display_name || rawJson.name;
  power.fullName = rawJson.full_name;
  power.rank = rank;
  power.available = availableLevel;

  // Description & help
  power.description = rawJson.display_help || '';
  if (rawJson.display_short_help) {
    power.shortHelp = rawJson.display_short_help.replace(/\u00a0/g, ' ');
  }
  power.icon = normalizeIconPath(rawJson.icon || '');
  // Map bin's "GlobalBoost" to the planner's "Global Enhancement" type.
  power.powerType = rawJson.type === 'GlobalBoost' ? 'Global Enhancement' : (rawJson.type || 'Click');

  // Requires
  if (rawJson.requires && rawJson.requires !== '') {
    power.requires = rawJson.requires;
  } else {
    power.requires = '';
  }

  // Slots
  power.maxSlots = rawJson.max_boosts !== undefined && rawJson.max_boosts !== null
    ? rawJson.max_boosts : 6;

  // Allowed enhancements: bin export uses short names (BIN_BOOST_MAP);
  // CoD2 used long ones (BOOST_TYPE_MAP). Try both.
  const enhancements = (rawJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b] || BIN_BOOST_MAP[b])
    .filter(Boolean);
  power.allowedEnhancements = [...new Set(enhancements)].sort();

  // Allowed IO set categories — inferred from boost types (the bin parser's
  // allowed_boostset_cats field is broken; see PARSER_TODO.md). Epic powers
  // don't grant ATO categories, so pass 'epic' as both archetype and role.
  const hasTeleportAttrib = (rawJson.effects || []).some(eff =>
    (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'teleport')
  );
  power.allowedSetCategories = inferAllowedSetCategories(
    rawJson.boosts_allowed || [],
    'epic',
    'epic',
    EFFECT_AREA_MAP[rawJson.effect_area] ?? rawJson.effect_area,
    rawJson.range,
    rawJson.powerset || rawJson.full_name,
    hasTeleportAttrib,
  );

  // Effects object (legacy format: stats mixed in with effects)
  const effects = {};

  // Stats
  if (rawJson.accuracy) effects.accuracy = rawJson.accuracy;
  if (rawJson.range) effects.range = rawJson.range;
  if (rawJson.recharge_time) effects.recharge = rawJson.recharge_time;
  if (rawJson.endurance_cost) effects.endurance = rawJson.endurance_cost;
  if (rawJson.activation_time) effects.activationTime = rawJson.activation_time;
  if (rawJson.effect_area && rawJson.effect_area !== 'None') {
    // Bin format uses "Sphere" for what the planner calls "AoE"; normalize.
    effects.effectArea = EFFECT_AREA_MAP[rawJson.effect_area] ?? rawJson.effect_area;
  }
  if (rawJson.radius && rawJson.radius > 0) effects.radius = rawJson.radius;
  if (rawJson.arc && rawJson.arc > 0) effects.arc = rawJson.arc;
  if (rawJson.max_targets_hit && rawJson.max_targets_hit > 0) {
    effects.maxTargets = rawJson.max_targets_hit;
  }

  // Extract effects from raw JSON using recursive template collection
  if (rawJson.effects && rawJson.effects.length > 0) {
    const allTemplates = collectAllTemplates(rawJson.effects);

    // Damage
    const damage = extractDamage(allTemplates);
    if (damage) effects.damage = damage;

    // All other effects
    const extractedEffects = extractEffects(allTemplates);
    if (Object.keys(extractedEffects).length > 0) {
      for (const [key, value] of Object.entries(extractedEffects)) {
        effects[key] = value;
      }
    }
  }

  power.effects = effects;

  return power;
}

// ============================================
// POOL ID -> ARCHETYPE INFERENCE
// ============================================

// For pool IDs that aren't in the existing data, infer the archetype from the
// pool ID prefix (e.g. "blaster_dark_mastery" -> "blaster"). VEAT pools start
// with "veat_" and belong to the Arachnos archetypes. Shared/no-prefix pools
// (e.g. "cold_mastery") need an explicit archetype tag in the override layer.
const ARCHETYPE_PREFIXES = [
  'arachnos_soldier', 'arachnos_widow', 'peacebringer', 'warshade',
  'blaster', 'brute', 'controller', 'corruptor', 'defender', 'dominator',
  'mastermind', 'scrapper', 'sentinel', 'stalker', 'tanker',
];

function inferArchetypeFromPoolId(poolId) {
  if (poolId.startsWith('veat_')) return 'arachnos_soldier';
  for (const at of ARCHETYPE_PREFIXES) {
    if (poolId.startsWith(at + '_')) return at;
  }
  return ''; // unknown — needs override
}

// ============================================
// CONVERT A SINGLE EPIC POOL
// ============================================

function convertEpicPool(poolId, existingPool) {
  const poolPath = path.join(RAW_POWERS_PATH, poolId);
  if (!fs.existsSync(poolPath)) {
    console.error(`  Raw pool directory not found: ${poolPath}`);
    return null;
  }

  // Load pool index
  const indexPath = path.join(poolPath, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error(`  Pool index not found: ${indexPath}`);
    return null;
  }

  const poolIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Compatibility: bin export uses `powers` + `help`; CoD2 used
  // `power_names` + `display_help`. Normalize so the rest of this
  // function can use the CoD2 names.
  if (!poolIndex.power_names && poolIndex.powers) poolIndex.power_names = poolIndex.powers;
  if (!poolIndex.display_help && poolIndex.help) poolIndex.display_help = poolIndex.help;
  if (!poolIndex.display_short_help && poolIndex.short_help) poolIndex.display_short_help = poolIndex.short_help;

  // Build pool metadata — preserve archetype/minLevel from existing data,
  // use raw data for display info. When existing data is absent (fresh
  // discovery), infer archetype from the pool ID prefix.
  const pool = {
    id: poolId,
    name: poolIndex.display_name || (existingPool ? existingPool.name : poolId),
    displayName: poolIndex.display_name || (existingPool ? existingPool.displayName : poolId),
    archetype: existingPool ? existingPool.archetype : inferArchetypeFromPoolId(poolId),
    description: poolIndex.display_help || (existingPool ? existingPool.description : ''),
    icon: poolIndex.icon || (existingPool ? existingPool.icon : ''),
    requires: poolIndex.requires || '',
    minLevel: existingPool ? existingPool.minLevel : 35,
    powers: [],
  };

  // Get power order from index. Bin-export `powers` array is alphabetical
  // (CoD2 was game-pick order); sort by available_level so the displayed
  // pick order matches the in-game leveling sequence.
  const powerNames = poolIndex.power_names || [];
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
    const availableLevel = availableLevels[i] !== undefined ? availableLevels[i] : 34;
    collected.push({ rawJson, availableLevel, originalIndex: i });
  }

  collected.sort((a, b) => {
    if (a.availableLevel !== b.availableLevel) return a.availableLevel - b.availableLevel;
    return a.originalIndex - b.originalIndex;
  });

  collected.forEach((entry, idx) => {
    const power = convertEpicPower(entry.rawJson, idx + 1, entry.availableLevel);
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
  console.log(`=== CONVERT EPIC POOLS ${applyChanges ? '(APPLYING)' : '(DRY RUN)'} ===\n`);

  const existingPools = loadExistingPools();
  const existingIds = Object.keys(existingPools);

  // Discover pools on disk too — bin export may have added new pools that
  // aren't yet in the committed file. Union with existing IDs so the no-filter
  // run picks up everything.
  let discoveredIds = [];
  try {
    discoveredIds = fs.readdirSync(RAW_POWERS_PATH).filter((entry) => {
      const indexFile = path.join(RAW_POWERS_PATH, entry, 'index.json');
      return fs.existsSync(indexFile);
    });
  } catch (_) {
    // RAW_POWERS_PATH missing — fall through to existingIds
  }
  const allKnownIds = [...new Set([...existingIds, ...discoveredIds])].sort();

  // Determine which pools to convert
  let poolIds;
  if (poolFilter) {
    poolIds = [poolFilter];
  } else if (archFilter) {
    poolIds = allKnownIds.filter(id => {
      const at = existingPools[id]?.archetype || inferArchetypeFromPoolId(id);
      return at === archFilter;
    });
    console.log(`Filtering to archetype "${archFilter}": ${poolIds.length} pools\n`);
  } else {
    poolIds = allKnownIds;
  }

  const allPools = {};

  for (const poolId of poolIds) {
    console.log(`Converting ${poolId}...`);
    const existing = existingPools[poolId];
    const pool = convertEpicPool(poolId, existing);

    if (pool) {
      allPools[poolId] = pool;
      console.log(`  ${pool.powers.length} powers converted`);

      // Compare with existing
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

  // If filtering, merge with existing (unconverted pools keep existing data)
  if (poolFilter || archFilter) {
    for (const [id, pool] of Object.entries(existingPools)) {
      if (!allPools[id]) allPools[id] = pool;
    }
  }

  // Generate output
  const totalPowers = Object.values(allPools).reduce((sum, p) => sum + p.powers.length, 0);
  const byArchetype = {};
  for (const pool of Object.values(allPools)) {
    byArchetype[pool.archetype] = (byArchetype[pool.archetype] || 0) + 1;
  }

  let output = `/**\n`;
  output += ` * Raw Epic/Patron Pool data — GENERATED LAYER\n`;
  output += ` * Auto-generated from raw Homecoming JSON data.\n`;
  output += ` *\n`;
  output += ` * DO NOT EDIT THIS FILE DIRECTLY. Overrides live in\n`;
  output += ` * src/data/overrides/epic-pools.ts and are merged by the\n`;
  output += ` * composed facade at src/data/epic-pools-raw.ts.\n`;
  output += ` * Run: node scripts/convert-epic-pools.cjs --apply\n`;
  output += ` *\n`;
  output += ` * Total pools: ${Object.keys(allPools).length}\n`;
  output += ` * Total powers: ${totalPowers}\n`;
  output += ` * Archetypes: ${JSON.stringify(byArchetype)}\n`;
  output += ` */\n\n`;
  output += `export const EPIC_POOLS_RAW = ${serializeValue(allPools, 0)};\n`;

  if (applyChanges) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.mkdirSync(path.dirname(OVERRIDES_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, output);
    console.log(`\nWritten to ${OUTPUT_PATH}`);
    console.log(`${Object.keys(allPools).length} pools, ${totalPowers} powers`);

    // Scaffold overrides + composed if missing (atomic: both or neither).
    if (!fs.existsSync(OVERRIDES_PATH) && !fs.existsSync(COMPOSED_PATH)) {
      fs.writeFileSync(OVERRIDES_PATH, `/**
 * Epic/Patron Pool overrides — hand-written deltas keyed by a power's
 * \`fullName\`. The composed facade (src/data/epic-pools-raw.ts) merges
 * each entry into its matching generated power via \`withOverrides\`.
 *
 * Empty record means no overrides. Add entries here when the stale
 * CoD2 raw extraction disagrees with current HC game values. See
 * src/data/README.md for the layering convention.
 */
import type { Power } from '@/types';

export const EPIC_POOL_OVERRIDES: Record<string, Partial<Power>> = {};
`);
      fs.writeFileSync(COMPOSED_PATH, `/**
 * Epic/Patron Pool data — COMPOSED FACADE
 *
 * Merges the auto-generated extraction with hand-written per-power
 * overrides. The planner imports from here; see src/data/README.md.
 *
 * To re-generate the base data:
 *   node scripts/convert-epic-pools.cjs --apply
 */
import { applyAggregateOverrides } from './_layer';
import { EPIC_POOLS_RAW as base } from './generated/epic-pools';
import { EPIC_POOL_OVERRIDES } from './overrides/epic-pools';

export const EPIC_POOLS_RAW = applyAggregateOverrides(base, EPIC_POOL_OVERRIDES);
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
