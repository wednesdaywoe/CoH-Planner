/**
 * Call Hawk — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault savage_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CallHawk as base } from '@/data/generated/powersets/dominator/secondary/savage-assault/call-hawk';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/savage-assault/call-hawk';

export const CallHawk: Power = withOverrides(base, overrides);
