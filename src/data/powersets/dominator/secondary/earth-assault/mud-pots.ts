/**
 * Mud Pots — COMPOSED EXPORT
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
import { MudPots as base } from '@/data/generated/powersets/dominator/secondary/earth-assault/mud-pots';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/earth-assault/mud-pots';

export const MudPots: Power = withOverrides(base, overrides);
