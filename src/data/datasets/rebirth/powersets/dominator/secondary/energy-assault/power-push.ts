/**
 * Power Push — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault energy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerPush as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/energy-assault/power-push';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/energy-assault/power-push';

export const PowerPush: Power = withOverrides(base, overrides);
