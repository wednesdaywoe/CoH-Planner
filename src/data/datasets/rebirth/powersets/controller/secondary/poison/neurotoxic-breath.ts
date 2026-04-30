/**
 * Neurotoxic Breath — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { NeurotoxicBreath as base } from '@/data/datasets/rebirth/generated/powersets/controller/secondary/poison/neurotoxic-breath';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/secondary/poison/neurotoxic-breath';

export const NeurotoxicBreath: Power = withOverrides(base, overrides);
