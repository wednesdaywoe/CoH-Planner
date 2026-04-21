/**
 * Wild Growth — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WildGrowth as base } from '@/data/generated/powersets/controller/secondary/nature-affinity/wild-growth';
import { overrides } from '@/data/overrides/powersets/controller/secondary/nature-affinity/wild-growth';

export const WildGrowth: Power = withOverrides(base, overrides);
