/**
 * Fallout Shelter — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FalloutShelter as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/radiation-armor/fallout-shelter';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/radiation-armor/fallout-shelter';

export const FalloutShelter: Power = withOverrides(base, overrides);
