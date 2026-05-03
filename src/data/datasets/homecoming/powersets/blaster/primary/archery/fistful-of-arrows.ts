/**
 * Fistful of Arrows — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FistfulofArrows as base } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/archery/fistful-of-arrows';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/primary/archery/fistful-of-arrows';

export const FistfulofArrows: Power = withOverrides(base, overrides);
