/**
 * Discharge — COMPOSED EXPORT
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
import { Discharge as base } from '@/data/generated/powersets/mastermind/secondary/electrical-affinity/discharge';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/electrical-affinity/discharge';

export const Discharge: Power = withOverrides(base, overrides);
