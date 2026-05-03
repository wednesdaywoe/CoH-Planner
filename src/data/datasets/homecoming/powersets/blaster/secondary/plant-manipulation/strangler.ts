/**
 * Strangler — COMPOSED EXPORT
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
import { Strangler as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/plant-manipulation/strangler';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/plant-manipulation/strangler';

export const Strangler: Power = withOverrides(base, overrides);
