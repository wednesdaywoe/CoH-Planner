/**
 * Poison Gas Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PoisonGasArrow as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/trick-arrow/poison-gas-arrow';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/trick-arrow/poison-gas-arrow';

export const PoisonGasArrow: Power = withOverrides(base, overrides);
