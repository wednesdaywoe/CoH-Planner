/**
 * Toxins — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support plant_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Toxins as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/plant-manipulation/toxins';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/plant-manipulation/toxins';

export const Toxins: Power = withOverrides(base, overrides);
