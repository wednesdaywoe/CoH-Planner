/**
 * PROD1 — regenerate the engine artifacts the beta ships on top of.
 *
 * Replaces the manual spike commands with one repeatable step:
 *   1. Verify the installed `wasm-bindgen` CLI matches the version the rebuild's
 *      Cargo.lock resolved (the CLI and the linked lib MUST be identical or the glue
 *      it emits is incompatible with the .wasm) — fail loud otherwise.
 *   2. Build `coh_wasm` for wasm32 and run `wasm-bindgen --target web` into
 *      src/engine/wasm/ (the browser glue engine.ts imports).
 *   3. Copy the rebuild's per-dataset contract bundles into public/engine/contract/
 *      as <server>.json.gz (what engine.ts fetches at boot).
 *
 * The rebuild repo is located via COH_REBUILD_DIR, defaulting to the sibling checkout.
 * Every input is verified before use; a missing rebuild, a version skew, or a missing
 * bundle aborts with a specific message rather than emitting a half-built engine.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const betaRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rebuildDir = resolve(process.env.COH_REBUILD_DIR ?? join(betaRoot, '..', 'coh-sidekick-1.0'));

function die(message) {
  console.error(`\n[build-engine] ${message}\n`);
  process.exit(1);
}

function run(command, args, cwd) {
  console.log(`[build-engine] ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

// --- 1. locate the rebuild + verify the wasm-bindgen CLI matches its lockfile ---

if (!existsSync(join(rebuildDir, 'crates', 'coh_wasm', 'Cargo.toml'))) {
  die(
    `rebuild repo not found at ${rebuildDir}.\n` +
      `Set COH_REBUILD_DIR to your coh-sidekick-1.0 checkout.`,
  );
}

const lockText = readFileSync(join(rebuildDir, 'Cargo.lock'), 'utf8');
// The resolved version is the block whose name is exactly "wasm-bindgen" (not -macro etc.).
const lockMatch = lockText.match(/name = "wasm-bindgen"\nversion = "([^"]+)"/);
if (!lockMatch) die('could not read the resolved wasm-bindgen version from the rebuild Cargo.lock.');
const requiredCliVersion = lockMatch[1];

let installedCliVersion;
try {
  installedCliVersion = execFileSync('wasm-bindgen', ['--version'], { encoding: 'utf8' }).trim().replace(/^wasm-bindgen\s+/, '');
} catch {
  die(
    `wasm-bindgen CLI not found. Install the pinned version:\n` +
      `  cargo install -f wasm-bindgen-cli --version ${requiredCliVersion}`,
  );
}

if (installedCliVersion !== requiredCliVersion) {
  die(
    `wasm-bindgen CLI ${installedCliVersion} != crate-resolved ${requiredCliVersion}.\n` +
      `The CLI and the linked lib must match. Install the pinned version:\n` +
      `  cargo install -f wasm-bindgen-cli --version ${requiredCliVersion}`,
  );
}
console.log(`[build-engine] wasm-bindgen ${installedCliVersion} matches rebuild lockfile`);

// --- 2. build the wasm + emit the browser glue ---

run('cargo', ['build', '--release', '--target', 'wasm32-unknown-unknown', '-p', 'coh_wasm'], rebuildDir);

const wasmArtifact = join(rebuildDir, 'target', 'wasm32-unknown-unknown', 'release', 'coh_wasm.wasm');
if (!existsSync(wasmArtifact)) die(`cargo did not produce ${wasmArtifact}.`);

const wasmOutDir = join(betaRoot, 'src', 'engine', 'wasm');
mkdirSync(wasmOutDir, { recursive: true });
run('wasm-bindgen', ['--target', 'web', '--out-dir', wasmOutDir, '--out-name', 'coh_wasm', wasmArtifact], betaRoot);

// --- 3. copy the per-dataset contract bundles ---

const contractSrc = join(rebuildDir, 'contract');
if (!existsSync(contractSrc)) die(`rebuild contract dir not found at ${contractSrc}.`);

// The datasets are whatever the rebuild exported — derived, never hardcoded.
const datasets = readdirSync(contractSrc).filter(
  (name) => statSync(join(contractSrc, name)).isDirectory() && existsSync(join(contractSrc, name, 'bundle.json.gz')),
);
if (datasets.length === 0) die(`no dataset bundles found under ${contractSrc} (expected <server>/bundle.json.gz).`);

const contractOut = join(betaRoot, 'public', 'engine', 'contract');
mkdirSync(contractOut, { recursive: true });
for (const dataset of datasets) {
  copyFileSync(join(contractSrc, dataset, 'bundle.json.gz'), join(contractOut, `${dataset}.json.gz`));
  console.log(`[build-engine] bundle ${dataset} -> public/engine/contract/${dataset}.json.gz`);
}

console.log(`\n[build-engine] done — ${datasets.length} dataset(s): ${datasets.join(', ')}`);
