/**
 * Active Defense — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ActiveDefense as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/shield-defense/battle-agility';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/shield-defense/battle-agility';

export const ActiveDefense: Power = withOverrides(base, overrides);
