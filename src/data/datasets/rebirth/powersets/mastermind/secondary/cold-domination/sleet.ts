/**
 * Sleet — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Sleet as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/secondary/cold-domination/sleet';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/secondary/cold-domination/sleet';

export const Sleet: Power = withOverrides(base, overrides);
