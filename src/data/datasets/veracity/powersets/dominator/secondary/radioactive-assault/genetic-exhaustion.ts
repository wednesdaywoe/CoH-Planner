/**
 * Genetic Exhaustion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault radioactive_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GeneticExhaustion as base } from '@/data/datasets/veracity/generated/powersets/dominator/secondary/radioactive-assault/genetic-exhaustion';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/dominator/secondary/radioactive-assault/genetic-exhaustion';

export const GeneticExhaustion: Power = withOverrides(base, overrides);
