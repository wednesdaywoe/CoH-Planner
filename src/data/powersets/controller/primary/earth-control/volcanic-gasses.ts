/**
 * Volcanic Gasses — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control earth_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { VolcanicGasses as base } from '@/data/generated/powersets/controller/primary/earth-control/volcanic-gasses';
import { overrides } from '@/data/overrides/powersets/controller/primary/earth-control/volcanic-gasses';

export const VolcanicGasses: Power = withOverrides(base, overrides);
