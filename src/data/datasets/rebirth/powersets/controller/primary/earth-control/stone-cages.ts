/**
 * Stone Cages — COMPOSED EXPORT
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
import { StoneCages as base } from '@/data/datasets/rebirth/generated/powersets/controller/primary/earth-control/stone-cages';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/primary/earth-control/stone-cages';

export const StoneCages: Power = withOverrides(base, overrides);
