/**
 * Venomous Gas — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { VenomousGas as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/secondary/poison/venomous-gas';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/secondary/poison/venomous-gas';

export const VenomousGas: Power = withOverrides(base, overrides);
