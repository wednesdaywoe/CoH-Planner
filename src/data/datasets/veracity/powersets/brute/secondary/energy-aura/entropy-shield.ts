/**
 * Entropic Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EntropyShield as base } from '@/data/datasets/veracity/generated/powersets/brute/secondary/energy-aura/entropy-shield';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/brute/secondary/energy-aura/entropy-shield';

export const EntropyShield: Power = withOverrides(base, overrides);
