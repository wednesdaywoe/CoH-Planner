/**
 * Targeting Drone — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault arsenal_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TargetingDrone as base } from '@/data/generated/powersets/dominator/secondary/arsenal-assault/targeting-drone';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/arsenal-assault/targeting-drone';

export const TargetingDrone: Power = withOverrides(base, overrides);
