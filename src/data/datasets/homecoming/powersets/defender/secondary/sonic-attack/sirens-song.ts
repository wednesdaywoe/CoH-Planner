/**
 * Siren's Song — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged sonic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SirensSong as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/sonic-attack/sirens-song';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/sonic-attack/sirens-song';

export const SirensSong: Power = withOverrides(base, overrides);
