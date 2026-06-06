/**
 * Convert binary-sourced archetype stats → archetype-stats.generated.ts
 *
 * Reads the per-archetype `attribs` block (HP curve, HP-cap curve, resistance
 * cap) that `tools/bin-crawler/bin_crawler/export_classes.py` writes into
 * `exported_powers/tables/<at>.json`, and emits a TypeScript map the hand-
 * curated `archetypes.ts` spreads into each AT's `stats`. This replaces the
 * drift-prone hand-typed HP tables / baseHP / maxHP / resistanceCap with
 * values derived straight from the game binary (a stale HP table can no longer
 * silently diverge from the live game — it regenerates).
 *
 * Phase 1 (classes.bin core): HP curve, HP cap, resistance cap. The remaining
 * AT scalars (damageModifier, damageCap, buffDebuffModifier, baseThreat,
 * baseEndurance, baseRecovery, defenseCap) stay hand-curated in archetypes.ts
 * — they live in other binary artifacts (damage tables, inherent powers) or
 * are stable design constants. See ARCHETYPE-DEFS-BINARY-SOURCING.md.
 *
 * Usage: node scripts/convert-archetypes.cjs [--dataset <id>]
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, datasetPath } = require('./_dataset-paths.cjs');

const datasetId = parseDatasetArg();

// Mirror extract-at-tables.cjs: HC ships flat (exported_powers/tables/), other
// datasets are namespaced (exported_powers/<id>/tables/).
const RAW_DATA_BASE = path.join(__dirname, '..', 'exported_powers');
const RAW_DATA_PATH = (datasetId === 'homecoming' && !fs.existsSync(path.join(RAW_DATA_BASE, datasetId, 'tables')))
  ? path.join(RAW_DATA_BASE, 'tables')
  : path.join(RAW_DATA_BASE, datasetId, 'tables');

const OUTPUT_PATH = datasetPath(datasetId, 'generated', 'archetype-stats.generated.ts');

// Player archetypes (file stem in tables/). Underscore form; the generated key
// is hyphenated to match the archetypes.ts ids (e.g. 'arachnos-soldier'). This
// is the UNION across datasets — `sentinel` is HC-only and `guardian` is
// Rebirth-only; each dataset's export simply lacks the other (warn + skip).
const PLAYER_ARCHETYPES = [
  'blaster', 'brute', 'controller', 'corruptor', 'defender', 'dominator',
  'guardian', 'mastermind', 'scrapper', 'sentinel', 'stalker', 'tanker',
  'peacebringer', 'warshade', 'arachnos_soldier', 'arachnos_widow',
];

const PLAYER_LEVELS = 50; // levels 1-50

/** Round to 4 decimals (the hand-port's precision) and drop float32 fuzz. */
function r4(n) {
  return Math.round(n * 1e4) / 1e4;
}

function extract() {
  const out = {};
  for (const at of PLAYER_ARCHETYPES) {
    const file = path.join(RAW_DATA_PATH, `${at}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`Warning: ${at}.json not found`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const a = data.attribs;
    if (!a || !Array.isArray(a.hit_points) || !Array.isArray(a.hp_cap)) {
      console.warn(`Warning: ${at} has no attribs block (parser/export gap) — skipping`);
      continue;
    }
    const hpTable = a.hit_points.slice(0, PLAYER_LEVELS).map(r4);
    const hpCapTable = a.hp_cap.slice(0, PLAYER_LEVELS).map(r4);
    if (hpTable.length !== PLAYER_LEVELS || hpCapTable.length !== PLAYER_LEVELS) {
      console.warn(`Warning: ${at} HP curve length ${hpTable.length}/${hpCapTable.length} (expected ${PLAYER_LEVELS}) — skipping`);
      continue;
    }
    const key = at.replace(/_/g, '-');
    out[key] = {
      baseHP: hpTable[PLAYER_LEVELS - 1],
      maxHP: hpCapTable[PLAYER_LEVELS - 1],
      resistanceCap: r4(a.resistance_cap),
      hpTable,
      hpCapTable,
    };
    console.log(`  ${key}: baseHP=${out[key].baseHP} maxHP=${out[key].maxHP} resCap=${out[key].resistanceCap}`);
  }
  return out;
}

function fmtArray(arr) {
  const perLine = 10;
  const lines = ['['];
  for (let i = 0; i < arr.length; i += perLine) {
    const chunk = arr.slice(i, i + perLine).join(', ');
    lines.push(`      ${chunk}${i + perLine < arr.length ? ',' : ''}`);
  }
  lines.push('    ]');
  return lines.join('\n');
}

function generate(stats) {
  const L = [];
  L.push('/**');
  L.push(' * Archetype binary-sourced stats — AUTO-GENERATED, DO NOT EDIT.');
  L.push(' *');
  L.push(' * Source: exported_powers/tables/<at>.json `attribs` block (from');
  L.push(' * classes.bin via export_classes.py). Regenerate with:');
  L.push(` *   node scripts/convert-archetypes.cjs --dataset ${datasetId}`);
  L.push(' *');
  L.push(' * Spread into each archetype\'s `stats` in archetypes.ts. Phase 1 fields:');
  L.push(' * HP curve, HP cap, baseHP/maxHP (level 50), resistance cap.');
  L.push(' */');
  L.push('');
  L.push('export interface ArchetypeBinaryStats {');
  L.push('  baseHP: number;');
  L.push('  maxHP: number;');
  L.push('  resistanceCap: number;');
  L.push('  hpTable: number[];');
  L.push('  hpCapTable: number[];');
  L.push('}');
  L.push('');
  L.push('export const ARCHETYPE_BINARY_STATS: Record<string, ArchetypeBinaryStats> = {');
  for (const [key, s] of Object.entries(stats)) {
    L.push(`  '${key}': {`);
    L.push(`    baseHP: ${s.baseHP},`);
    L.push(`    maxHP: ${s.maxHP},`);
    L.push(`    resistanceCap: ${s.resistanceCap},`);
    L.push(`    hpTable: ${fmtArray(s.hpTable)},`);
    L.push(`    hpCapTable: ${fmtArray(s.hpCapTable)},`);
    L.push('  },');
  }
  L.push('};');
  L.push('');
  return L.join('\n');
}

console.log(`Converting archetype stats (dataset: ${datasetId})...`);
const stats = extract();
const count = Object.keys(stats).length;
if (count === 0) {
  // No attribs in this dataset's export yet. Homecoming (Parse7) carries them;
  // Rebirth (Parse6) attrib extraction is not implemented yet, so skip rather
  // than fail the regen pipeline. Correctness of HC is guarded by
  // src/data/archetype-stats.test.ts (which reads the export directly), so a
  // genuine HC attrib regression surfaces there, not here.
  console.warn(`No archetype attribs in ${RAW_DATA_PATH} — skipping (expected for datasets without Parse7 attrib support).`);
  process.exit(0);
}
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, generate(stats));
console.log(`\nWrote ${OUTPUT_PATH} (${count} archetypes)`);
