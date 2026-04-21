/**
 * Wild Fortress — COMPOSED EXPORT
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
import { WildFortress as base } from '@/data/generated/powersets/blaster/secondary/plant-manipulation/wild-fortress';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/plant-manipulation/wild-fortress';

export const WildFortress: Power = withOverrides(base, overrides);
