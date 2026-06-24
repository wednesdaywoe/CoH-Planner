/**
 * Kinetic Distribution — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KineticDistribution as base } from '@/data/datasets/veracity/generated/powersets/mastermind/secondary/kinetics/kinetic-distribution';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/mastermind/secondary/kinetics/kinetic-distribution';

export const KineticDistribution: Power = withOverrides(base, overrides);
