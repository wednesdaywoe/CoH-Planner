/**
 * Executioner’s Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee battle_axe
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ExecutionersStrike as base } from '@/data/datasets/veracity/generated/powersets/brute/primary/battle-axe/executioner-s-strike';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/brute/primary/battle-axe/executioner-s-strike';

export const ExecutionersStrike: Power = withOverrides(base, overrides);
