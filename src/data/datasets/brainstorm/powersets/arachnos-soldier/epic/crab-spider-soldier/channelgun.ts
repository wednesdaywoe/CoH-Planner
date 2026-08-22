/**
 * Channelgun — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs arachnos_soldiers crab_spider_soldier
 */
import type { Power } from '@/types';
import { Channelgun as base } from '@/data/datasets/brainstorm/generated/powersets/arachnos-soldier/epic/crab-spider-soldier/channelgun';

export const Channelgun: Power = base;
