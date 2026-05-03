/**
 * Devastating Blow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee radiation_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DevastatingBlow as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/radiation-melee/devastating-blow';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/radiation-melee/devastating-blow';

export const DevastatingBlow: Power = withOverrides(base, overrides);
