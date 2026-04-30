/**
 * Incendiary Round — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault military_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IncendiaryRound as base } from '@/data/generated/powersets/dominator/secondary/military-assault/incendiary-round';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/military-assault/incendiary-round';

export const IncendiaryRound: Power = withOverrides(base, overrides);
