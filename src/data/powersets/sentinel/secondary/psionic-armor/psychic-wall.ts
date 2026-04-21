/**
 * Psychic Wall — COMPOSED EXPORT
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
import { PsychicWall as base } from '@/data/generated/powersets/sentinel/secondary/psionic-armor/psychic-wall';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/psionic-armor/psychic-wall';

export const PsychicWall: Power = withOverrides(base, overrides);
