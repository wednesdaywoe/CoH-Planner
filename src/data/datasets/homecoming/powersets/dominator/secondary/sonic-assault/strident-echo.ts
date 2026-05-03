/**
 * Strident Echo — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault sonic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StridentEcho as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/sonic-assault/strident-echo';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/sonic-assault/strident-echo';

export const StridentEcho: Power = withOverrides(base, overrides);
