/**
 * Heart of Darkness — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control darkness_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeartofDarkness as base } from '@/data/datasets/homecoming/generated/powersets/controller/primary/darkness-control/heart-of-darkness';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/primary/darkness-control/heart-of-darkness';

export const HeartofDarkness: Power = withOverrides(base, overrides);
