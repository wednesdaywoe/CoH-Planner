/**
 * Chilling Ray — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChillingRay as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/ice-blast/chilling-ray';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/ice-blast/chilling-ray';

export const ChillingRay: Power = withOverrides(base, overrides);
