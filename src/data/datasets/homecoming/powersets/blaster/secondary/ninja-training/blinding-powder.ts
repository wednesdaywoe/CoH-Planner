/**
 * Blinding Powder — COMPOSED EXPORT
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
import { BlindingPowder as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/ninja-training/blinding-powder';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/ninja-training/blinding-powder';

export const BlindingPowder: Power = withOverrides(base, overrides);
