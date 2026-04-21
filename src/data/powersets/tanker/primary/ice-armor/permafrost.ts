/**
 * Permafrost — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Permafrost as base } from '@/data/generated/powersets/tanker/primary/ice-armor/permafrost';
import { overrides } from '@/data/overrides/powersets/tanker/primary/ice-armor/permafrost';

export const Permafrost: Power = withOverrides(base, overrides);
