/**
 * Arctic Air — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control ice_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ArcticAir as base } from '@/data/datasets/homecoming/generated/powersets/dominator/primary/ice-control/arctic-air';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/primary/ice-control/arctic-air';

export const ArcticAir: Power = withOverrides(base, overrides);
