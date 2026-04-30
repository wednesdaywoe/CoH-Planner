/**
 * Lightning Rod — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee electrical_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightningRod as base } from '@/data/generated/powersets/brute/primary/electrical-melee/lightning-rod';
import { overrides } from '@/data/overrides/powersets/brute/primary/electrical-melee/lightning-rod';

export const LightningRod: Power = withOverrides(base, overrides);
