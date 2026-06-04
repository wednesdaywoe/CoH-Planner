/**
 * Full data regeneration orchestrator.
 *
 * Rebuilds all Node-converter output from the committed `exported_powers/` input
 * (no .pigg / no Python needed), for one or both datasets, in dependency order.
 * This is the single entrypoint the "regen-and-diff" CI guard runs: because the
 * converters embed no timestamps or other non-determinism, a clean working tree
 * before this runs must remain clean after — any diff means the committed output
 * drifted from what the current converters produce.
 *
 * Usage:
 *   node scripts/regen-all.cjs                     # full rebuild, both datasets
 *   node scripts/regen-all.cjs --dataset rebirth   # full rebuild, one dataset
 *   node scripts/regen-all.cjs --generated-only    # only src/data/.../generated/
 *                                                  # (what the CI diff checks)
 *
 * NOT covered (separate pipelines, intentionally excluded):
 *   - IO/enhancement sets (extract-rebirth-io-sets.cjs / convert-io-sets.js) —
 *     these have a Python `_dump_boostsets.py` dependency and write io-sets-*.ts,
 *     not generated/. Regenerate them manually when boostsets change.
 *   - reconvert-redirect-powersets.cjs — a stale one-off migration (old `powers/`
 *     layout); redirect powersets are handled by convert-all-powersets normally.
 */

const { execSync } = require('child_process');

const argv = process.argv.slice(2);
const generatedOnly = argv.includes('--generated-only');

const datasets = (() => {
  const i = argv.indexOf('--dataset');
  if (i !== -1 && argv[i + 1]) return [argv[i + 1]];
  return ['homecoming', 'rebirth'];
})();

// Steps in dependency order. The two that write under generated/ vs the layered
// powersets/ tree are tagged so --generated-only can skip the downstream ones.
//   convert-all-powersets  -> generated/powersets/** (+ composed powersets/**)
//   convert-pool-powers    -> generated/power-pools.ts
//   convert-epic-pools     -> generated/epic-pools.ts
//   convert-incarnate      -> generated/incarnate-effects.ts
//   extract-at-tables      -> at-tables.ts            (layered, not generated/)
//   generate-powerset-index-> powersets/index.ts      (needs powersets first)
//   generate-kheldian      -> kheldian-form-variants.ts
//   convert-pet-entities   -> pet-entities.ts (+ sidecars)
const STEPS = [
  { script: 'extract-at-tables.cjs',          args: [],          generated: false },
  { script: 'convert-all-powersets.cjs',      args: ['--force'], generated: true },
  { script: 'generate-powerset-index.cjs',    args: [],          generated: false },
  { script: 'generate-kheldian-variants.cjs', args: [],          generated: false },
  { script: 'convert-pool-powers.cjs',        args: [],          generated: true },
  { script: 'convert-epic-pools.cjs',         args: [],          generated: true },
  { script: 'convert-incarnate-effects.cjs',  args: [],          generated: true },
  { script: 'convert-pet-entities.cjs',       args: [],          generated: false },
];

const steps = generatedOnly ? STEPS.filter((s) => s.generated) : STEPS;

const started = process.hrtime.bigint();
for (const ds of datasets) {
  console.log(`\n========== REGEN dataset: ${ds}${generatedOnly ? ' (generated-only)' : ''} ==========`);
  for (const { script, args } of steps) {
    const cmd = `node scripts/${script} --dataset ${ds} ${args.join(' ')}`.trim();
    console.log(`\n>>> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  }
}
const secs = Number(process.hrtime.bigint() - started) / 1e9;
console.log(`\n=== regen complete in ${secs.toFixed(0)}s ===`);
