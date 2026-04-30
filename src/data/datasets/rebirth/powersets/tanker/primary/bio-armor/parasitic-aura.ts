/**
 * Parasitic Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ParasiticAura as base } from '@/data/generated/powersets/tanker/primary/bio-armor/parasitic-aura';
import { overrides } from '@/data/overrides/powersets/tanker/primary/bio-armor/parasitic-aura';

export const ParasiticAura: Power = withOverrides(base, overrides);
