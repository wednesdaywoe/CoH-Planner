/**
 * Smashing Blow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SmashingBlow as base } from '@/data/generated/powersets/scrapper/primary/kinetic-melee/smashing-blow';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/kinetic-melee/smashing-blow';

export const SmashingBlow: Power = withOverrides(base, overrides);
