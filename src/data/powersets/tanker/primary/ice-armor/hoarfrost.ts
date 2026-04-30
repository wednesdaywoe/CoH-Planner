/**
 * Hoarfrost — COMPOSED EXPORT
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
import { Hoarfrost as base } from '@/data/generated/powersets/tanker/primary/ice-armor/hoarfrost';
import { overrides } from '@/data/overrides/powersets/tanker/primary/ice-armor/hoarfrost';

export const Hoarfrost: Power = withOverrides(base, overrides);
