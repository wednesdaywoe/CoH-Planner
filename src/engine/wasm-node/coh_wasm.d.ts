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
