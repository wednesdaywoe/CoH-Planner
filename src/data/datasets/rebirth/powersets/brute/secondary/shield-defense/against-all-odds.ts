/**
 * Against All Odds — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AgainstAllOdds as base } from '@/data/datasets/rebirth/generated/powersets/brute/secondary/shield-defense/against-all-odds';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/secondary/shield-defense/against-all-odds';

export const AgainstAllOdds: Power = withOverrides(base, overrides);
