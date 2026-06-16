/**
 * Radiant Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff radiation_emission
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RadiationEmission as base } from '@/data/datasets/thunderspy/generated/powersets/controller/secondary/radiation-emission/radiation-emission';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/controller/secondary/radiation-emission/radiation-emission';

export const RadiationEmission: Power = withOverrides(base, overrides);
