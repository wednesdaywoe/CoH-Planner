/**
 * Aura of Madness — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense psionic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AuraofMadness as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/psionic-armor/aura-of-insanity';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/psionic-armor/aura-of-insanity';

export const AuraofMadness: Power = withOverrides(base, overrides);
