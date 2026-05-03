/**
 * Chilling Embrace — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChillingEmbrace as base } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/ice-armor/chilling-embrace';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/secondary/ice-armor/chilling-embrace';

export const ChillingEmbrace: Power = withOverrides(base, overrides);
