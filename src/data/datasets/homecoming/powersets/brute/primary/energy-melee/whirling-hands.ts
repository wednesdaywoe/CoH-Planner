/**
 * Whirling Hands — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee energy_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WhirlingHands as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/energy-melee/whirling-hands';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/energy-melee/whirling-hands';

export const WhirlingHands: Power = withOverrides(base, overrides);
