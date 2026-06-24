/**
 * Stellar Wind — COMPOSED EXPORT
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
import { StellarWind as base } from '@/data/datasets/veracity/generated/powersets/defender/primary/storm-summoning/stellar-wind';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/defender/primary/storm-summoning/stellar-wind';

export const StellarWind: Power = withOverrides(base, overrides);
