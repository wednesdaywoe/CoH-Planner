/**
 * Proton Sweep — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee radiation_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ProtonSweep as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/radiation-melee/proton-sweep';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/radiation-melee/proton-sweep';

export const ProtonSweep: Power = withOverrides(base, overrides);
