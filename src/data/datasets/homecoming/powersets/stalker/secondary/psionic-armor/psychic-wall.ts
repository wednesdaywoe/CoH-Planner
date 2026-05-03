/**
 * Psychic Wall — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense psionic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsychicWall as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/psionic-armor/psychic-wall';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/secondary/psionic-armor/psychic-wall';

export const PsychicWall: Power = withOverrides(base, overrides);
