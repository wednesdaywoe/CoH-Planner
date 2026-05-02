/**
 * Freezing Touch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee ice_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FreezingTouch as base } from '@/data/generated/powersets/tanker/secondary/ice-melee/freezing-touch';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/ice-melee/freezing-touch';

export const FreezingTouch: Power = withOverrides(base, overrides);
