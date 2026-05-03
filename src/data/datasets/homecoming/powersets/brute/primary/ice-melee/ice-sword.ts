/**
 * Ice Sword — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee ice_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceSword as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/ice-melee/ice-sword';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/ice-melee/ice-sword';

export const IceSword: Power = withOverrides(base, overrides);
