/**
 * Vengeful Slice — COMPOSED EXPORT
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
import { VengefulSlice as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/dual-blades/special-1';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/dual-blades/special-1';

export const VengefulSlice: Power = withOverrides(base, overrides);
