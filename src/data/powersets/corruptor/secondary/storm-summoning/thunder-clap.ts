/**
 * Thunder Clap — COMPOSED EXPORT
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
import { ThunderClap as base } from '@/data/generated/powersets/corruptor/secondary/storm-summoning/thunder-clap';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/storm-summoning/thunder-clap';

export const ThunderClap: Power = withOverrides(base, overrides);
