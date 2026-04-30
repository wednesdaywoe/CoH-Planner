/**
 * Will Domination — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged psychic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WillDomination as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/psychic-blast/will-domination';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/psychic-blast/will-domination';

export const WillDomination: Power = withOverrides(base, overrides);
