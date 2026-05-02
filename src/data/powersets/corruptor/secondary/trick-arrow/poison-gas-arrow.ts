/**
 * Poison Gas Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PoisonGasArrow as base } from '@/data/generated/powersets/corruptor/secondary/trick-arrow/poison-gas-arrow';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/trick-arrow/poison-gas-arrow';

export const PoisonGasArrow: Power = withOverrides(base, overrides);
