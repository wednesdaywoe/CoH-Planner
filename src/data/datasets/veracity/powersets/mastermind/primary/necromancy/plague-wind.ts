/**
 * Plague Wind — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon necromancy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PlagueWind as base } from '@/data/datasets/veracity/generated/powersets/mastermind/primary/necromancy/plague-wind';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/mastermind/primary/necromancy/plague-wind';

export const PlagueWind: Power = withOverrides(base, overrides);
