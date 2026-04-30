/**
 * Power Slice — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerSlice as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/dual-blades/moderate-opening';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/dual-blades/moderate-opening';

export const PowerSlice: Power = withOverrides(base, overrides);
