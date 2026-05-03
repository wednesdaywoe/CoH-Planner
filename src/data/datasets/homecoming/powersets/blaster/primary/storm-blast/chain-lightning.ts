/**
 * Chain Lightning — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChainLightning as base } from '@/data/generated/powersets/blaster/primary/storm-blast/chain-lightning';
import { overrides } from '@/data/overrides/powersets/blaster/primary/storm-blast/chain-lightning';

export const ChainLightning: Power = withOverrides(base, overrides);
