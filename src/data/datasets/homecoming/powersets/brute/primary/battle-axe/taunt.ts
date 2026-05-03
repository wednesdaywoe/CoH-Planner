/**
 * Taunt — COMPOSED EXPORT
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
import { Taunt as base } from '@/data/generated/powersets/brute/primary/battle-axe/taunt';
import { overrides } from '@/data/overrides/powersets/brute/primary/battle-axe/taunt';

export const Taunt: Power = withOverrides(base, overrides);
