/**
 * Power of the Depths — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff marine_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PoweroftheDepths as base } from '@/data/generated/powersets/controller/secondary/marine-affinity/call-depths';
import { overrides } from '@/data/overrides/powersets/controller/secondary/marine-affinity/call-depths';

export const PoweroftheDepths: Power = withOverrides(base, overrides);
