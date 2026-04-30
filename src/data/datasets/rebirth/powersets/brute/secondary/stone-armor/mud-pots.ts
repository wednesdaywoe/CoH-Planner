/**
 * Mud Pots — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense stone_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MudPots as base } from '@/data/generated/powersets/brute/secondary/stone-armor/mud-pots';
import { overrides } from '@/data/overrides/powersets/brute/secondary/stone-armor/mud-pots';

export const MudPots: Power = withOverrides(base, overrides);
