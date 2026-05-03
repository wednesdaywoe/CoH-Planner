/**
 * Rend Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee titan_weapons
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RendArmor as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/titan-weapons/shatter-armor';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/titan-weapons/shatter-armor';

export const RendArmor: Power = withOverrides(base, overrides);
