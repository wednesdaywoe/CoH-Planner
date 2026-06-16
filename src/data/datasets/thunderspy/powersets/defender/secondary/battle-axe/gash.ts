/**
 * Beheader — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged battle_axe
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gash as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/battle-axe/gash';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/battle-axe/gash';

export const Gash: Power = withOverrides(base, overrides);
