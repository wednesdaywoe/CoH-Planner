/**
 * Headshot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Headshot as base } from '@/data/datasets/veracity/generated/powersets/sentinel/primary/assault-rifle/headshot';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/sentinel/primary/assault-rifle/headshot';

export const Headshot: Power = withOverrides(base, overrides);
