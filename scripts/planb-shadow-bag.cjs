/**
 * Plan B, Phase 1 — shadow compare: every discriminator the BAG carries must be
 * recoverable from the ATOM list, corpus-wide.
 *
 * Plan B migrates the calc off the ~90-slot `PowerEffects` bag and onto the flat
 * atom list (`Power.atoms`, Phase 0). Phase 2 rewrites the appliers one at a
 * time; each is only safe to migrate if the atoms it will read are *sufficient*
 * — i.e. nothing the bag says today is invisible in the atom list. That is what
 * this harness proves, over every power of every dataset.
 *
 * Direction of the check, and why it's this way round: the bag is the INCUMBENT.
 * Its slots are what the calc reads today and what users' numbers come from, so
 * `bag ⊆ atoms` is the migration precondition — a bag fact with no atom behind it
 * would mean Phase 2 silently drops it. The converse (`atoms ⊆ bag`) is NOT
 * asserted and must not be: atoms carrying MORE than the bag is the whole point
 * (the bag collapses; that residual is what DSH6c gates and what Phase 2
 * recovers). Divergence in that direction is a finding, not a failure — see
 * `scripts/dsh6-collapse-detector.cjs`.
 *
 * Each check is written THROUGH the Phase-1 helpers (`src/data/core/atom-query.ts`),
 * so this doubles as their corpus-wide exercise: if a helper mis-keys a twin or
 * mis-splits the IgnoreStrength axis, a real power here will say so.
 *
 * Invariants, one per bag discriminator (see atom-query.ts for the axis table):
 *   ATOMS-PRESENT  a power whose bag holds atom-derived effects has a non-empty
 *                  atom list (the Phase-2 fallback hazard: empty atoms must never
 *                  be mistaken for "zero").
 *   UNENHANCED     each `*Unenhanced` parallel slot ⇒ an `ignoreStrength` atom of
 *                  that effectType exists.
 *   UNRESISTABLE   each `unresistable: true` value ⇒ `resistibleTwins` finds a
 *                  resistible/bypassing pair.
 *   SELF           each `toWho: 'Self'` value ⇒ `selfDirected` is non-empty.
 *   DURATIONS      each `durationVariants[]` entry ⇒ an atom at that duration
 *                  bucket carrying that magnitude.
 *
 * Read-only: never writes generated/.
 *
 * Usage:
 *   node scripts/planb-shadow-bag.cjs                    # all datasets (the gate)
 *   node scripts/planb-shadow-bag.cjs --dataset rebirth
 *   node scripts/planb-shadow-bag.cjs --power "Acid Arrow"   # + verbose dump
 */

require('tsx/cjs');
const fs = require('fs');
const path = require('path');
const {
  atomsOf, atomsOfType, selfDirected, enhanceableVsNot, resistibleTwins, durationBuckets,
} = require('../src/data/core/atom-query.ts');

const REPO = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const POWER_FILTER = argVal('--power');
/** `--dataset` may be repeated (`--dataset homecoming --dataset rebirth`); the
 *  regen orchestrator passes one per dataset it just rebuilt. Reading only the
 *  first would silently narrow a corpus-wide gate to a single dataset. */
const DATASETS = (() => {
  const picked = argv.flatMap((a, i) => (a === '--dataset' && argv[i + 1] ? [argv[i + 1]] : []));
  return picked.length ? picked : ['homecoming', 'rebirth', 'thunderspy'];
})();

const EPS = 1e-4;
const near = (a, b) => Math.abs(a - b) < EPS;

/** Every canonical field a resistible/bypassing twin pair must agree on — i.e.
 *  the whole AtomicEffect identity except `resistible` itself. `scale` is
 *  compared by magnitude (the pair carries the same value; sign belongs to the
 *  effect, not the split). */
const TWIN_IDENTITY_FIELDS = [
  'effectType', 'subType', 'pvMode', 'toWho', 'attribType', 'aspect',
  'modifierTable', 'scale', 'duration',
];

/** `*Unenhanced` parallel slot → the effectType its atoms carry. */
const UNENHANCED_SLOTS = {
  maxHPBuffUnenhanced: 'MaxHP',
  recoveryBuffUnenhanced: 'Recovery',
  regenBuffUnenhanced: 'Regeneration',
  tohitBuffUnenhanced: 'ToHit',
  runSpeedUnenhanced: 'Movement',
};

/**
 * Bag slots that are power METADATA, not projected from atoms — a bag holding
 * only these has no atom obligation. `summon` is atom-adjacent but deliberately
 * template-owned (`extractSummon`), and stacking meta (`maxStacks`/`stacksLinear`
 * /`stackCaps`/`stackInterval`/`durations`) is derived ABOUT effects rather than
 * being one.
 */
const NON_ATOM_SLOTS = new Set([
  'accuracy', 'range', 'recharge', 'enduranceCost', 'activatePeriod', 'castTime',
  'effectArea', 'radius', 'arc', 'maxTargets', 'buffDuration', 'durations',
  'maxStacks', 'stacksLinear', 'stackCaps', 'stackInterval', 'summon',
]);

