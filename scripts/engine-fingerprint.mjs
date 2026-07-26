/**
 * Fingerprint the rebuild sources the committed engine artifacts are built FROM.
 *
 * The beta ships `src/engine/wasm/`, `src/engine/wasm-node/` and
 * `public/engine/contract/*.json.gz` as committed build output, because a GitHub-hosted
 * runner has no Rust and the rebuild repo is private (see .gitignore). That makes deploy
 * and CI self-sufficient — and it creates exactly one hazard: change `coh_math`, forget
 * `npm run build:engine`, push. CI is green, the deploy is green, and users get a stale
 * engine. Silent, and the same shape as the parser/export staleness that has already bitten
 * this project twice.
 *
 * Nothing in the beta can detect that: it cannot see the rebuild. But the reverse works —
 * the beta is PUBLIC, so the rebuild's CI can check it out with no secret, and it already
 * has the pinned Rust toolchain. So the fingerprint is WRITTEN here (by build-engine.mjs,
 * which has both trees in hand) and VERIFIED there.
 *
 * This module is the single implementation of the hash, imported by the writer and executed
 * by the verifier, so the two cannot compute it differently.
 *
 * What is hashed: the three crates whose source determines the .wasm, their manifests, the
 * workspace lock, and the toolchain pin — plus each contract bundle, which is a separate
 * output of the rebuild's `npm run regen` and goes stale independently.
 *
 * Usage as a script (this is what the rebuild's CI runs):
 *   node scripts/engine-fingerprint.mjs --rebuild-dir <path> [--compare <manifest.json>]
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/** Crates whose source compiles into the shipped .wasm. `app` (Dioxus UI) is not one. */
const ENGINE_CRATES = ['coh_data', 'coh_math', 'coh_wasm'];

/** Repo-root files that change the compiled output without changing any crate source. */
const ROOT_INPUTS = ['Cargo.lock', 'Cargo.toml', 'rust-toolchain.toml'];

/** Every file under `dir`, recursively, as paths relative to `dir`, sorted. */
function filesUnder(dir) {
  const out = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(relative(dir, full).split(sep).join('/'));
    }
  };
  walk(dir);
  return out.sort();
}

/** Hash a list of (label, bytes) pairs, with the label mixed in so a rename is a change. */
function hashEntries(entries) {
  const h = createHash('sha256');
  for (const [label, bytes] of entries) {
    h.update(label);
    h.update('\0');
    h.update(bytes);
    h.update('\0');
  }
  return h.digest('hex');
}

/**
 * Fingerprint a rebuild checkout. Throws (rather than returning a partial hash) if an
 * expected input is missing — a fingerprint over an incomplete tree would compare unequal
 * for the wrong reason and send someone hunting a staleness that isn't there.
 */
export function fingerprintRebuild(rebuildDir) {
  const entries = [];

  for (const crate of ENGINE_CRATES) {
    const crateDir = join(rebuildDir, 'crates', crate);
    const srcDir = join(crateDir, 'src');
    if (!existsSync(srcDir)) throw new Error(`engine-fingerprint: no ${crate}/src under ${rebuildDir}`);
    for (const rel of filesUnder(srcDir)) {
      entries.push([`crates/${crate}/src/${rel}`, readFileSync(join(srcDir, rel))]);
    }
    const manifest = join(crateDir, 'Cargo.toml');
    if (!existsSync(manifest)) throw new Error(`engine-fingerprint: no ${crate}/Cargo.toml`);
    entries.push([`crates/${crate}/Cargo.toml`, readFileSync(manifest)]);
  }

  for (const name of ROOT_INPUTS) {
    const path = join(rebuildDir, name);
    if (!existsSync(path)) throw new Error(`engine-fingerprint: no ${name} under ${rebuildDir}`);
    entries.push([name, readFileSync(path)]);
  }

  // Contract bundles, hashed individually so a mismatch names the dataset that drifted.
  const contractDir = join(rebuildDir, 'contract');
  if (!existsSync(contractDir)) throw new Error(`engine-fingerprint: no contract/ under ${rebuildDir}`);
  const bundles = {};
  for (const dataset of readdirSync(contractDir).sort()) {
    const bundle = join(contractDir, dataset, 'bundle.json.gz');
    if (!statSync(join(contractDir, dataset)).isDirectory() || !existsSync(bundle)) continue;
    bundles[dataset] = createHash('sha256').update(readFileSync(bundle)).digest('hex');
  }
  if (Object.keys(bundles).length === 0) throw new Error(`engine-fingerprint: no bundles under ${contractDir}`);

  return { source: hashEntries(entries), bundles };
}

/** Human-readable diff of two fingerprints; empty array means they match. */
export function diffFingerprints(committed, actual) {
  const problems = [];
  if (committed.source !== actual.source) {
    problems.push(
      `engine SOURCE differs — the committed artifacts were built from different Rust sources.\n` +
        `  committed ${committed.source}\n  rebuild   ${actual.source}`,
    );
  }
  const datasets = [...new Set([...Object.keys(committed.bundles ?? {}), ...Object.keys(actual.bundles)])].sort();
  for (const ds of datasets) {
    const a = committed.bundles?.[ds];
    const b = actual.bundles[ds];
    if (a === b) continue;
    if (!a) problems.push(`contract bundle "${ds}" exists in the rebuild but not in the committed manifest.`);
    else if (!b) problems.push(`contract bundle "${ds}" is in the committed manifest but not in the rebuild.`);
    else problems.push(`contract bundle "${ds}" differs — committed ${a.slice(0, 12)}…, rebuild ${b.slice(0, 12)}…`);
  }
  return problems;
}

// --- CLI (the rebuild's CI entry point) ---

const invokedDirectly = process.argv[1] && import.meta.url.endsWith(process.argv[1].split(sep).join('/'));
if (invokedDirectly) {
  const arg = (flag) => {
    const i = process.argv.indexOf(flag);
    return i === -1 ? null : process.argv[i + 1];
  };
  const rebuildDir = arg('--rebuild-dir') ?? '.';
  const comparePath = arg('--compare');
  const actual = fingerprintRebuild(rebuildDir);

  if (!comparePath) {
    console.log(JSON.stringify(actual, null, 2));
    process.exit(0);
  }

  if (!existsSync(comparePath)) {
    console.error(`\n[engine-fingerprint] no manifest at ${comparePath} — run \`npm run build:engine\` in the beta and commit it.\n`);
    process.exit(1);
  }
  const problems = diffFingerprints(JSON.parse(readFileSync(comparePath, 'utf8')), actual);
  if (problems.length === 0) {
    console.log(`[engine-fingerprint] beta engine artifacts match this rebuild (${Object.keys(actual.bundles).length} bundles).`);
    process.exit(0);
  }
  console.error(
    `\n[engine-fingerprint] the beta is shipping a STALE engine:\n\n` +
      problems.map((p) => `  - ${p}`).join('\n') +
      `\n\nFix: in the beta checkout, run \`npm run build:engine\` against this rebuild and commit\n` +
      `the refreshed src/engine/wasm*/, public/engine/contract/ and src/engine/_engine_manifest.json.\n`,
  );
  process.exit(1);
}
