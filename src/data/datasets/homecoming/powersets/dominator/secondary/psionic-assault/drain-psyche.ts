/**
 * Drain Psyche — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault psionic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DrainPsyche as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/psionic-assault/drain-psyche';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/psionic-assault/drain-psyche';

export const DrainPsyche: Power = withOverrides(base, overrides);
