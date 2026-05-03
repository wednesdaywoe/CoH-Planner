/**
 * Intensify — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Intensify as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/storm-blast/aim';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/storm-blast/aim';

export const Intensify: Power = withOverrides(base, overrides);
