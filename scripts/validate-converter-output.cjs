/**
 * DSH3 (SC-2) — converter effect-collapse detector.
 *
 * Reads the committed parser export (`exported_powers/`, the converter INPUT) and
 * the committed generated data (the converter OUTPUT), and checks that compound
 * game effects survived conversion instead of collapsing into a single slot.
 *
 * The whole "collapse" bug family (PvE/PvP clobber, resistible/unresistable
 * pair-collapse, multi-type merge, duration-variant loss) shares ONE root cause:
 * convert-powerset models a power as a bag of ~90 named single-value slots
 * (last-write-wins), while the game/parser model it as a flat array of atomic
 * effect records. See DEDUCTIVE_SCHEMA_HARNESS.md.
 *
 * Two tiers:
 *
 *   GATE (hard fail) — RESISTIBLE-TWIN REGRESSION. HC splits many debuffs into a
 *   resistible + an IgnoreResistance template that are otherwise identical
 *   (attrib/aspect/table/scale/duration). Both apply in game; the bag-of-slots
 *   model would drop or double one. The converter detects these twins and stamps
 *   the survivor `unresistable: true` (convert-powerset.cjs:3403-3452). This gate
 *   mirrors that EXACT detection on the input: if a power has a debuff twin, its
 *   generated output MUST contain `unresistable` — else the fix regressed. This is
 *   the precise class fixed 2026-07-05; the gate keeps it fixed.
 *
 *   REPORT (informational, never fails) — COLLAPSE RISK. Per power, sibling
 *   templates that share (attribs, aspect) but differ in table/scale/pvMode/
 *   resistibility are effects the single-slot model cannot represent losslessly.
 *   A fully-general per-slot detector needs the converter's attrib→slot routing
 *   map (the output has already discarded the attrib identity) — that lands with
 *   the DSH4 schema + DSH6 converter rework. Until then this surfaces the family
 *   for triage without asserting every case is a bug.
 *
 * Usage:
 *   node scripts/validate-converter-output.cjs [--dataset <id>] [--gate] [--limit N]
 *     --dataset <id>   homecoming (default) | rebirth | thunderspy
 *     --gate           CI mode: suppress the report, print one PASS/FAIL line,
 *                      exit 1 on any gate failure
 *     --limit N        cap the risk-report rows printed (default 40)
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, datasetPath } = require('./_dataset-paths.cjs');

const args = process.argv.slice(2);
const GATE = args.includes('--gate');
const LIMIT = (() => {
  const i = args.indexOf('--limit');
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : 40;
})();
const datasetId = parseDatasetArg();

// ---- input (exported_powers) + output (generated) roots ----
const RAW_BASE = path.join(__dirname, '..', 'exported_powers');
const INPUT_ROOT =
  datasetId === 'homecoming' && !fs.existsSync(path.join(RAW_BASE, datasetId))
    ? RAW_BASE
    : path.join(RAW_BASE, datasetId);
const GENERATED_ROOT = path.join(
  path.dirname(datasetPath(datasetId, 'at-tables.ts')),
  'generated',
  'powersets',
);

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// The 13 core archetypes whose input category prefix maps 1:1 to a generated
// `/powersets/<archetype>/` tree, so an input power can be matched to its exact
// output. The twin GATE is restricted to these: a power's category is
// `<Archetype>_<Role>` (Defender_Buff, Dominator_Control, …), so the archetype is
// the first token. Everything else — pseudo-pets (Pets.*), cross-AT Pool/Epic/
// Inherent/Incarnate (single-object files), Mission_Maker, VEAT Teamwork/Widow —
// either has no per-AT output or an ambiguous name, so it is NOT gated (its debuff
// twins ride a different representation path, e.g. the summon subtree). This is
// what let the Dimension_Shift pseudo-pet false-positive slip in.
const GATED_ARCHETYPES = new Set([
  'blaster', 'brute', 'controller', 'corruptor', 'defender', 'dominator',
  'mastermind', 'scrapper', 'sentinel', 'stalker', 'tanker',
  'peacebringer', 'warshade',
]);
const archOfCategory = (fullName) => (fullName || '').split('.')[0].split('_')[0].toLowerCase();
const archOfOutputPath = (rel) => rel.replace(/\\/g, '/').match(/(?:^|\/)powersets\/([^/]+)\//)?.[1] || '';

// ---- twin detection — mirrors extractEffects (convert-powerset.cjs:3422-3452) ----
const isTwinDebuff = (t) =>
  (t.scale || 0) < 0 || (t.table || '').toLowerCase().includes('debuff');
const twinSig = (t) =>
  `${(t.attribs || []).map((a) => (a || '').toLowerCase()).sort().join(',')}|` +
  `${(t.aspect || '').toLowerCase()}|${t.table}|` +
  `${(t.scale || 0).toFixed(4)}|${t.duration || ''}`;

/** Flatten every template in a power's effect tree, skipping PVP_ONLY groups
 * (collectTemplatesDeep drops the `player eq`/PvP group before extractEffects). */
function flattenTemplates(groups, out = []) {
  for (const g of groups || []) {
    if (g.is_pvp === 'PVP_ONLY') continue;
    for (const t of g.templates || []) out.push(t);
    if (g.child_effects) flattenTemplates(g.child_effects, out);
  }
  return out;
}

