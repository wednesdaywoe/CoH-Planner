/**
 * Chilling Embrace — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault icy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChillingEmbrace as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/icy-assault/chilling-embrace';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/icy-assault/chilling-embrace';

export const ChillingEmbrace: Power = withOverrides(base, overrides);
