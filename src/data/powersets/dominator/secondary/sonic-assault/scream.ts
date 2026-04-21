/**
 * Scream — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault sonic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Scream as base } from '@/data/generated/powersets/dominator/secondary/sonic-assault/scream';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/sonic-assault/scream';

export const Scream: Power = withOverrides(base, overrides);
