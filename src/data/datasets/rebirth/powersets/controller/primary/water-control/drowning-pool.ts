/**
 * Drowning Pool — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control water_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DrowningPool as base } from '@/data/datasets/rebirth/generated/powersets/controller/primary/water-control/drowning-pool';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/primary/water-control/drowning-pool';

export const DrowningPool: Power = withOverrides(base, overrides);
