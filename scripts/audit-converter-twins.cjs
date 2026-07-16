/**
 * A4 — parallel-converter twin diff (data-integrity audit, GAME-DATA-PRINCIPLES §5).
 *
 * The same underlying game power often ships through TWO converter paths: a powerset
 * copy via convert-powerset (Blaster Dark Blast's Moonbeam) and a pool/epic copy via
 * convert-pool-powers / convert-epic-pools (epic Moonbeam). Each path is the other's
 * free oracle: "same data shape, two code paths, one answer each." Epic Soul Drain
 * shipping FLAT (perTarget lost) and six epic snipes shipping with NO damage were both
 * this class — invisible from inside either converter, obvious the moment you diff them.
 *
 * Comparison is SHAPE-level, not value-level: the set of (effectType|subType) families
 * present in each side's decoded atoms, plus whether a family carries perTarget. Scales
 * and tables legitimately differ across paths (AT modifier tables), so values are noise
 * here; a whole missing family (epic side has no Damage; pool side lost perTarget on
 * ToHit) is the dead-snipe / flat-Soul-Drain signal.
 *
 * READ DIVERGENCES AS FINDINGS, NOT FAILURES — same-name powers can be genuinely
 * different powers. Each hit needs a human eyeball; the report ranks the alarming
 * classes first (missing Damage > missing perTarget > other family gaps).
 *
 * Usage:
 *   node scripts/audit-converter-twins.cjs [--dataset homecoming] [--json out.json]
 */

require('tsx/cjs');
const path = require('path');
const fs = require('fs');
const { sweepDataset } = require('./planb-shadow-sweep.cjs');
const { decodeAtoms } = require('../src/data/core/atomic-effect.ts');

const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const JSON_OUT = argVal('--json');
const DATASETS = (() => {
  const picked = argv.flatMap((a, i) => (a === '--dataset' && argv[i + 1] ? [argv[i + 1]] : []));
  return picked.length ? picked : ['homecoming', 'rebirth', 'thunderspy'];
})();

/** Which converter produced this module, from its generated-tree location. */
function sourceOf(rel) {
  if (rel.includes(`${path.sep}powersets${path.sep}`)) return 'powerset';
  if (rel.endsWith('power-pools.ts')) return 'pool';
  if (rel.endsWith('epic-pools.ts')) return 'epic';
  if (rel.endsWith('incarnate-effects.ts')) return 'incarnate';
  return 'other';
}

/**
 * Shape signature, split by the `gated` verdict. Only BASE families are compared for
 * findings: gated conditionals (the Fiery Embrace rider block, stance variants, PvP
 * copies) legitimately differ between a powerset copy and its pool/epic twin, because
 * the gate's precondition (e.g. owning Fiery Aura) differs by context. Gated diffs are
 * counted informationally, never as findings.
 *
 * `baseProbability === 0` counts as gated too: HC's chance-0 gating carries riders
 * (the FE fire tick on every FA-adjacent melee attack) as present-but-inert templates
 * whose chance a mechanic flips at runtime — they are conditionals wearing a
 * probability field instead of a requires expression.
 */
function signature(power) {
  const atoms = decodeAtoms(power.atoms || []);
  const base = new Set();
  const gated = new Set();
  for (const a of atoms) {
    // §3 strength meta-template: aspect=Str + scale=0 rows are the engine's
    // strength-DEFINITION bookkeeping, not effects — never part of a power's shape.
    if (a.aspect === 'Str' && a.scale === 0) continue;
    const fam = `${a.effectType}|${a.subType || ''}`;
    const target = a.gated || a.baseProbability === 0 ? gated : base;
    target.add(fam);
    if (a.perTarget != null) target.add(`${fam}|PT`);
  }
  return { base, gated };
}

const lastSeg = (s) => (s || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]+/g, '_');

