/**
 * Temporal Selection — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff time_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TemporalSelection as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/secondary/time-manipulation/temporal-selection';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/secondary/time-manipulation/temporal-selection';

export const TemporalSelection: Power = withOverrides(base, overrides);
