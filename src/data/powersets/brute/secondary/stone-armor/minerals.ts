/**
 * Minerals — COMPOSED EXPORT
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
import { Minerals as base } from '@/data/generated/powersets/brute/secondary/stone-armor/minerals';
import { overrides } from '@/data/overrides/powersets/brute/secondary/stone-armor/minerals';

export const Minerals: Power = withOverrides(base, overrides);
