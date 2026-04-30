/**
 * Fistful of Arrows — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FistfulofArrows as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/archery/fistful-of-arrows';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/archery/fistful-of-arrows';

export const FistfulofArrows: Power = withOverrides(base, overrides);
