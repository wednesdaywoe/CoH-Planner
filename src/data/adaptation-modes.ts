/**
 * Bio Armor Adaptation modes — app-side registry.
 *
 * Bio Armor's "Adaptation" toggle cycles a character through three mutually
 * exclusive stances. Each stance unlocks mode-gated bonuses spread across the
 * *other* Bio Armor powers (Environmental Modification's +Def/+ToHit, DNA
 * Siphon's -Regen, Hardened Carapace's resistances, …), gated in the binary on
 * `kDefensiveAdaptation / kOffensiveAdaptation / kRestedAdaptation Source.Mode?`.
 *
 * Because the modes are caster-state and cross-power, they live in the shared
 * `globalAdjusters` map keyed by the bare conditional `id`. The mode-gated
 * conditionalEffects on each Bio Armor power reference these same ids, so a
 * single selection drives every power at once (and the dashboard calc — see
 * `expandActiveConditionals` in character-totals.ts).
 *
 * This registry is the single source of truth used by:
 *  - the global Adaptation selector and the per-power InfoPanel selector, and
 *  - the mutual-exclusivity wiring (`setGlobalAdjusterGroup(activeId, IDS)`).
 *
 * Note on labels: the binary's internal name for the third stance is "Rested",
 * but in-game (and in every power description) it is shown as **Efficient
 * Adaptation** — e.g. DNA Siphon reads "While Efficient Adaptation is active…".
 * We key on the data id (`restedadaptation`) but display the in-game name.
 */

export interface AdaptationMode {
  /** Conditional id used in `globalAdjusters` and the generated
   *  `conditionalEffects[].id`. Matches the binary `k<Name>Adaptation` gate. */
  id: string;
  /** In-game label shown in selectors (matches power descriptions). */
  label: string;
  /** Short label for compact controls (chips, the dashboard mini-selector). */
  short: string;
}

export const ADAPTATION_MODES: readonly AdaptationMode[] = [
  { id: 'defensiveadaptation', label: 'Defensive Adaptation', short: 'Defensive' },
  { id: 'offensiveadaptation', label: 'Offensive Adaptation', short: 'Offensive' },
  { id: 'restedadaptation', label: 'Efficient Adaptation', short: 'Efficient' },
] as const;

/** All three mode ids, in canonical order. Pass as the `siblingIds` argument to
 *  `setGlobalAdjusterGroup` so selecting one clears the other two. */
export const ADAPTATION_MODE_IDS: readonly string[] = ADAPTATION_MODES.map((m) => m.id);

const ADAPTATION_MODE_ID_SET = new Set(ADAPTATION_MODE_IDS);

/** True when a conditional `id` is one of the Bio Armor adaptation modes. Used
 *  by the UI to expand a single mode conditional into the full mutex group and
 *  to drive registry-backed mutual exclusivity. */
export function isAdaptationModeId(id: string): boolean {
  return ADAPTATION_MODE_ID_SET.has(id);
}

/** The currently active mode id from a `globalAdjusters` map, or null when none
 *  is selected. At most one is ever true (mutual exclusivity is enforced on
 *  selection), so the first match wins. */
export function getActiveAdaptationModeId(
  globalAdjusters: Record<string, boolean>,
): string | null {
  for (const m of ADAPTATION_MODES) {
    if (globalAdjusters[m.id]) return m.id;
  }
  return null;
}
