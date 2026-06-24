/**
 * Battle Agility — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Deflection as base } from '@/data/datasets/veracity/generated/powersets/scrapper/secondary/shield-defense/deflection';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/scrapper/secondary/shield-defense/deflection';

export const Deflection: Power = withOverrides(base, overrides);
