/**
 * Drowning Pool — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control water_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DrowningPool as base } from '@/data/generated/powersets/dominator/primary/water-control/drowning-pool';
import { overrides } from '@/data/overrides/powersets/dominator/primary/water-control/drowning-pool';

export const DrowningPool: Power = withOverrides(base, overrides);
