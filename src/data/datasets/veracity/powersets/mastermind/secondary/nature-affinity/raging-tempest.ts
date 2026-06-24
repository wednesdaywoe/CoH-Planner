/**
 * Entangling Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RagingTempest as base } from '@/data/datasets/veracity/generated/powersets/mastermind/secondary/nature-affinity/raging-tempest';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/mastermind/secondary/nature-affinity/raging-tempest';

export const RagingTempest: Power = withOverrides(base, overrides);
