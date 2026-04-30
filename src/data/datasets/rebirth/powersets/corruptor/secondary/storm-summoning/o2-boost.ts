/**
 * O2 Boost — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { O2Boost as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/storm-summoning/o2-boost';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/storm-summoning/o2-boost';

export const O2Boost: Power = withOverrides(base, overrides);
