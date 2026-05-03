/**
 * Psychokinetic Barrier (Fortify_Mind) — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of
 * src/data/generated/powersets/brute/secondary/psionic-armor/fortify-mind.ts
 * via `withOverrides()`. Survives regeneration of the generated layer.
 *
 * What's overridden:
 *   - effects.maxStacks: 3 — Psychokinetic Barrier stacks 3× per caster.
 *     Verified manually from the .def file (RefreshToCount + StackLimit 3 on
 *     the resistance template). The bin-crawler parser surfaces this in
 *     stack_limit on the right template, but the convert script's effects
 *     extractor doesn't translate it to the planner's maxStacks field yet.
 *   - effects.stacksLinear: which sub-effects scale linearly with stacks.
 *     Self-confirmed in-game: absorb stacks (per-cast Absorb adds), debuff
 *     resistance stacks (Endurance/Recovery/Recharge/Regen res stack); but
 *     maxHP and regen do NOT stack with self.
 *
 * Both are planner-side display fields with no equivalent in the binary —
 * they tell the dashboard's stacking slider what to do.
 *
 * The `withOverrides` helper deep-merges the `effects` field, so this object
 * augments the generated effects rather than replacing it.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  effects: {
    maxStacks: 3,
    stacksLinear: ['absorb', 'debuffResistance'],
  },
};
