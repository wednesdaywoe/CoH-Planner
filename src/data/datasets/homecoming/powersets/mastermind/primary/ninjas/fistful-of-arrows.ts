/**
 * Fistful of Arrows — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon ninjas
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FistfulofArrows as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/ninjas/fistful-of-arrows';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/ninjas/fistful-of-arrows';

export const FistfulofArrows: Power = withOverrides(base, overrides);
