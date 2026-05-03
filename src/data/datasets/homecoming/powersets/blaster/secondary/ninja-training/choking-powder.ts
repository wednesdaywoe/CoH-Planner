/**
 * Choking Powder — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support ninja_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChokingPowder as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/ninja-training/choking-powder';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/ninja-training/choking-powder';

export const ChokingPowder: Power = withOverrides(base, overrides);
