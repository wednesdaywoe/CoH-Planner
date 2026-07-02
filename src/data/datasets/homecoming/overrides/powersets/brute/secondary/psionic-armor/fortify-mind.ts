/**
 * Psychokinetic Barrier (Fortify_Mind) — OVERRIDES LAYER
 *
 * No hand-written deltas. The stacking metadata this power needs is now emitted
 * DATA-DRIVEN by the converter (`scripts/convert-powerset.cjs`), which since the
 * RefreshToCount fix produces:
 *   - effects.maxStacks: 3 — the debuff-resistance template is RefreshToCount,
 *     StackLimit 3 (recognized by detectSelfStacking).
 *   - effects.stacksLinear: ['absorb', 'debuffResistance'] — the two effects
 *     that scale with stacks (Absorb via its Stack template; the -Regen/-Recovery/
 *     -Recharge/-Endurance debuff-resistance via RefreshToCount). maxHP and the
 *     +Regen buff are `Replace`, so they do NOT stack and are excluded.
 *   - effects.stackCaps: { absorb: 2 } — absorb caps at 2 while the slider
 *     ranges to 3 for the debuff-resistance.
 * This matches the previously hand-verified intent; the override is empty because
 * the generator now covers it. See stacking-flaw-fix.verify.test.ts.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
