/**
 * Gale — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff storm_summoning
 */
import type { Power } from '@/types';
import { Gale as base } from '@/data/datasets/brainstorm/generated/powersets/corruptor/secondary/storm-summoning/gale';

export const Gale: Power = base;
