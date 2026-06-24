/**
 * Respark — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support energy_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Respark as base } from '@/data/datasets/veracity/generated/powersets/blaster/secondary/energy-manipulation/respark';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/blaster/secondary/energy-manipulation/respark';

export const Respark: Power = withOverrides(base, overrides);
