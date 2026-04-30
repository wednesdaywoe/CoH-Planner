/**
 * Radiant Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs peacebringer_offensive luminous_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RadiantStrike as base } from '@/data/datasets/rebirth/generated/powersets/peacebringer/epic/luminous-blast/radiant-strike';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/peacebringer/epic/luminous-blast/radiant-strike';

export const RadiantStrike: Power = withOverrides(base, overrides);
