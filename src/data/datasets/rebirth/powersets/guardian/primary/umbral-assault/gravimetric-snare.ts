/**
 * Gravimetric Snare — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault umbral_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GravimetricSnare as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/umbral-assault/gravimetric-snare';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/umbral-assault/gravimetric-snare';

export const GravimetricSnare: Power = withOverrides(base, overrides);
