/**
 * Permafrost — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Permafrost as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/ice-armor/permafrost';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/ice-armor/permafrost';

export const Permafrost: Power = withOverrides(base, overrides);
