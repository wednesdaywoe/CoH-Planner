/**
 * Build Up — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StaffMastery as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/staff-fighting/staff-mastery';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/staff-fighting/staff-mastery';

export const StaffMastery: Power = withOverrides(base, overrides);
