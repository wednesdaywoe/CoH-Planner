/**
 * Deadly Fingertips — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DeadlyFingertips as base } from '@/data/datasets/veracity/generated/powersets/brute/primary/dark-melee/deadly-fingertips';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/brute/primary/dark-melee/deadly-fingertips';

export const DeadlyFingertips: Power = withOverrides(base, overrides);
