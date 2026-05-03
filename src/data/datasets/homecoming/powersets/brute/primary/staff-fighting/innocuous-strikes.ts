/**
 * Innocuous Strikes — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InnocuousStrikes as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/staff-fighting/innocuous-strikes';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/staff-fighting/innocuous-strikes';

export const InnocuousStrikes: Power = withOverrides(base, overrides);
