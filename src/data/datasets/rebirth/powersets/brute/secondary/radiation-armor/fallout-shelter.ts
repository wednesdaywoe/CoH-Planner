/**
 * Fallout Shelter — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FalloutShelter as base } from '@/data/generated/powersets/brute/secondary/radiation-armor/fallout-shelter';
import { overrides } from '@/data/overrides/powersets/brute/secondary/radiation-armor/fallout-shelter';

export const FalloutShelter: Power = withOverrides(base, overrides);
