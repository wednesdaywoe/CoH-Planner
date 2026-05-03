/**
 * Precise Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PreciseStrike as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/staff-fighting/precise-strike';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/staff-fighting/precise-strike';

export const PreciseStrike: Power = withOverrides(base, overrides);
