/**
 * Oxygenate — COMPOSED EXPORT
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
import { Oxygenate as base } from '@/data/datasets/thunderspy/generated/powersets/controller/secondary/storm-summoning/oxygenate';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/controller/secondary/storm-summoning/oxygenate';

export const Oxygenate: Power = withOverrides(base, overrides);
