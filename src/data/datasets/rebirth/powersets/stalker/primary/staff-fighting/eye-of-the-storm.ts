/**
 * Eye of the Storm — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EyeoftheStorm as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/staff-fighting/eye-of-the-storm';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/staff-fighting/eye-of-the-storm';

export const EyeoftheStorm: Power = withOverrides(base, overrides);
