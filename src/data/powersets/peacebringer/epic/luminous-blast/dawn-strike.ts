/**
 * Dawn Strike — COMPOSED EXPORT
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
import { DawnStrike as base } from '@/data/generated/powersets/peacebringer/epic/luminous-blast/dawn-strike';
import { overrides } from '@/data/overrides/powersets/peacebringer/epic/luminous-blast/dawn-strike';

export const DawnStrike: Power = withOverrides(base, overrides);
