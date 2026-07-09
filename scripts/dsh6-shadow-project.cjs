/**
 * DSH6 Phase 0b — shadow comparator: projection vs the live bag.
 *
 * For every power in a dataset's committed `exported_powers/` tree, runs BOTH
 * pipelines over the same collected template list:
 *
 *   bag  = extractEffects(templates)                        — the live routing
 *   proj = projectAtomsToEffects(templatesToAtoms(templates)) — the DSH6 shadow
 *
 * and requires them to be semantically identical after canonicalization
 * (sorted-key deep JSON; `summon`/`conditionalEntities` excluded — entity
 * creation stays template-owned per the Phase 0 plan). Because the projection
 * processes atoms in template order, float accumulation order matches and the
 * comparison can be exact, not tolerance-based.
 *
 * NB `templatesToAtoms` must run BEFORE `extractEffects` — the bag's twin
 * pre-scan mutates the template objects (`_unresistableTwin`).
 *
 * Read-only; never writes to generated/.
 *
 * Usage:
 *   node scripts/dsh6-shadow-project.cjs                      # HC
 *   node scripts/dsh6-shadow-project.cjs --dataset rebirth
 *   node scripts/dsh6-shadow-project.cjs --dataset thunderspy
 *   node scripts/dsh6-shadow-project.cjs --power Call_Depths  # filter + dump
 */

const fs = require('fs');
const path = require('path');
// NB Phase 1 flipped extractEffects to the projection; the harness now
// compares against the retained LEGACY routing (extractEffectsLegacy).
const {
  collectAllTemplates, templatesToAtoms, projectAtomsToEffects,
  extractEffectsLegacy: extractEffects,
  RAW_DATA_PATH, CATEGORY_MAP,
} = require('./convert-powerset.cjs');

const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const POWER_FILTER = argVal('--power');
const MAX_REPORT = 40;

// Canonical form: sorted keys, drop excluded slots, keep exact numbers.
const EXCLUDED = new Set(['summon', 'conditionalEntities']);
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) {
      if (value[k] === undefined) continue;
      out[k] = canonical(value[k]);
    }
    return out;
  }
  return value;
}
function canonicalBag(bag) {
  const copy = {};
  for (const k of Object.keys(bag)) {
    if (EXCLUDED.has(k)) continue;
    copy[k] = bag[k];
  }
  return JSON.stringify(canonical(copy), null, 1);
}

const stats = { powers: 0, identical: 0, diffs: [] };

function checkPower(powerJson, file) {
  if (POWER_FILTER && !(powerJson.name || '').includes(POWER_FILTER)
      && !file.includes(POWER_FILTER)) return;
  const templates = collectAllTemplates(powerJson.effects || []);
  const atoms = templatesToAtoms(templates);            // BEFORE extractEffects
  const proj = projectAtomsToEffects(atoms, powerJson.name);
  const bag = extractEffects(templates, powerJson.name);

  stats.powers++;
  const cBag = canonicalBag(bag);
  const cProj = canonicalBag(proj);
  if (cBag === cProj) { stats.identical++; }
  else stats.diffs.push({ file, power: powerJson.name, cBag, cProj });

  if (POWER_FILTER) {
    console.log(`\n=== ${powerJson.name} (${file}) ===`);
    console.log('--- bag ---\n' + cBag);
    console.log('--- projection ---\n' + cProj);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.json') && !entry.name.startsWith('_')
             && entry.name !== 'index.json') {
      let json;
      try { json = JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (_) { continue; }
      if (json && json.effects) checkPower(json, path.relative(RAW_DATA_PATH, p));
    }
  }
}

for (const category of Object.keys(CATEGORY_MAP)) {
  const dir = path.join(RAW_DATA_PATH, category);
  if (fs.existsSync(dir)) walk(dir);
}

console.log(`\nDSH6 shadow projection comparator (${RAW_DATA_PATH})`);
console.log(`  powers checked:  ${stats.powers}`);
console.log(`  identical:       ${stats.identical}`);
console.log(`  diverging:       ${stats.diffs.length}`);

if (stats.diffs.length > 0) {
  console.log(`\nDIVERGENCES (first ${MAX_REPORT}):`);
  for (const d of stats.diffs.slice(0, MAX_REPORT)) {
    console.log(`\n### ${d.power}  [${d.file}]`);
    // compact line-level diff
    const a = d.cBag.split('\n'), b = d.cProj.split('\n');
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (a[i] !== b[i]) {
        console.log(`  bag : ${a[i] ?? '<eof>'}`);
        console.log(`  proj: ${b[i] ?? '<eof>'}`);
      }
    }
  }
  process.exit(1);
}
console.log('OK — projection reproduces the bag for every power.');
