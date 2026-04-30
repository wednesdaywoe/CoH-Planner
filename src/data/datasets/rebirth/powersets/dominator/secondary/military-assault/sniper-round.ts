/**
 * Sniper Round — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault military_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SniperRound as base } from '@/data/generated/powersets/dominator/secondary/military-assault/sniper-round';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/military-assault/sniper-round';

export const SniperRound: Power = withOverrides(base, overrides);
