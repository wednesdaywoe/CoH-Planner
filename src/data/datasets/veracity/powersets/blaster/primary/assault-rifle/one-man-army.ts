/**
 * One Man Army — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { OneManArmy as base } from '@/data/datasets/veracity/generated/powersets/blaster/primary/assault-rifle/one-man-army';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/blaster/primary/assault-rifle/one-man-army';

export const OneManArmy: Power = withOverrides(base, overrides);
