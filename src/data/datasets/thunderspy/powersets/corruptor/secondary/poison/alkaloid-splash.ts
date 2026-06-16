/**
 * Alkaloid Splash — COMPOSED EXPORT
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
import { AlkaloidSplash as base } from '@/data/datasets/thunderspy/generated/powersets/corruptor/secondary/poison/alkaloid-splash';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/corruptor/secondary/poison/alkaloid-splash';

export const AlkaloidSplash: Power = withOverrides(base, overrides);
