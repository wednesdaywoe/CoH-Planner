/**
 * Luminous Detonation — COMPOSED EXPORT
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
import { LuminousDetonation as base } from '@/data/generated/powersets/peacebringer/epic/luminous-blast/luminous-detonation';
import { overrides } from '@/data/overrides/powersets/peacebringer/epic/luminous-blast/luminous-detonation';

export const LuminousDetonation: Power = withOverrides(base, overrides);
