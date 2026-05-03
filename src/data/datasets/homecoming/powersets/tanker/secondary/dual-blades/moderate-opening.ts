/**
 * Power Slice — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerSlice as base } from '@/data/generated/powersets/tanker/secondary/dual-blades/moderate-opening';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/dual-blades/moderate-opening';

export const PowerSlice: Power = withOverrides(base, overrides);
