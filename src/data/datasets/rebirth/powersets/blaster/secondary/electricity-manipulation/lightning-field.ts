/**
 * Lightning Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightningField as base } from '@/data/datasets/rebirth/generated/powersets/blaster/secondary/electricity-manipulation/lightning-field';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/secondary/electricity-manipulation/lightning-field';

export const LightningField: Power = withOverrides(base, overrides);
