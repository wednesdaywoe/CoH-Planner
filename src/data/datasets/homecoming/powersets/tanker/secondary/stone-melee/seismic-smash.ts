/**
 * Seismic Smash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee stone_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeismicSmash as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/stone-melee/seismic-smash';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/stone-melee/seismic-smash';

export const SeismicSmash: Power = withOverrides(base, overrides);
