/**
 * True Grit — COMPOSED EXPORT
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
import { TrueGrit as base } from '@/data/generated/powersets/tanker/primary/shield-defense/true-grit';
import { overrides } from '@/data/overrides/powersets/tanker/primary/shield-defense/true-grit';

export const TrueGrit: Power = withOverrides(base, overrides);
