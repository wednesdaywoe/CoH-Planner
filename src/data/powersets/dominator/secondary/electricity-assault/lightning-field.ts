/**
 * Lightning Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightningBolt as base } from '@/data/generated/powersets/dominator/secondary/electricity-assault/lightning-field';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/electricity-assault/lightning-field';

export const LightningBolt: Power = withOverrides(base, overrides);
