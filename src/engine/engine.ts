/**
 * SPIKE5 — the engine boundary the beta app talks to.
 *
 * Wraps the generated `coh_wasm` wasm-bindgen glue: one wasm instantiation, one
 * `DatasetHandle` per dataset (cached; the heavyweight `PowerDatabase` stays in wasm), and
 * a synchronous `recalcJson` the totals hook calls once a dataset is loaded.
 *
 * The bundles are the REBUILD's contract bundles, copied to `public/engine/contract/` by
 * `npm run build:engine` — not the beta's own data; `coh_wasm.load_dataset` reads the rebuild
 * wire format. Both the glue under `wasm/` and those bundles are COMMITTED build output, so
 * this repo builds and deploys with only Node (see .gitignore). Refresh them with
 * `npm run build:engine` whenever the engine changes.
 *
 * `engine.node.ts` is the same API over the wasm-node target — what vitest runs against.
 */

import __wbg_init, { load_dataset, what_if_vocabulary, type DatasetHandle } from './wasm/coh_wasm';
import wasmUrl from './wasm/coh_wasm_bg.wasm?url';
import type { DatasetId } from '@/data/dataset';
import { ENGINE_BUNDLE_VERSIONS } from './bundleVersions.generated';

// One roster. A restated union here is a dataset the engine facade silently cannot name.
export type ServerId = DatasetId;

let wasmReady: Promise<void> | null = null;
const handles = new Map<ServerId, DatasetHandle>();
const inflight = new Map<ServerId, Promise<void>>();

function ensureWasm(): Promise<void> {
  if (!wasmReady) {
    wasmReady = __wbg_init({ module_or_path: wasmUrl }).then(() => undefined);
  }
  return wasmReady;
}

/**
 * Load a dataset's `DatasetHandle` (idempotent; dedupes concurrent calls). Resolves when
 * the handle is cached and `recalcJson(server, …)` will return engine output.
 */
export async function loadDataset(server: ServerId): Promise<void> {
  if (handles.has(server)) return;
  const existing = inflight.get(server);
  if (existing) return existing;

  const task = (async () => {
    await ensureWasm();
    // The bundle is served as raw gzip bytes; `load_dataset` gz-sniffs (a static host may
    // also transparently gunzip, which the sniff likewise handles).
    //
    // `?v=` is the bundle's content hash (stamped by scripts/build-engine.mjs). The filename
    // is not hashed, so without it an HTTP cache can hand a stale bundle to a .wasm built
    // against a newer schema — which does not degrade, it fails the load outright ("missing
    // field `absorbCap`", reported 2026-07-28, cleared only by a hard refresh). The service
    // worker already pairs the two halves for SW-controlled loads; this covers every other
    // load. Workbox is told to ignore the `v` parameter, so the precached entry still matches.
    const version = ENGINE_BUNDLE_VERSIONS[server];
    const url =
      `${import.meta.env.BASE_URL}engine/contract/${server}.json.gz` +
      (version ? `?v=${version}` : '');
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`engine bundle fetch ${server}: HTTP ${resp.status}`);
    const bytes = new Uint8Array(await resp.arrayBuffer());
    handles.set(server, load_dataset(bytes));
  })();

  inflight.set(server, task);
  try {
    await task;
  } finally {
    inflight.delete(server);
  }
}

/**
 * The stat names a what-if TEAM-BUFF entry may use — the engine's own answer, so the modal's
 * controls and the injection that consumes them cannot name different things.
 *
 * Dataset-independent (it is a property of the accumulator, not of any fork's data), but it
 * still needs the wasm module INITIALIZED, so it returns an empty list before the first
 * `loadDataset` resolves rather than throwing. A modal opened that early renders no controls,
 * which is honest: the engine cannot yet accept one.
 */
export function whatIfVocabulary(): string[] {
  if (handles.size === 0) return [];
  return JSON.parse(what_if_vocabulary()) as string[];
}

/** True once `server`'s handle is loaded and `recalcJson` will return engine output. */
export function isDatasetLoaded(server: ServerId): boolean {
  return handles.has(server);
}

/**
 * Recalculate totals for a serialized `CharacterState`. Returns the engine's
 * `CalculatedTotals` JSON, or `null` if the dataset isn't loaded yet (the caller renders
 * empty totals until `loadDataset` resolves). Throws only on a genuine engine error (bad
 * build JSON), which the caller surfaces loudly.
 */
export function recalcJson(server: ServerId, buildJson: string): string | null {
  const handle = handles.get(server);
  return handle ? handle.recalculate(buildJson) : null;
}

/**
 * Project ONE power against a serialized `CharacterState` — including a power the build does
 * not hold, which is what the info surfaces render while you hover the picker (PROD6C). The
 * build's `power_projection` block already covers every SELECTED power, so this is only for
 * the unheld case — which is also why `targetsHit` is a parameter: a held power carries its
 * stacking-slider value on its own selection, an unheld one has no selection to carry it. Returns the engine's `PowerProjection` JSON, `"null"` for a ref the
 * dataset has no power for, or `null` if the dataset isn't loaded yet.
 */
export function projectPowerJson(
  server: ServerId,
  buildJson: string,
  powerSet: string,
  internalName: string,
  targetsHit?: number,
): string | null {
  const handle = handles.get(server);
  return handle ? handle.project_power(buildJson, powerSet, internalName, targetsHit) : null;
}

/**
 * The target ranks this dataset's gates distinguish — JSON `[{segment, classes}]`, the
 * vocabulary a caller picks a `combat.target_class` token from before asking
 * `projectPowerJson` for target-resolved damage (the Scrapper crit rows gate on target
 * rank). Derived by the engine from the gates themselves, so no rank or class name is
 * authored on this side of the boundary. `null` if the dataset isn't loaded yet.
 */
export function targetRanksJson(server: ServerId): string | null {
  const handle = handles.get(server);
  return handle ? handle.target_ranks() : null;
}
