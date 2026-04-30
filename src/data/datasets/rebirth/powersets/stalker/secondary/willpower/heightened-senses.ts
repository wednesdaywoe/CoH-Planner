/**
 * Heightened Senses — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense willpower
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeightenedSenses as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/willpower/heightened-senses';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/willpower/heightened-senses';

export const HeightenedSenses: Power = withOverrides(base, overrides);
