/**
 * Whirling Axe — COMPOSED EXPORT
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
import { WhirlingAxe as base } from '@/data/generated/powersets/brute/primary/battle-axe/whirling-axe';
import { overrides } from '@/data/overrides/powersets/brute/primary/battle-axe/whirling-axe';

export const WhirlingAxe: Power = withOverrides(base, overrides);
