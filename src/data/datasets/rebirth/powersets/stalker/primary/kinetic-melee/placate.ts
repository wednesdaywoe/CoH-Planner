/**
 * Placate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Placate as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/kinetic-melee/placate';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/kinetic-melee/placate';

export const Placate: Power = withOverrides(base, overrides);
