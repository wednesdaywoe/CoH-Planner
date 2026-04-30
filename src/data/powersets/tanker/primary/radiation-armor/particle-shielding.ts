/**
 * Particle Shielding — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ParticleShielding as base } from '@/data/generated/powersets/tanker/primary/radiation-armor/particle-shielding';
import { overrides } from '@/data/overrides/powersets/tanker/primary/radiation-armor/particle-shielding';

export const ParticleShielding: Power = withOverrides(base, overrides);
