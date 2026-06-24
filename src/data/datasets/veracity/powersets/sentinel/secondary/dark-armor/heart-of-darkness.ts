/**
 * Heart of Darkness — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeartofDarkness as base } from '@/data/datasets/veracity/generated/powersets/sentinel/secondary/dark-armor/heart-of-darkness';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/sentinel/secondary/dark-armor/heart-of-darkness';

export const HeartofDarkness: Power = withOverrides(base, overrides);
