/**
 * Sweeping Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SweepingStrike as base } from '@/data/generated/powersets/stalker/primary/dual-blades/special-2';
import { overrides } from '@/data/overrides/powersets/stalker/primary/dual-blades/special-2';

export const SweepingStrike: Power = withOverrides(base, overrides);
