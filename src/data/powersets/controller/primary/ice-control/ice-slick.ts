/**
 * Ice Slick — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control ice_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceSlick as base } from '@/data/generated/powersets/controller/primary/ice-control/ice-slick';
import { overrides } from '@/data/overrides/powersets/controller/primary/ice-control/ice-slick';

export const IceSlick: Power = withOverrides(base, overrides);
