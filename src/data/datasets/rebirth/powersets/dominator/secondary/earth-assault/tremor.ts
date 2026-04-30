/**
 * Tremor — COMPOSED EXPORT
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
import { Tremor as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/earth-assault/tremor';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/earth-assault/tremor';

export const Tremor: Power = withOverrides(base, overrides);