/** True if the power's input has a resistible+unresistable debuff twin. */
function hasResistibleTwin(power) {
  const templates = flattenTemplates(power.effects);
  const seen = {};
  for (const t of templates) {
    if (!t.attribs || t.attribs.length === 0 || !isTwinDebuff(t)) continue;
    const sig = twinSig(t);
    if (!seen[sig]) seen[sig] = { res: false, unres: false };
    if ((t.flags || []).includes('IgnoreResistance')) seen[sig].unres = true;
    else seen[sig].res = true;
  }
  return Object.values(seen).some((s) => s.res && s.unres);
}

/** Per-power collapse-risk groups: ≥2 siblings sharing (attribs, aspect) but
 * differing in table/scale/pvMode/resistibility. Damage rides a multi-entry
 * array (not collapsed), so exclude pure damage attribs from the risk signal. */
function collapseRiskGroups(power) {
  const families = {};
  for (const g of power.effects || []) {
    const pv = g.is_pvp || 'EITHER';
    for (const t of g.templates || []) {
      if (!t.attribs || t.attribs.length === 0) continue;
      const famKey = `${t.attribs.map((a) => (a || '').toLowerCase()).sort().join(',')}|${(t.aspect || '').toLowerCase()}`;
      const identity = `${t.table}|${(t.scale || 0).toFixed(4)}|${pv}|${(t.flags || []).includes('IgnoreResistance') ? 'unres' : 'res'}`;
      (families[famKey] ||= new Set()).add(identity);
    }
  }
  return Object.entries(families)
    .filter(([, ids]) => ids.size >= 2)
    .map(([fam, ids]) => ({ family: fam, distinct: ids.size }));
}

// ---- index the generated output: internalName -> { hasUnresistable, relPath } ----
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.ts') && e.name !== 'index.ts') out.push(p);
  }
  return out;
}
// Keyed by `<archetype>|<normInternalName>` so same-named powers across ATs
// (Dimension_Shift exists for both controller and dominator) don't collide.
const outputIndex = new Map();
for (const f of walk(GENERATED_ROOT)) {
  const text = fs.readFileSync(f, 'utf8');
  const internal = text.match(/"internalName":\s*"([^"]+)"/)?.[1];
  if (!internal) continue;
  const rel = path.relative(path.dirname(GENERATED_ROOT), f).replace(/\\/g, '/');
  outputIndex.set(`${archOfOutputPath(rel)}|${norm(internal)}`, {
    hasUnresistable: text.includes('"unresistable"'),
    rel,
  });
}

// ---- iterate the input powers ----
function inputPowerFiles(root, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, e.name);
    if (e.isDirectory()) inputPowerFiles(p, out);
    else if (e.name.endsWith('.json') && e.name !== 'index.json') out.push(p);
  }
  return out;
}

const twinRegressions = [];
const unmatchedTwins = [];
const riskRows = [];
let inputCount = 0;

for (const f of inputPowerFiles(INPUT_ROOT)) {
  let power;
  try {
    power = JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    continue;
  }
  if (!Array.isArray(power.effects)) continue;
  inputCount++;

  const arch = archOfCategory(power.full_name);
  const out = outputIndex.get(`${arch}|${norm(power.name)}`);

  // GATE — only for the core-AT categories with an unambiguous per-AT output.
  // Pseudo-pets / pools / mission-maker are not gated (their twins live on a
  // different path); count them as skipped rather than flagging blindly.
  if (hasResistibleTwin(power)) {
    if (!GATED_ARCHETYPES.has(arch) || !out) unmatchedTwins.push(power.full_name || power.name);
    else if (!out.hasUnresistable) twinRegressions.push({ name: power.full_name || power.name, rel: out.rel });
  }

  const risk = collapseRiskGroups(power);
  if (risk.length && out) {
    riskRows.push({ name: power.full_name || power.name, groups: risk.length, rel: out.rel });
  }
}

// ---- output ----
riskRows.sort((a, b) => b.groups - a.groups);

if (!GATE) {
  console.log(`\n=== DSH3 converter collapse detector — dataset: ${datasetId} ===`);
  console.log(`Scanned ${inputCount} input powers; indexed ${outputIndex.size} generated outputs.\n`);

  console.log(`=== GATE: resistible-twin regressions (${twinRegressions.length}) ===`);
  if (twinRegressions.length === 0) {
    console.log('  none — every input debuff twin is represented as `unresistable` in output.');
  } else {
    for (const r of twinRegressions) console.log(`  COLLAPSE  ${r.name}  (${r.rel})`);
  }
  if (unmatchedTwins.length) {
    console.log(`\n  (${unmatchedTwins.length} twin-bearing input powers had no matched output — not player-relevant / filtered; not gated.)`);
  }

  console.log(`\n=== REPORT: collapse-risk groups (informational, top ${LIMIT} of ${riskRows.length}) ===`);
  for (const r of riskRows.slice(0, LIMIT)) {
    console.log(`  ${String(r.groups).padStart(3)} group(s)  ${r.name}  (${r.rel})`);
  }
  if (riskRows.length > LIMIT) console.log(`  … ${riskRows.length - LIMIT} more.`);
  console.log('');
}

if (twinRegressions.length === 0) {
  console.log(`GATE PASS — no resistible-twin collapse regressions (${datasetId}).`);
} else {
  console.log(`GATE FAIL — ${twinRegressions.length} resistible-twin collapse regression(s) in ${datasetId}. Regenerate the affected powers; do not hand-edit generated output.`);
}
process.exit(twinRegressions.length > 0 ? 1 : 0);
