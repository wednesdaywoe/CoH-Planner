/**
 * Arc of Destruction — COMPOSED EXPORT
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
import { ArcofDestruction as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/titan-weapons/arc-of-destruction';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/titan-weapons/arc-of-destruction';

export const ArcofDestruction: Power = withOverrides(base, overrides);
