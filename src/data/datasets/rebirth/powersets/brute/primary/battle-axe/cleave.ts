/**
 * Cleave — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee battle_axe
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Cleave as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/battle-axe/cleave';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/battle-axe/cleave';

export const Cleave: Power = withOverrides(base, overrides);
