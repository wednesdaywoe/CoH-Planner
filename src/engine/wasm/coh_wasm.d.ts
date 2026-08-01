/* tslint:disable */
/* eslint-disable */

/**
 * An opaque handle to a loaded dataset. Owns the [`PowerDatabase`] on the Rust side of
 * the boundary — the definitions never cross into JS. The JS caller holds the handle
 * for the app's lifetime (loaded once at boot) and passes it back into `recalculate`.
 */
export class DatasetHandle {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Project one power against this build — including a power the build does not hold,
     * which is what the info tooltip renders while you hover the picker (PROD6C).
     * Returns the `PowerProjection` JSON, or `"null"` for a ref this dataset has no
     * power for. `targets_hit` is that power's stacking-slider value (PROD6C-3b); the
     * surfaces keep it by name, so an unheld power can carry one too.
     */
    project_power(build_json: string, powerset: string, internal_name: string, targets_hit?: number | null): string;
    /**
     * Recalculate totals for a build. `build_json` is the SPIKE4 adapter's
     * `CharacterState` JSON; returns the `CalculatedTotals` as JSON. Throws a JS
     * `Error` on a parse failure rather than returning garbage.
     */
    recalculate(build_json: string): string;
}

/**
 * Load a dataset bundle (gz or raw JSON bytes) into an opaque [`DatasetHandle`].
 */
export function load_dataset(bytes: Uint8Array): DatasetHandle;

/**
 * The stat names a what-if TEAM-BUFF entry may use, as a JSON array of strings.
 *
 * Dataset-independent, so it hangs off the module rather than a [`DatasetHandle`]: the
 * vocabulary is a property of the ACCUMULATOR (which fields it routes and which of those
 * are accumulations rather than baselines), not of any fork's data.
 *
 * Exported so the beta's what-if modal derives its controls from the same answer the
 * engine's own injection uses. A hand-kept list on the JS side would be a second stat
 * vocabulary free to drift — the exact shape PROD6A killed.
 */
export function what_if_vocabulary(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_datasethandle_free: (a: number, b: number) => void;
    readonly datasethandle_project_power: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number, number];
    readonly datasethandle_recalculate: (a: number, b: number, c: number) => [number, number, number, number];
    readonly load_dataset: (a: number, b: number) => [number, number, number];
    readonly what_if_vocabulary: () => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
