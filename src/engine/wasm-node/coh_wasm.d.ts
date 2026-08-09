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
    /**
     * The target ranks this dataset's gates distinguish, as JSON `[{segment, classes}]`
     * — the vocabulary a caller picks a `combat.target_class` token from before asking
     * [`Self::project_power`] for target-resolved damage. Throws when the archetype
     * catalogue will not parse rather than offering a guessed list (Rule 1).
     */
    target_ranks(): string;
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
