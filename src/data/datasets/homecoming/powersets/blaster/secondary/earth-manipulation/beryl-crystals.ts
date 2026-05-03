/**
 * Beryl Crystals — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support earth_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BerylCrystals as base } from '@/data/generated/powersets/blaster/secondary/earth-manipulation/beryl-crystals';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/earth-manipulation/beryl-crystals';

export const BerylCrystals: Power = withOverrides(base, overrides);
