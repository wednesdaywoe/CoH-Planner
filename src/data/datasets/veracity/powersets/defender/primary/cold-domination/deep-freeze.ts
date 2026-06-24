/**
 * Deep Freeze — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DeepFreeze as base } from '@/data/datasets/veracity/generated/powersets/defender/primary/cold-domination/deep-freeze';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/defender/primary/cold-domination/deep-freeze';

export const DeepFreeze: Power = withOverrides(base, overrides);
