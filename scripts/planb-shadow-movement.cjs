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
 *           movementCapBump, Max+slow → movementCapDebuff, slow → slow, else self /
 *           current) reproduced from `aspect` / `toWho` / `scale` / `modifierTable`,
 *           which are all on the wire.
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
 * SCOPE — Thunderspy movement is now COVERED (this note previously claimed the opposite
 * — "tspy has NO movement data, +0 everywhere, aspect always empty"; corrected 2026-07-19,
 * all three claims are now false). `MOVEMENT_TYPES` (bag) and `MOVEMENT_AXIS` (bridge) both
 * map tspy's `SpeedRunning`/`SpeedJumping`/`SpeedFlying` spelling onto the Run/Fly/Jump axes,
 * and the TSPY-3 step-1 typing recovery filled in `aspect` (tspy is now ~4.8% aspect-empty,
 * was ~98%), so the speed-buff-vs-travel-cap distinction IS recoverable. This gate reports
 * ~95 tspy movement axis slots (bag == atoms, 0 divergence) — real data on both sides, not a
 * vacuous agree. (TSPY-3 step 2 also mapped the bare `Friction`/`Control` respellings, but
 * `movement.rs` excludes those axes from every total by design.) Coverage still prints per
 * dataset so any genuine zero stays visible rather than hiding in a corpus-wide total.
 *
 * Exit code is nonzero on any divergence — this GATES.
 *
 * Usage:
 *   node scripts/planb-shadow-movement.cjs
 *   node scripts/planb-shadow-movement.cjs --dataset homecoming
 *   node scripts/planb-shadow-movement.cjs --power "Super Speed"
 *
 * ARCHETYPE FORK: a slot the converter resolved across the whole roster reads as
 * `undefined` from the build-agnostic atom readers and populated in the bag. That is
 * not a divergence — it is checked, per archetype, through
 * `planb-shadow-sweep.forkResolvedViews`, and counted separately in the summary.
 */

require('tsx/cjs');
const { sweepDataset, forkResolvedAgrees } = require('./planb-shadow-sweep.cjs');
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

const stats = { powers: 0, slots: 0, agree: 0, forkResolved: 0 };
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
    // The build-agnostic reader abstains on an archetype-forked slot; ask each
    // archetype's resolved view instead (see `forkResolvedAgrees`).
    if (eq(bag, atom)) stats.agree++;
    else if (!atom && bag && forkResolvedAgrees(dataset, power, bag,
      (src) => norm(movementBuffValue(src)?.[axis]), eq)) {
      stats.agree++;
      stats.forkResolved++;
    } else {
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
console.log(`  agree:         ${stats.agree}  (of which archetype-fork resolved: ${stats.forkResolved})`);
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
