/**
 * Gale — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gale as base } from '@/data/datasets/rebirth/generated/powersets/controller/secondary/storm-summoning/gale';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/secondary/storm-summoning/gale';

export const Gale: Power = withOverrides(base, overrides);
