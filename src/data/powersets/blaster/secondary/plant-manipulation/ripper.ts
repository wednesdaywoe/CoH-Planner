/**
 * Ripper — COMPOSED EXPORT
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
import { Ripper as base } from '@/data/generated/powersets/blaster/secondary/plant-manipulation/ripper';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/plant-manipulation/ripper';

export const Ripper: Power = withOverrides(base, overrides);
