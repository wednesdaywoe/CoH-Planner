/**
 * Entropy Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EntropyShield as base } from '@/data/generated/powersets/sentinel/secondary/energy-aura/entropy-shield';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/energy-aura/entropy-shield';

export const EntropyShield: Power = withOverrides(base, overrides);
