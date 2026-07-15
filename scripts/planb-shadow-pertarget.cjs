/**
 * Plan B, Phase 2 Slice 1 — perTarget reconstruction shadow (ToHit).
 *
 * Proves that the atom list reproduces the bag's per-target `{ scale, perTarget }`
 * for `tohitBuff` WITHOUT reading the bag — the precondition for migrating the
 * ToHit applier off `effects.tohitBuff` while the per-foe sliders (Soul Drain at
 * 1 vs 8 targets) keep working.
 *
 *   BAG   — `effects.tohitBuff` (`{ scale, table, perTarget? }`), what the calc
 *           reads today. Its perTarget comes from `computeAoePerTargetPatches`.
 *   ATOMS — `perTargetValueOf(<the tohitBuff-routed BASE atoms>)`: `perTarget` is
 *           Σ of the converter-stamped increment atoms, `scale` the N=1 value.
 *
 * The stamp is what makes this exact: the atom's own `stacking` can't identify a
 * per-target increment (Invincibility's `Continuous` folds to `No`), and the AoE
 * geometry / redirect / Defiance provenance never reaches the runtime — so the
 * converter decides and stamps, exactly as it does for `gated` (Slice 0).
 *
 * Scope: `tohitBuff` only (Slice 1's applier). Other effect types (regen,
 * recovery, defense, damage, endurance) carry perTarget too (513 slots total)
 * and migrate in their own slices; the redirect (Fulcrum Shift) and self-counted
 * (Phalanx) residuals live there, not in ToHit.
 *
 * Exit code is nonzero on any divergence — this GATES, unlike the triage reports.
 *
 * Usage:
 *   node scripts/planb-shadow-pertarget.cjs
 *   node scripts/planb-shadow-pertarget.cjs --dataset homecoming
 *   node scripts/planb-shadow-pertarget.cjs --power "Soul Drain"
 */

require('tsx/cjs');
const fs = require('fs');
const path = require('path');
const { toHitBuffValue } = require('../src/data/core/atom-query.ts');

const REPO = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const POWER_FILTER = argVal('--power');
const DATASETS = (() => {
  const picked = argv.flatMap((a, i) => (a === '--dataset' && argv[i + 1] ? [argv[i + 1]] : []));
  return picked.length ? picked : ['homecoming', 'rebirth', 'thunderspy'];
})();

const r4 = (n) => Math.round((n || 0) * 1e4) / 1e4;

/** Normalize a bag slot value to `{ scale, perTarget }` for comparison. */
function bagValue(v) {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return { scale: r4(Math.abs(v)), perTarget: 0 };
  return { scale: r4(Math.abs(v.scale)), perTarget: r4(v.perTarget) };
}
function atomCmpOf(v) {
  return v ? { scale: r4(v.scale), perTarget: r4(v.perTarget) } : undefined;
}

const SLOTS = [
  { key: 'tohitBuff', opts: {} },
  { key: 'tohitBuffUnenhanced', opts: { ignoreStrength: true } },
];

const stats = { powers: 0, withToHit: 0, agree: 0, perTargetPowers: 0 };
const findings = [];

function checkPower(dataset, power, genPath) {
  const name = power.name || genPath;
  if (POWER_FILTER && !name.toLowerCase().includes(POWER_FILTER.toLowerCase())) return;
  stats.powers++;

  for (const slot of SLOTS) {
    const bag = bagValue(power.effects?.[slot.key]);
    const atomCmp = atomCmpOf(toHitBuffValue(power, slot.opts));
    if (!bag && !atomCmp) continue;
    stats.withToHit++;
    if ((bag && bag.perTarget) || (atomCmp && atomCmp.perTarget)) stats.perTargetPowers++;

    const eq = bag && atomCmp && bag.scale === atomCmp.scale && bag.perTarget === atomCmp.perTarget;
    if (eq) { stats.agree++; continue; }

    findings.push({ dataset, name, slot: slot.key, bag, atoms: atomCmp });
    if (POWER_FILTER) {
      console.log(`\n=== ${name} [${dataset}] ${slot.key} ===`);
      console.log('  bag  :', JSON.stringify(bag));
      console.log('  atoms:', JSON.stringify(atomCmp));
    }
  }
}

function sweep(dataset) {
  const root = path.join(REPO, 'src/data/datasets', dataset, 'generated/powersets');
  if (!fs.existsSync(root)) return;
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { stack.push(p); continue; }
      if (!e.name.endsWith('.ts') || e.name === 'index.ts') continue;
      let mod;
      try { mod = require(p); } catch { continue; }
      for (const v of Object.values(mod)) {
        if (v && typeof v === 'object' && !Array.isArray(v) && (v.effects || v.atoms)) {
          checkPower(dataset, v, path.relative(REPO, p));
        }
      }
    }
  }
}

for (const ds of DATASETS) sweep(ds);

console.log(`\nPlan B Slice 1 — perTarget reconstruction (tohitBuff)`);
console.log(`  powers swept:        ${stats.powers}`);
console.log(`  powers with tohitBuff: ${stats.withToHit}`);
console.log(`  of which per-target: ${stats.perTargetPowers}`);
console.log(`  agree:               ${stats.agree}`);
console.log(`  diverge:             ${findings.length}`);

for (const f of findings.slice(0, 40)) {
  console.log(`\n  [DIVERGE] ${f.name} (${f.dataset}) ${f.slot}`);
  console.log(`      bag  : ${JSON.stringify(f.bag)}`);
  console.log(`      atoms: ${JSON.stringify(f.atoms)}`);
}
if (findings.length > 40) console.log(`\n  ... and ${findings.length - 40} more`);

if (findings.length) {
  console.log('\nFAIL — atom-derived tohitBuff diverges from the bag. Fix before migrating the applier.');
  process.exit(1);
}
console.log('\nOK — atom-derived tohitBuff (scale + perTarget) reproduces the bag corpus-wide.');
