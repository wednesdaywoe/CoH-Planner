/**
 * Thunder Clap — COMPOSED EXPORT
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
import { ThunderClap as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/storm-summoning/thunder-clap';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/storm-summoning/thunder-clap';

export const ThunderClap: Power = withOverrides(base, overrides);
