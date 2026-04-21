/**
 * Neutrino Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault radioactive_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { NeutrinoBolt as base } from '@/data/generated/powersets/dominator/secondary/radioactive-assault/neutrino-bolt';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/radioactive-assault/neutrino-bolt';

export const NeutrinoBolt: Power = withOverrides(base, overrides);
