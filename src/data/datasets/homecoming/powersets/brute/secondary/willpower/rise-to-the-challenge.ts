/**
 * Rise to the Challenge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense willpower
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RisetotheChallenge as base } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/willpower/rise-to-the-challenge';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/secondary/willpower/rise-to-the-challenge';

export const RisetotheChallenge: Power = withOverrides(base, overrides);
