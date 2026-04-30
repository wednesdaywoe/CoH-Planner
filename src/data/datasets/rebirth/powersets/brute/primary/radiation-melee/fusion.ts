/**
 * Fusion — COMPOSED EXPORT
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
import { Fusion as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/radiation-melee/fusion';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/radiation-melee/fusion';

export const Fusion: Power = withOverrides(base, overrides);
