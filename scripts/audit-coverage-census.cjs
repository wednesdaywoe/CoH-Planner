/**
 * A5 — per-partition coverage census (data-integrity audit, GAME-DATA-PRINCIPLES §14).
 *
 * A corpus-wide total hides structural zeros: Thunderspy shipped for months with NO
 * movement data at all, invisible inside "N atoms across the corpus". This census
 * partitions the generated tree by dataset × converter source and prints, per
 * partition: power count, atom coverage, and per-effect-family atom presence — so a
 * partition-level blackout is a visible 0 in a table instead of a rounding error.
 *
 * Also the empty census: powers with neither atoms nor bag effects (a power that
 * does literally nothing is almost always a drop, not a power).
 *
 * Usage: node scripts/audit-coverage-census.cjs [--dataset homecoming] [--json out.json]
 */

require('tsx/cjs');
const fs = require('fs');
const path = require('path');
const { sweepDataset } = require('./planb-shadow-sweep.cjs');
const { decodeAtoms } = require('../src/data/core/atomic-effect.ts');

const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const JSON_OUT = argVal('--json');
const DATASETS = (() => {
  const picked = argv.flatMap((a, i) => (a === '--dataset' && argv[i + 1] ? [argv[i + 1]] : []));
  return picked.length ? picked : ['homecoming', 'rebirth', 'thunderspy'];
})();

const FAMILIES = [
  'Damage', 'Defense', 'Resistance', 'ToHit', 'Heal', 'MaxHP', 'Regeneration',
  'Recovery', 'Endurance', 'EnduranceDiscount', 'RechargeTime', 'Movement', 'Mez',
  'MezResist', 'DamageBuff', 'Absorb', 'Stealth', 'Perception', 'Elusivity',
];

function sourceOf(rel) {
  if (rel.includes(`${path.sep}powersets${path.sep}`)) return 'powerset';
  if (rel.endsWith('power-pools.ts')) return 'pool';
  if (rel.endsWith('epic-pools.ts')) return 'epic';
  if (rel.endsWith('incarnate-effects.ts')) return 'incarnate';
  return 'other';
}

const report = {};
for (const dataset of DATASETS) {
  const parts = {};
  const empty = [];
  sweepDataset(dataset, (power, rel) => {
    const src = sourceOf(rel);
    if (!parts[src]) {
      parts[src] = { powers: 0, withAtoms: 0, atomTotal: 0, families: Object.fromEntries(FAMILIES.map((f) => [f, 0])) };
    }
    const p = parts[src];
    p.powers += 1;
    const atoms = Array.isArray(power.atoms) ? decodeAtoms(power.atoms) : [];
    const bagKeys = power.effects && typeof power.effects === 'object' && !Array.isArray(power.effects)
      ? Object.keys(power.effects).length : 0;
    if (atoms.length) { p.withAtoms += 1; p.atomTotal += atoms.length; }
    else if (bagKeys === 0) empty.push(`${src}: ${power.internalName || power.name}`);
    for (const a of atoms) if (a.effectType in p.families) p.families[a.effectType] += 1;
  });

  console.log(`\n=== ${dataset} ===`);
  const srcNames = Object.keys(parts);
  console.log('partition        powers  w/atoms  atoms   ' + FAMILIES.map((f) => f.slice(0, 6).padStart(7)).join(''));
  for (const s of srcNames) {
    const p = parts[s];
    const fam = FAMILIES.map((f) => String(p.families[f]).padStart(7)).join('');
    console.log(`${s.padEnd(16)} ${String(p.powers).padStart(6)} ${String(p.withAtoms).padStart(8)} ${String(p.atomTotal).padStart(6)}  ${fam}`);
  }
  // structural zeros: a family with atoms in powersets but ZERO in pool/epic (or vice versa)
  const zeros = [];
  for (const f of FAMILIES) {
    for (const s of srcNames) {
      if (s === 'incarnate') continue; // known: no atoms yet
      const others = srcNames.filter((x) => x !== s && x !== 'incarnate');
      if (parts[s].families[f] === 0 && others.some((o) => parts[o].families[f] > 50)) {
        zeros.push(`${s} has ZERO ${f} atoms while ${others.find((o) => parts[o].families[f] > 50)} has plenty`);
      }
    }
  }
  console.log(`structural zeros: ${zeros.length ? '' : 'none'}`);
  for (const z of zeros) console.log('  !! ' + z);
  console.log(`empty powers (no atoms AND empty bag): ${empty.length}`);
  for (const e of empty.slice(0, 10)) console.log('  ' + e);
  report[dataset] = { partitions: parts, structuralZeros: zeros, empty };
}

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(report, null, 1));
  console.log(`\nfull report -> ${JSON_OUT}`);
}
