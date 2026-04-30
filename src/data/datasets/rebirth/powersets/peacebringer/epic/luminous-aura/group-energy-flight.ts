/**
 * Solar Glide — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs peacebringer_defensive luminous_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SolarGlide as base } from '@/data/generated/powersets/peacebringer/epic/luminous-aura/group-energy-flight';
import { overrides } from '@/data/overrides/powersets/peacebringer/epic/luminous-aura/group-energy-flight';

export const SolarGlide: Power = withOverrides(base, overrides);
