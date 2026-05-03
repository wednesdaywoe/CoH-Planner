/**
 * Crushing Uppercut — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee brawling
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CrushingUppercut as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/street-justice/crushing-uppercut';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/street-justice/crushing-uppercut';

export const CrushingUppercut: Power = withOverrides(base, overrides);
