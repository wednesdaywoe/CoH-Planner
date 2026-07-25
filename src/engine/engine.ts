/**
 * SPIKE5 — the engine boundary the beta app talks to.
 *
 * Wraps the generated `coh_wasm` wasm-bindgen glue: one wasm instantiation, one
 * `DatasetHandle` per dataset (cached; the heavyweight `PowerDatabase` stays in wasm), and
 * a synchronous `recalcJson` the totals hook calls once a dataset is loaded.
 *
 * Local-only spike scaffolding: the bundles are the REBUILD's contract bundles copied to
 * `public/engine/contract/`, not the beta's own data — `coh_wasm.load_dataset` reads the
 * rebuild wire format.
 */

import __wbg_init, { load_dataset, type DatasetHandle } from './wasm/coh_wasm';
import wasmUrl from './wasm/coh_wasm_bg.wasm?url';

export type ServerId = 'homecoming' | 'rebirth' | 'thunderspy';

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
    const url = `${import.meta.env.BASE_URL}engine/contract/${server}.json.gz`;
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
