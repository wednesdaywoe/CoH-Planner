/**
 * Rooted — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense stone_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Rooted as base } from '@/data/datasets/rebirth/generated/powersets/brute/secondary/stone-armor/rooted';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/secondary/stone-armor/rooted';

export const Rooted: Power = withOverrides(base, overrides);
