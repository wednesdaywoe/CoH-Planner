/**
 * Midnight Grasp — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dark_melee
 */
import type { Power } from '@/types';
import { MidnightGrasp as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/dark-melee/midnight-grasp';

export const MidnightGrasp: Power = base;
