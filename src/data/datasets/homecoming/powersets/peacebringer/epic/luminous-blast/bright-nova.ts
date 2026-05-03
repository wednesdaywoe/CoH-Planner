/**
 * Bright Nova — COMPOSED EXPORT
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
import { BrightNova as base } from '@/data/datasets/homecoming/generated/powersets/peacebringer/epic/luminous-blast/bright-nova';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/peacebringer/epic/luminous-blast/bright-nova';

export const BrightNova: Power = withOverrides(base, overrides);
