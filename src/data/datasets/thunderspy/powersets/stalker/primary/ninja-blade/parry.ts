/**
 * Divine Avalanche — COMPOSED EXPORT
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
import { Parry as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/primary/ninja-blade/parry';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/primary/ninja-blade/parry';

export const Parry: Power = withOverrides(base, overrides);
