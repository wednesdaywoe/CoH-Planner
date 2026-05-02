/**
 * Arctic Air — COMPOSED EXPORT
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
import { ArcticAir as base } from '@/data/generated/powersets/controller/primary/ice-control/artic-air';
import { overrides } from '@/data/overrides/powersets/controller/primary/ice-control/artic-air';

export const ArcticAir: Power = withOverrides(base, overrides);
