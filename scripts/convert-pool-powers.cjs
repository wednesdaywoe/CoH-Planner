/**
 * Convert Pool Powers from raw Homecoming JSON data
 *
 * Reads raw JSON from raw_data_homecoming/powers/pool/ and generates
 * the POWER_POOLS_RAW object for src/data/power-pools-raw.ts.
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
  loadDefSuppressionMap,
  collectAllTemplates,
  RAW_DATA_PATH,
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
// Layered output (see src/data/README.md):
//   - OUTPUT_PATH: the auto-extracted data lives here, overwritten on --apply
//   - COMPOSED_PATH: hand-edit-safe facade that merges in overrides
//   - OVERRIDES_PATH: scaffolded once, holds any per-power deltas
const OUTPUT_PATH = path.resolve('./src/data/generated/power-pools.ts');
const COMPOSED_PATH = path.resolve('./src/data/power-pools-raw.ts');
const OVERRIDES_PATH = path.resolve('./src/data/overrides/power-pools.ts');

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
const POOL_DIR_MAP = {
  experimentation: 'experimentation',
  fighting: 'fighting',
  fitness: 'fitness',
  flight: 'flight',
  force_of_will: 'force_of_will',
  invisibility: 'invisibility',
  leadership: 'leadership',
  leaping: 'leaping',
  presence: 'manipulation',
  medicine: 'medicine',
  sorcery: 'sorcery',
  speed: 'speed',
  teleportation: 'teleportation',
};

// Pool display names
const POOL_DISPLAY_NAMES = {
  experimentation: 'Experimentation',
  fighting: 'Fighting',
  fitness: 'Fitness',
  flight: 'Flight',
  force_of_will: 'Force of Will',
  invisibility: 'Concealment',
  leadership: 'Leadership',
  leaping: 'Leaping',
  presence: 'Presence',
  medicine: 'Medicine',
  sorcery: 'Sorcery',
  speed: 'Speed',
  teleportation: 'Teleportation',
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
  power.rank = rank;
  power.available = availableLevel;

  // Description & help
  power.description = rawJson.display_help || '';
  if (rawJson.display_short_help) {
    power.shortHelp = rawJson.display_short_help.replace(/\u00a0/g, ' ');
  }
  power.icon = rawJson.icon || '';
  power.powerType = rawJson.type || 'Click';

  // Requires
  if (rawJson.requires && rawJson.requires !== '') {
    power.requires = rawJson.requires;
  } else {
    power.requires = '';
  }

  // Slots
  power.maxSlots = rawJson.max_boosts !== undefined && rawJson.max_boosts !== null
    ? rawJson.max_boosts : 6;

  // Allowed enhancements (using BOOST_TYPE_MAP)
  const enhancements = (rawJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b])
    .filter(Boolean);
  power.allowedEnhancements = [...new Set(enhancements)].sort();

  // Allowed set categories (using SET_CATEGORY_MAP)
  power.allowedSetCategories = (rawJson.allowed_boostset_cats || [])
    .map(c => SET_CATEGORY_MAP[c] || c);

  // Effects object (legacy format: stats mixed in with effects)
  const effects = {};

  // Stats
  if (rawJson.accuracy) effects.accuracy = rawJson.accuracy;
  if (rawJson.range) effects.range = rawJson.range;
  if (rawJson.recharge_time) effects.recharge = rawJson.recharge_time;
  if (rawJson.endurance_cost) effects.endurance = rawJson.endurance_cost;
  if (rawJson.activation_time) effects.activationTime = rawJson.activation_time;
  if (rawJson.effect_area && rawJson.effect_area !== 'None') {
    effects.effectArea = rawJson.effect_area;
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

    // Combat-suppression metadata from .def files (used to split stealth defense
    // into defenseBuff / defenseBuffSuppressible).
    const defEntries = loadDefSuppressionMap(rawJson.full_name);

    // All other effects
    const extractedEffects = extractEffects(allTemplates, rawJson.name, defEntries);
    if (Object.keys(extractedEffects).length > 0) {
      // Merge extracted effects into the effects object
      // Map certain effect keys to legacy naming for the transformation layer
      for (const [key, value] of Object.entries(extractedEffects)) {
        effects[key] = value;
      }
    }
  }

  power.effects = effects;

  return power;
}

// ============================================
// CONVERT A POOL
// ============================================

function convertPool(poolId) {
  const rawDir = POOL_DIR_MAP[poolId];
  if (!rawDir) {
    console.error(`No raw directory mapping for pool: ${poolId}`);
    return null;
  }

  const poolPath = path.join(RAW_POWERS_PATH, rawDir);
  if (!fs.existsSync(poolPath)) {
    console.error(`Raw pool directory not found: ${poolPath}`);
    return null;
  }

  // Load pool index
  const indexPath = path.join(poolPath, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error(`Pool index not found: ${indexPath}`);
    return null;
  }

  const poolIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Build pool metadata from index
  const pool = {
    id: poolId,
    name: POOL_DISPLAY_NAMES[poolId] || poolId,
    displayName: POOL_DISPLAY_NAMES[poolId] || poolId,
    description: poolIndex.description || poolIndex.display_help || '',
    icon: poolIndex.icon || '',
    requires: poolIndex.requires || '',
    powers: [],
  };

  // Get power order from index. Old (CoD2) layout used `power_names`; the new
  // bin-export layout uses `powers`. Probe both.
  const powerNames = poolIndex.power_names || poolIndex.powers || [];
  const availableLevels = poolIndex.available_level || [];

  for (let i = 0; i < powerNames.length; i++) {
    const fullName = powerNames[i];
    // Extract power file name from full name: "Pool.Fighting.Boxing" → "boxing.json"
    const parts = fullName.split('.');
    const powerFile = parts[parts.length - 1].toLowerCase() + '.json';
    const filePath = path.join(poolPath, powerFile);

    if (!fs.existsSync(filePath)) {
      console.warn(`  Power file not found: ${powerFile} (from ${fullName})`);
      continue;
    }

    const rawJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const rank = i + 1;
    const availableLevel = availableLevels[i] || 0;
    const power = convertPoolPower(rawJson, rank, availableLevel);
    pool.powers.push(power);
  }

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
  console.log(`=== CONVERT POOL POWERS ${applyChanges ? '(APPLYING)' : '(DRY RUN)'} ===\n`);

  const existingPools = loadExistingPools();
  const poolIds = poolFilter ? [poolFilter] : Object.keys(POOL_DIR_MAP);
  const allPools = {};

  for (const poolId of poolIds) {
    console.log(`Converting ${poolId}...`);
    const pool = convertPool(poolId);

    if (pool) {
      allPools[poolId] = pool;
      console.log(`  ${pool.powers.length} powers converted`);

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
      fs.writeFileSync(COMPOSED_PATH, `/**
 * Power Pool data — COMPOSED FACADE
 *
 * Merges the auto-generated extraction with hand-written per-power
 * overrides. The planner imports from here; see src/data/README.md.
 *
 * To re-generate the base data:
 *   node scripts/convert-pool-powers.cjs --apply
 */
import { applyAggregateOverrides } from './_layer';
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
