/**
 * Against All Odds — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense shield_defense
 */
import type { Power } from '@/types';
import { AgainstallOdds as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/shield-defense/against-all-odds';

export const AgainstallOdds: Power = base;
