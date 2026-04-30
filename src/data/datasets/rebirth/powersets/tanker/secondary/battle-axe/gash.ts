/**
 * Beheader — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee battle_axe
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Beheader as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/battle-axe/gash';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/battle-axe/gash';

export const Beheader: Power = withOverrides(base, overrides);
