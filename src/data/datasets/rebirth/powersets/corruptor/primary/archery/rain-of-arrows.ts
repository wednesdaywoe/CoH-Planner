/**
 * Rain of Arrows — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RainofArrows as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/primary/archery/rain-of-arrows';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/primary/archery/rain-of-arrows';

export const RainofArrows: Power = withOverrides(base, overrides);