/**
 * Walk every object reachable in the POWER, yielding `{ path, value }`.
 *
 * Deliberately the whole power, not just `power.effects`: the bag's projected
 * values also live in `conditionalEffects[].effects` (mode/stance-gated) and
 * `specialEffects`, and a discriminator is exactly as losable there. Scoping
 * this to `effects` silently skipped ~half the corpus's discriminators — a gate
 * that only checks the easy half is worse than no gate, because it reads green.
 * `atoms` is skipped: it is the thing being checked against, not a bag.
 */
function* walkValues(node, trail = []) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) yield* walkValues(node[i], [...trail, String(i)]);
    return;
  }
  yield { path: trail.join('.'), value: node };
  for (const [k, v] of Object.entries(node)) {
    if (k === 'atoms' && trail.length === 0) continue;
    yield* walkValues(v, [...trail, k]);
  }
}

const stats = { datasets: 0, powers: 0, withAtoms: 0, checks: 0, loadFailed: 0 };
/** Per-invariant check counts — printed every run. A gate whose check count
 *  silently collapses to near-zero reads exactly like a gate that passes, so the
 *  counts are part of the result, not diagnostics. */
const kindChecks = new Map();
const failures = [];

function count(kind) {
  stats.checks++;
  kindChecks.set(kind, (kindChecks.get(kind) || 0) + 1);
}
function fail(dataset, power, kind, detail) {
  failures.push({ dataset, power, kind, detail });
}

function checkPower(dataset, power, genPath) {
  const name = power.name || genPath;
  if (POWER_FILTER && !name.toLowerCase().includes(POWER_FILTER.toLowerCase())) return;
  stats.powers++;
  const atoms = atomsOf(power);
  if (atoms.length) stats.withAtoms++;
  const effects = power.effects || {};

  // --- ATOMS-PRESENT -------------------------------------------------------
  // Only obligate powers whose bag holds at least one slot that IS projected
  // from atoms. A stats-only or summon-only bag legitimately has no atoms.
  const atomBearingSlots = Object.keys(effects).filter((k) => !NON_ATOM_SLOTS.has(k));
  count('ATOMS-PRESENT');
  if (atomBearingSlots.length > 0 && atoms.length === 0) {
    fail(dataset, name, 'ATOMS-PRESENT',
      `bag has projected slots [${atomBearingSlots.slice(0, 6).join(', ')}] but power.atoms is empty`);
  }

  // --- UNENHANCED ----------------------------------------------------------
  // Anywhere in the power: a conditional/stance-gated bag carries the same
  // parallel slots (Bio Armor's adaptations are exactly this shape).
  for (const { path: p, value } of walkValues(power)) {
    // `effects.durations` is a Record<effectKey, seconds> — its
    // `recoveryBuffUnenhanced` key holds that slot's DURATION, not the slot.
    // Both are plain numbers, so only the path distinguishes them.
    if (p.split('.').pop() === 'durations') continue;
    for (const [slot, effectType] of Object.entries(UNENHANCED_SLOTS)) {
      if (value[slot] === undefined) continue;
      count('UNENHANCED');
      const { unenhanceable } = enhanceableVsNot(atomsOfType(power, effectType));
      if (unenhanceable.length === 0) {
        fail(dataset, name, 'UNENHANCED',
          `bag '${p ? p + '.' : ''}${slot}' present but no ignoreStrength ${effectType} atom exists`);
      }
    }
  }

  // --- TWIN-INTEGRITY ------------------------------------------------------
  const { twins } = resistibleTwins(atoms);
  // `resistibleTwins` claims each pair is two atoms identical BUT FOR the flag.
  // Assert that directly, per pair: a mis-keyed pairing (e.g. one that folds
  // scale or table out of the identity) would happily return pairs that merely
  // co-exist, and the UNRESISTABLE check below — which only asks whether SOME
  // pair carries the bag's magnitude — cannot see the difference. Verified by
  // mutation: without this, corrupting `twinKey` leaves the harness green.
  for (const { resistible: r, unresistible: u } of twins) {
    count('TWIN-INTEGRITY');
    const bad = TWIN_IDENTITY_FIELDS.filter((f) =>
      f === 'scale' ? !near(Math.abs(r.scale), Math.abs(u.scale)) : r[f] !== u[f]);
    if (bad.length) {
      fail(dataset, name, 'TWIN-INTEGRITY',
        `resistibleTwins paired two atoms differing in [${bad.join(', ')}] — ` +
        `${r.effectType}/${r.subType ?? '-'} scale ${r.scale} vs ${u.scale}`);
    }
  }

  // --- UNRESISTABLE --------------------------------------------------------
  for (const { path: p, value } of walkValues(power)) {
    if (value.unresistable !== true) continue;
    count('UNRESISTABLE');
    // The bag stores ONE half of the pair and tags it; the pair's magnitude is
    // that value's scale. Look for a twin pair at the same magnitude.
    const scale = typeof value.scale === 'number' ? value.scale : null;
    const table = typeof value.table === 'string' ? value.table.toLowerCase() : null;
    const match = twins.some((t) =>
      (scale === null || near(Math.abs(t.resistible.scale), Math.abs(scale))) &&
      (table === null || t.resistible.modifierTable.toLowerCase() === table));
    if (!match) {
      fail(dataset, name, 'UNRESISTABLE',
        `bag '${p}' is unresistable (scale ${scale}) but atoms hold no resistible/bypassing twin at that magnitude` +
        ` (${twins.length} twin pair(s) found)`);
    }
  }

  // --- SELF ----------------------------------------------------------------
  const selfAtoms = selfDirected(atoms);
  for (const { path: p, value } of walkValues(power)) {
    if (value.toWho !== 'Self') continue;
    count('SELF');
    if (selfAtoms.length === 0) {
      fail(dataset, name, 'SELF', `bag '${p}' is toWho:'Self' but no self-directed atom exists`);
    }
  }

  // --- DURATIONS -----------------------------------------------------------
  const buckets = durationBuckets(atoms);
  for (const { path: p, value } of walkValues(power)) {
    if (!Array.isArray(value.durationVariants)) continue;
    for (const v of value.durationVariants) {
      count('DURATIONS');
      const match = buckets.some((b) =>
        near(b.duration, v.duration) && b.atoms.some((a) => near(Math.abs(a.scale), Math.abs(v.scale))));
      if (!match) {
        fail(dataset, name, 'DURATIONS',
          `bag '${p}' has a durationVariant {scale ${v.scale}, duration ${v.duration}s} with no matching atom bucket`);
      }
    }
  }

  if (POWER_FILTER) {
    console.log(`\n=== ${name} [${dataset}] ===`);
    console.log(`  atoms: ${atoms.length}  self: ${selfAtoms.length}  twins: ${twins.length}  duration buckets: ${buckets.length}`);
    for (const a of atoms) {
      console.log(`   ${a.effectType}${a.subType ? '|' + a.subType : ''} scale=${a.scale} dur=${a.duration}` +
        ` ${a.aspect}/${a.attribType}/${a.toWho}/${a.pvMode}${a.resistible ? '' : ' UNRES'}${a.ignoreStrength ? ' IGN-STR' : ''}` +
        ` [${a.modifierTable}]`);
    }
  }
}

