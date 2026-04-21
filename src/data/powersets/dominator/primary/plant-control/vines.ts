/**
 * Vines — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control plant_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Vines as base } from '@/data/generated/powersets/dominator/primary/plant-control/vines';
import { overrides } from '@/data/overrides/powersets/dominator/primary/plant-control/vines';

export const Vines: Power = withOverrides(base, overrides);
