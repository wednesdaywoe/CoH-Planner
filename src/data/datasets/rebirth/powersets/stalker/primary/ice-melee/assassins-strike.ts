/**
 * Assassin's Icicle — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee ice_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsIcicle as base } from '@/data/generated/powersets/stalker/primary/ice-melee/assassins-strike';
import { overrides } from '@/data/overrides/powersets/stalker/primary/ice-melee/assassins-strike';

export const AssassinsIcicle: Power = withOverrides(base, overrides);
