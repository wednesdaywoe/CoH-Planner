/**
 * Antidote — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Antidote as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/poison/antidote';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/poison/antidote';

export const Antidote: Power = withOverrides(base, overrides);
