/**
 * Time's Juncture — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff time_manipulation
 */
import type { Power } from '@/types';
import { TimesJuncture as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/time-manipulation/times-juncture';

export const TimesJuncture: Power = base;
