/**
 * Tenebrous Tentacles — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged dark_blast
 */
import type { Power } from '@/types';
import { TenebrousTentacles as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/dark-blast/tenebrous-tentacles';

export const TenebrousTentacles: Power = base;
