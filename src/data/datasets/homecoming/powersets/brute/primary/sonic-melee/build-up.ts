/**
 * Sound Booster — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee sonic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SoundBooster as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/sonic-melee/build-up';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/sonic-melee/build-up';

export const SoundBooster: Power = withOverrides(base, overrides);
