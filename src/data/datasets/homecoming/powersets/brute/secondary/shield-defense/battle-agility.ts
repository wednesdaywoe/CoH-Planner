/**
 * Active Defense — COMPOSED EXPORT
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
import { ActiveDefense as base } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/shield-defense/battle-agility';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/secondary/shield-defense/battle-agility';

export const ActiveDefense: Power = withOverrides(base, overrides);
