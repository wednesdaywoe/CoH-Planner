/**
 * Elixir of Life — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ElixirofLife as base } from '@/data/generated/powersets/mastermind/secondary/poison/elixir-of-life';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/poison/elixir-of-life';

export const ElixirofLife: Power = withOverrides(base, overrides);
