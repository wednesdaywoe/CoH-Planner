/**
 * Frost — COMPOSED EXPORT
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
import { Frost as base } from '@/data/generated/powersets/stalker/primary/ice-melee/frost';
import { overrides } from '@/data/overrides/powersets/stalker/primary/ice-melee/frost';

export const Frost: Power = withOverrides(base, overrides);
