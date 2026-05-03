/**
 * Defibrillate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff shock_therapy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Defibrillate as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/electrical-affinity/defibrillate';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/electrical-affinity/defibrillate';

export const Defibrillate: Power = withOverrides(base, overrides);