function sweep(dataset) {
  const root = path.join(REPO, 'src/data/datasets', dataset, 'generated/powersets');
  if (!fs.existsSync(root)) { console.log(`  (no generated tree for ${dataset} — skipped)`); return; }
  stats.datasets++;
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { stack.push(p); continue; }
      if (!e.name.endsWith('.ts') || e.name === 'index.ts') continue;
      let mod;
      // A generated power that will not load is not a pass — it is a power this
      // harness never checked. Surface it as a divergence rather than skipping
      // it, or the corpus-wide claim quietly stops being corpus-wide.
      try {
        mod = require(p);
      } catch (err) {
        stats.loadFailed++;
        fail(dataset, path.relative(REPO, p), 'LOAD', `generated power failed to load: ${err.message}`);
        continue;
      }
      for (const v of Object.values(mod)) {
        if (v && typeof v === 'object' && !Array.isArray(v) && (v.effects || v.atoms)) {
          checkPower(dataset, v, path.relative(REPO, p));
        }
      }
    }
  }
}

for (const ds of DATASETS) {
  console.log(`\n========== Plan B shadow (bag ⊆ atoms): ${ds} ==========`);
  sweep(ds);
}

console.log(`\nPlan B Phase-1 shadow compare`);
console.log(`  datasets swept:     ${stats.datasets}`);
console.log(`  powers checked:     ${stats.powers}`);
console.log(`  powers with atoms:  ${stats.withAtoms}`);
console.log(`  failed to load:     ${stats.loadFailed}`);
console.log(`  invariant checks:   ${stats.checks}`);
for (const kind of ['ATOMS-PRESENT', 'UNENHANCED', 'TWIN-INTEGRITY', 'UNRESISTABLE', 'SELF', 'DURATIONS']) {
  console.log(`      ${kind.padEnd(14)} ${kindChecks.get(kind) || 0}`);
}
console.log(`  divergences:        ${failures.length}`);

if (failures.length > 0) {
  const byKind = new Map();
  for (const f of failures) byKind.set(f.kind, (byKind.get(f.kind) || 0) + 1);
  console.log('\n  by kind: ' + [...byKind].map(([k, n]) => `${k}=${n}`).join('  '));
  console.log('\nDIVERGENCE (a bag fact the atom list cannot account for):');
  for (const f of failures.slice(0, 40)) {
    console.log(`  [${f.kind}] ${f.power} (${f.dataset})\n      ${f.detail}`);
  }
  if (failures.length > 40) console.log(`  ... and ${failures.length - 40} more`);
  process.exit(1);
}
console.log('OK — every bag discriminator is recoverable from the atom list, corpus-wide.');
