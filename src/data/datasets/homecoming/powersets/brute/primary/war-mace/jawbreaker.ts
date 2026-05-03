/**
 * Jawbreaker — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee war_mace
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Jawbreaker as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/war-mace/jawbreaker';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/war-mace/jawbreaker';

export const Jawbreaker: Power = withOverrides(base, overrides);
