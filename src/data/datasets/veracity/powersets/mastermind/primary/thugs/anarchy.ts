/**
 * Anarchy — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon thugs
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Anarchy as base } from '@/data/datasets/veracity/generated/powersets/mastermind/primary/thugs/anarchy';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/mastermind/primary/thugs/anarchy';

export const Anarchy: Power = withOverrides(base, overrides);
