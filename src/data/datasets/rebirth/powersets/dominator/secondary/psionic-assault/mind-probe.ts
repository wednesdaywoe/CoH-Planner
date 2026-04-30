/**
 * Mind Probe — COMPOSED EXPORT
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
import { MindProbe as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/psionic-assault/mind-probe';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/psionic-assault/mind-probe';

export const MindProbe: Power = withOverrides(base, overrides);
