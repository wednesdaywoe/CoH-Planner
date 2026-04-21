/**
 * Glinting Eye — COMPOSED EXPORT
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
import { GlintingEye as base } from '@/data/generated/powersets/peacebringer/epic/luminous-blast/glinting-eye';
import { overrides } from '@/data/overrides/powersets/peacebringer/epic/luminous-blast/glinting-eye';

export const GlintingEye: Power = withOverrides(base, overrides);
