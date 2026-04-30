/**
 * Soaring Dragon — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee ninja_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SoaringDragon as base } from '@/data/generated/powersets/stalker/primary/ninja-blade/disembowel';
import { overrides } from '@/data/overrides/powersets/stalker/primary/ninja-blade/disembowel';

export const SoaringDragon: Power = withOverrides(base, overrides);
