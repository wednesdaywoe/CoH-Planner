/**
 * Up to the Challenge — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense willpower
 */
import type { Power } from '@/types';
import { Resurgence as base } from '@/data/datasets/brainstorm/generated/powersets/stalker/secondary/willpower/resurgence';

export const Resurgence: Power = base;
