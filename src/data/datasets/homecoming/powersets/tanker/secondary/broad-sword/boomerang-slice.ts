/**
 * Boomerang Slice — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BoomerangSlice as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/broad-sword/boomerang-slice';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/broad-sword/boomerang-slice';

export const BoomerangSlice: Power = withOverrides(base, overrides);
