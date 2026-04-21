/**
 * Guarded Spin — COMPOSED EXPORT
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
import { GuardedSpin as base } from '@/data/generated/powersets/tanker/secondary/staff-fighting/guarded-spin';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/staff-fighting/guarded-spin';

export const GuardedSpin: Power = withOverrides(base, overrides);
