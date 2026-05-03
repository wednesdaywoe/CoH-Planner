/**
 * Entangling Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EntanglingAura as base } from '@/data/generated/powersets/controller/secondary/nature-affinity/raging-tempest';
import { overrides } from '@/data/overrides/powersets/controller/secondary/nature-affinity/raging-tempest';

export const EntanglingAura: Power = withOverrides(base, overrides);
