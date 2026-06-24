/**
 * Harmonic Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged sonic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HarmonicField as base } from '@/data/datasets/veracity/generated/powersets/corruptor/primary/sonic-attacks/harmonic-field';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/corruptor/primary/sonic-attacks/harmonic-field';

export const HarmonicField: Power = withOverrides(base, overrides);
