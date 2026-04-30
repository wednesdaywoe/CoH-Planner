/**
 * Particle Shielding — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ParticleShielding as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/radiation-armor/particle-shielding';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/radiation-armor/particle-shielding';

export const ParticleShielding: Power = withOverrides(base, overrides);
