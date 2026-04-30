/**
 * Combustion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Combustion as base } from '@/data/generated/powersets/tanker/secondary/fiery-melee/combustion';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/fiery-melee/combustion';

export const Combustion: Power = withOverrides(base, overrides);
