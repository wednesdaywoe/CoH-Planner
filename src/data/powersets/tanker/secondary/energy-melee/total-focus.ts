/**
 * Total Focus — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee energy_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TotalFocus as base } from '@/data/generated/powersets/tanker/secondary/energy-melee/total-focus';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/energy-melee/total-focus';

export const TotalFocus: Power = withOverrides(base, overrides);
