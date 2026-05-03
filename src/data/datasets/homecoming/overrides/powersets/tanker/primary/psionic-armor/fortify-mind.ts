/**
 * Psychokinetic Barrier (Fortify_Mind) — OVERRIDES LAYER
 *
 * Hand-written deltas for the Tanker variant. Same shape as the Brute /
 * Scrapper / Sentinel / Stalker overrides — Psychokinetic Barrier stacks
 * 3× per caster across all ATs, and the absorb + debuff-resistance
 * sub-effects scale linearly with stacks (verified manually from the .def
 * file's RefreshToCount + StackLimit 3 on the resistance template, and
 * confirmed in-game).
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  effects: {
    maxStacks: 3,
    stacksLinear: ['absorb', 'debuffResistance'],
  },
};
