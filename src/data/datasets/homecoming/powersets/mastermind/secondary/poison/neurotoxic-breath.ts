/**
 * Neurotoxic Breath — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { NeurotoxicBreath as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/poison/neurotoxic-breath';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/poison/neurotoxic-breath';

export const NeurotoxicBreath: Power = withOverrides(base, overrides);
