/**
 * The Node twin of `engine.ts` — same exports, wasm-node target instead of the browser one.
 *
 * `engine.ts` is browser-shaped by necessity: `__wbg_init` + `fetch` + a `?url` wasm import.
 * Under vitest that path can never load, so every test that calls `calculateCharacterTotals`
 * silently graded the all-zero fallback instead of the engine that actually ships. Vitest
 * aliases `@/engine/engine` to this file (see vite.config.ts `test.alias`) so those tests
 * grade the real calculation.
 *
 * Loading is synchronous and lazy: the wasm-node glue instantiates its `.wasm` at require
 * time and the bundles are on disk, so a dataset is loaded on first use rather than through
 * the async handshake the browser needs. Tests therefore need no `await loadDataset(...)`.
 *
 * The artifacts (`wasm-node/`, `public/engine/contract/`) are gitignored build output from
 * `npm run build:engine`. Without them this throws on first use, naming what's missing —
 * never a silent zero, which is the exact failure it exists to remove.
 */

import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type ServerId = 'homecoming' | 'rebirth' | 'thunderspy';

const here = dirname(fileURLToPath(import.meta.url));
const NODE_ENGINE = join(here, 'wasm-node', 'coh_wasm.cjs');
const BUNDLE_DIR = join(here, '..', '..', 'public', 'engine', 'contract');

interface EngineHandle {
  recalculate: (buildJson: string) => string;
  project_power: (buildJson: string, powerSet: string, internalName: string, targetsHit?: number) => string;
}

const handles = new Map<ServerId, EngineHandle>();

/** True when `build:engine` has produced both halves this module needs. */
export function engineArtifactsPresent(server?: ServerId): boolean {
  const servers: ServerId[] = server ? [server] : ['homecoming', 'rebirth', 'thunderspy'];
  return existsSync(NODE_ENGINE) && servers.every((s) => existsSync(join(BUNDLE_DIR, `${s}.json.gz`)));
}

function handleFor(server: ServerId): EngineHandle {
  const cached = handles.get(server);
  if (cached) return cached;
  if (!engineArtifactsPresent(server)) {
    throw new Error(
      `engine artifacts missing (${NODE_ENGINE} / ${server}.json.gz) — run \`npm run build:engine\`.`,
    );
  }
  const require = createRequire(import.meta.url);
  const glue = require('./wasm-node/coh_wasm.cjs') as { load_dataset: (bytes: Uint8Array) => EngineHandle };
  const handle = glue.load_dataset(new Uint8Array(readFileSync(join(BUNDLE_DIR, `${server}.json.gz`))));
  handles.set(server, handle);
  return handle;
}

export async function loadDataset(server: ServerId): Promise<void> {
  handleFor(server);
}

export function isDatasetLoaded(server: ServerId): boolean {
  return handles.has(server) || engineArtifactsPresent(server);
}

export function recalcJson(server: ServerId, buildJson: string): string | null {
  return handleFor(server).recalculate(buildJson);
}

export function projectPowerJson(
  server: ServerId,
  buildJson: string,
  powerSet: string,
  internalName: string,
  targetsHit?: number,
): string | null {
  return handleFor(server).project_power(buildJson, powerSet, internalName, targetsHit);
}
