/**
 * Alkaloid Splash — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff poison
 */
import type { Power } from '@/types';
import { AlkaloidSplash as base } from '@/data/datasets/thunderspy/generated/powersets/mastermind/secondary/poison/alkaloid-splash';

export const AlkaloidSplash: Power = base;
