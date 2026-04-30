/**
 * Assassin's Staff — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsStaff as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/staff-fighting/assassins-staff';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/staff-fighting/assassins-staff';

export const AssassinsStaff: Power = withOverrides(base, overrides);
