/**
 * Eye of the Storm — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee staff_fighting
 */
import type { Power } from '@/types';
import { EyeoftheStorm as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/secondary/staff-fighting/eye-of-the-storm';

export const EyeoftheStorm: Power = base;
