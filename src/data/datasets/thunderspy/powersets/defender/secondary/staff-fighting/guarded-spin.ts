/**
 * Guarded Spin — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged staff_fighting
 */
import type { Power } from '@/types';
import { GuardedSpin as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/staff-fighting/guarded-spin';

export const GuardedSpin: Power = base;
