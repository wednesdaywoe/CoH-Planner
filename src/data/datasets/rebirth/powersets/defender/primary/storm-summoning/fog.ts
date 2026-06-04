/**
 * Freezing Rain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Fog as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/storm-summoning/fog';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/storm-summoning/fog';

export const Fog: Power = withOverrides(base, overrides);
