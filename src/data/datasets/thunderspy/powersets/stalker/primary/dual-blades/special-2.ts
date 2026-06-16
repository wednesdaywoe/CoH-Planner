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
import { Special2 as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/primary/dual-blades/special-2';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/primary/dual-blades/special-2';

export const Special2: Power = withOverrides(base, overrides);
