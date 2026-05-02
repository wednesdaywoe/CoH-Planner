/**
 * Ice Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault icy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceBolt as base } from '@/data/generated/powersets/dominator/secondary/icy-assault/ice-bolt';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/icy-assault/ice-bolt';

export const IceBolt: Power = withOverrides(base, overrides);
