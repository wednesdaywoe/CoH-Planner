/**
 * Stone Mallet — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault earth_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StoneMallet as base } from '@/data/generated/powersets/dominator/secondary/earth-assault/stone-mallet';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/earth-assault/stone-mallet';

export const StoneMallet: Power = withOverrides(base, overrides);
