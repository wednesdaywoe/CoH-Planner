/**
 * Poison Gas Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PoisonGasArrow as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/trick-arrow/poison-gas-arrow';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/trick-arrow/poison-gas-arrow';

export const PoisonGasArrow: Power = withOverrides(base, overrides);
