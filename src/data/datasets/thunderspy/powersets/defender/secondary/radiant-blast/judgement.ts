/**
 * Judgement — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged holy_light
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Judgement as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/radiant-blast/judgement';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/radiant-blast/judgement';

export const Judgement: Power = withOverrides(base, overrides);
