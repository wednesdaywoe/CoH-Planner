/**
 * Plan B, Phase 2 Slice 7 — movement-buff reconstruction shadow (`effects.movement`).
 *
 * Proves that the atom list reproduces the bag's movement map WITHOUT reading the bag —
 * the precondition for migrating the movement applier in character-totals.ts:
 *
 *   BAG   — `effects.movement`, what the calc reads today: a map of axis →
 *           `{ scale, table, stackKey?, suppressible? }`, iterated by the applier and
 *           resolved through the AT table into a run/fly/jump percent.
 *   ATOMS — `movementBuffValue(power)`: base Movement atoms, with the bag's routing
 *           chain (Res → debuffResistance, self+Str → specialBuff, self+Max+scale>0 →
 *           movementCapBump, slow → slow, else self / current) reproduced from
 *           `aspect` / `toWho` / `scale` / `modifierTable`, which are all on the wire.
 *
 * Checked in BOTH directions, per slot, so an over-production (an atom minting a
 * movement entry the bag never had — the failure mode a fallback CANNOT protect
 * against) is as loud as a drop.
 *
 * The three metadata axes are checked alongside the value, because the applier reads
 * all of them and two of them decide whether the buff applies at all:
 *   - `table` — a movement scale is meaningless without it (Swift's 0.1 is +35% on
 *     `Melee_SpeedRunning`, not +10%);
 *   - `stackKey` — the mutual-suppression group (`TravelBuff`); only the strongest
 *     member of a group applies, so a dropped key silently stacks CJ + SJ + SS;
 *   - `suppressible` — combat suppression (Super Speed's run buff, Fly's speed).
 *
 * SCOPE — WHAT THIS GATE CANNOT SEE (state it before citing green, per the plan's
 * "a gate's SWEEP is part of its claim"): Thunderspy. Not because it is excluded —
 * it is swept — but because Thunderspy has NO movement data on either side. It spells
 * the attrib `SpeedRunning`/`SpeedJumping`/`SpeedFlying` (280/137/107 templates) where
 * HC spells it `RunningSpeed`, and neither the bag's `MOVEMENT_TYPES` nor the bridge's
 * `MOVEMENT_AXIS` maps that spelling, so every Thunderspy travel power (Super Speed,
 * Fly, Super Jump, Hover, Combat Jumping) yields +0 movement in the planner today.
 * Bag and atoms are equally empty, so this gate agrees vacuously on all of it. That is
 * a real user-facing bug with a parser-side fix (the vocabulary AND the aspect: tspy
 * exports `aspect: ''` on 29,981 of 30,519 templates, so Current-vs-Maximum — speed
 * buff vs travel-cap raise — is not recoverable either) tracked in
 * CONVERTER-ATOM-ARRAY-PLAN.md. Coverage below prints per dataset so a Thunderspy zero
 * stays visible rather than hiding inside a corpus-wide total.
 *
 * Exit code is nonzero on any divergence — this GATES.
 *
 * Usage:
 *   node scripts/planb-shadow-movement.cjs
 *   node scripts/planb-shadow-movement.cjs --dataset homecoming
 *   node scripts/planb-shadow-movement.cjs --power "Super Speed"
 */

require('tsx/cjs');
const { sweepDataset } = require('./planb-shadow-sweep.cjs');
const { movementBuffValue } = require('../src/data/core/atom-query.ts');

const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const POWER_FILTER = argVal('--power');
const DATASETS = (() => {
  const picked = argv.flatMap((a, i) => (a === '--dataset' && argv[i + 1] ? [argv[i + 1]] : []));
  return picked.length ? picked : ['homecoming', 'rebirth', 'thunderspy'];
})();

const r4 = (n) => Math.round((n || 0) * 1e4) / 1e4;

/** The four axes that reach a character total; see MOVEMENT_AXIS_TO_KEY in atom-query. */
const AXES = ['runSpeed', 'flySpeed', 'jumpSpeed', 'jumpHeight'];

/**
 * Normalize one axis entry to the tuple the applier actually consumes. A scale-0 entry
 * with no metadata contributes literally nothing (resolveMovementTotals filters
 * `value !== 0`), so it normalizes to absent on both sides — the "compare what survives
 * to a total" doctrine. A genuine 0-vs-nonzero mismatch still shows as present/absent.
 */
function norm(v) {
  if (v === undefined || v === null) return undefined;
  const e = typeof v === 'number' ? { scale: v, table: '' } : v;
  const scale = r4(Math.abs(e.scale));
  if (scale === 0) return undefined;
  return {
    scale,
    table: (e.table || '').toLowerCase(),
    stackKey: e.stackKey || null,
    suppressible: !!e.suppressible,
  };
}
const eq = (a, b) =>
  (!a && !b) ||
  (!!a && !!b && a.scale === b.scale && a.table === b.table &&
   a.stackKey === b.stackKey && a.suppressible === b.suppressible);

const stats = { powers: 0, slots: 0, agree: 0 };
const perDataset = {};
const findings = [];

function checkPower(dataset, power, genPath) {
  const name = power.name || genPath;
  if (POWER_FILTER && !name.toLowerCase().includes(POWER_FILTER.toLowerCase())) return;
  stats.powers++;
  perDataset[dataset] = perDataset[dataset] || { powers: 0, slots: 0 };
  perDataset[dataset].powers++;

  const bagMap = power.effects?.movement;
  const atomMap = movementBuffValue(power);
  if (!bagMap && !atomMap) return;

  for (const axis of AXES) {
    const bag = norm(bagMap?.[axis]);
    const atom = norm(atomMap?.[axis]);
    if (!bag && !atom) continue;
    stats.slots++;
    perDataset[dataset].slots++;
    if (eq(bag, atom)) stats.agree++;
    else {
      findings.push({ dataset, name, axis, bag, atom });
      if (POWER_FILTER) {
        console.log(`  [DIVERGE] ${name} ${axis}  bag=${JSON.stringify(bag)} atom=${JSON.stringify(atom)}`);
      }
    }
  }
}

for (const ds of DATASETS) sweepDataset(ds, (power, rel) => checkPower(ds, power, rel));

console.log('\nPlan B Slice 7 — movement-buff reconstruction (effects.movement)');
console.log(`  powers swept:  ${stats.powers}`);
console.log(`  axis slots:    ${stats.slots}`);
console.log(`  agree:         ${stats.agree}`);
console.log(`  diverge:       ${findings.length}`);
console.log('  coverage by dataset (a zero here means the DATASET has no movement data,');
console.log('  not that the gate skipped it — see the Thunderspy note in the header):');
for (const ds of DATASETS) {
  const d = perDataset[ds] || { powers: 0, slots: 0 };
  console.log(`      ${ds.padEnd(12)} ${String(d.slots).padStart(5)} axis slots over ${d.powers} powers`);
}

for (const f of findings.slice(0, 60)) {
  console.log(`\n  [DIVERGE] ${f.name} (${f.dataset}) ${f.axis}`);
  console.log(`      bag  : ${JSON.stringify(f.bag)}`);
  console.log(`      atom : ${JSON.stringify(f.atom)}`);
}
if (findings.length > 60) console.log(`\n  ... and ${findings.length - 60} more`);

if (findings.length) {
  console.log('\nFAIL — atom-derived movement diverges from the bag. Fix before migrating the applier.');
  process.exit(1);
}
console.log('\nOK — atom-derived effects.movement reproduces the bag across every dataset that has one.');
