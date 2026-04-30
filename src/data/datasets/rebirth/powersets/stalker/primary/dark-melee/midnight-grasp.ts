/**
 * Midnight Grasp — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MidnightGrasp as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/dark-melee/midnight-grasp';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/dark-melee/midnight-grasp';

export const MidnightGrasp: Power = withOverrides(base, overrides);
