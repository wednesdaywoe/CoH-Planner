/**
 * Summon Dire Wolf — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon beast_mastery
 */
import type { Power } from '@/types';
import { SummonDireWolf as base } from '@/data/datasets/thunderspy/generated/powersets/mastermind/primary/beast-mastery/summon-dire-wolf';

export const SummonDireWolf: Power = base;
