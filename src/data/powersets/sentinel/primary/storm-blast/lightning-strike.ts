/**
 * Lightning Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightningStrike as base } from '@/data/generated/powersets/sentinel/primary/storm-blast/lightning-strike';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/storm-blast/lightning-strike';

export const LightningStrike: Power = withOverrides(base, overrides);
