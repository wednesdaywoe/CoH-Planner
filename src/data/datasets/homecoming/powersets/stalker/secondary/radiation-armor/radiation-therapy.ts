/**
 * Radiation Therapy — COMPOSED EXPORT
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
import { RadiationTherapy as base } from '@/data/generated/powersets/stalker/secondary/radiation-armor/radiation-therapy';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/radiation-armor/radiation-therapy';

export const RadiationTherapy: Power = withOverrides(base, overrides);
