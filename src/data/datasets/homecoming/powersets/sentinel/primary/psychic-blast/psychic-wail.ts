/**
 * Psychic Wail — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged psychic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsychicWail as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/psychic-blast/psychic-wail';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/psychic-blast/psychic-wail';

export const PsychicWail: Power = withOverrides(base, overrides);