let report = {};
for (const dataset of DATASETS) {
  // twinKey -> source -> { families:Set, count, atomless, examples:[] }
  const index = new Map();
  let total = 0;
  sweepDataset(dataset, (power, rel) => {
    const src = sourceOf(rel);
    if (src === 'other') return;
    total += 1;
    const key = lastSeg(power.internalName || power.name);
    if (!key) return;
    if (!index.has(key)) index.set(key, new Map());
    const perSrc = index.get(key);
    if (!perSrc.has(src)) perSrc.set(src, { copies: [], count: 0, atomless: 0, examples: [] });
    const slot = perSrc.get(src);
    slot.count += 1;
    if (!Array.isArray(power.atoms) || power.atoms.length === 0) slot.atomless += 1;
    slot.copies.push(signature(power));
    if (slot.examples.length < 3) slot.examples.push(power.internalName || power.name);
  });

  // Reference "must-have" base families for a source = the INTERSECTION of its copies'
  // base sets (a family EVERY powerset copy carries). Union-referencing inflates
  // "missing" whenever a last-segment key collides across genuinely different powers
  // (two different Power Sinks), because the union carries the superset's families.
  const mustHave = (slot) =>
    slot.copies.length === 0
      ? new Set()
      : slot.copies.map((s) => s.base).reduce((acc, s) => new Set([...acc].filter((f) => s.has(f))));
  const anyHave = (slot) => new Set(slot.copies.flatMap((s) => [...s.base]));
  const gatedAny = (slot) => new Set(slot.copies.flatMap((s) => [...s.gated]));

  const findings = [];
  let twinKeys = 0;
  for (const [key, perSrc] of index) {
    const srcs = [...perSrc.keys()].filter((s) => s !== 'incarnate'); // incarnates emit no atoms yet (known)
    if (srcs.length < 2) continue;
    twinKeys += 1;
    // powerset side is the reference where present; otherwise compare pairwise.
    const refName = perSrc.has('powerset') ? 'powerset' : srcs[0];
    const ref = perSrc.get(refName);
    const refMust = mustHave(ref);
    const refAny = anyHave(ref);
    for (const src of srcs) {
      if (src === refName) continue;
      const cand = perSrc.get(src);
      if (cand.atomless > 0 && refAny.size > 0) {
        findings.push({ key, cls: 'ATOMLESS', src, detail: `${cand.atomless}/${cand.count} copies have no atoms`, examples: cand.examples });
        continue;
      }
      const candAll = anyHave(cand);
      // missing: a family EVERY reference copy has, that NO candidate copy has.
      const missing = [...refMust].filter((f) => !candAll.has(f));
      // extra: a family the candidate has that no reference copy has at all.
      const candMust = mustHave(cand);
      const extra = [...candMust].filter((f) => !refAny.has(f));
      const gatedDelta = [...gatedAny(ref)].filter((f) => !gatedAny(cand).has(f)).length;
      if (missing.length || extra.length) {
        const sev = missing.some((f) => f.startsWith('Damage|')) ? 'MISSING_DAMAGE'
          : missing.some((f) => f.endsWith('|PT')) ? 'MISSING_PERTARGET'
          : missing.length ? 'FAMILY_GAP' : 'FAMILY_EXTRA';
        findings.push({ key, cls: sev, src, missing, extra, gatedDelta, examples: cand.examples, refExamples: ref.examples });
      }
    }
  }

  const order = { ATOMLESS: 0, MISSING_DAMAGE: 1, MISSING_PERTARGET: 2, FAMILY_GAP: 3, FAMILY_EXTRA: 4 };
  findings.sort((a, b) => order[a.cls] - order[b.cls] || a.key.localeCompare(b.key));

  console.log(`\n=== ${dataset}: ${total} powers swept, ${twinKeys} twin keys compared, ${findings.length} shape divergences ===`);
  const byCls = {};
  for (const f of findings) byCls[f.cls] = (byCls[f.cls] || 0) + 1;
  console.log('  ', JSON.stringify(byCls));
  for (const f of findings.slice(0, 40)) {
    const detail = f.detail || `missing [${(f.missing || []).join(', ')}]${f.extra && f.extra.length ? ` extra [${f.extra.join(', ')}]` : ''}`;
    console.log(`  ${f.cls.padEnd(18)} ${f.key.padEnd(28)} on ${f.src}: ${detail}`);
    const pair = f.refExamples ? ` vs ${f.refExamples[0]}` : '';
    console.log(`    ${' '.repeat(18)} ${f.examples[0]}${pair}`);
  }
  if (findings.length > 40) console.log(`  ... ${findings.length - 40} more (use --json)`);
  report[dataset] = { total, twinKeys, byClass: byCls, findings };
}

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(report, null, 1));
  console.log(`\nfull report -> ${JSON_OUT}`);
}
