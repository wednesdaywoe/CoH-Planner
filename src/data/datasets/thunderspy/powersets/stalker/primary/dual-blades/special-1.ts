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
import { Special1 as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/primary/dual-blades/special-1';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/primary/dual-blades/special-1';

export const Special1: Power = withOverrides(base, overrides);
