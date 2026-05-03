/**
 * Moment of Glory — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MomentofGlory as base } from '@/data/generated/powersets/stalker/secondary/regeneration/moment-of-glory';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/regeneration/moment-of-glory';

export const MomentofGlory: Power = withOverrides(base, overrides);
