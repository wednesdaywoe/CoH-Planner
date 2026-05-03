/**
 * Frozen Fists — COMPOSED EXPORT
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
import { FrozenFists as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/ice-melee/frozen-fists';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/ice-melee/frozen-fists';

export const FrozenFists: Power = withOverrides(base, overrides);
