/**
 * Wrath — COMPOSED EXPORT
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
import { Wrath as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/radiant-blast/wrath';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/radiant-blast/wrath';

export const Wrath: Power = withOverrides(base, overrides);
