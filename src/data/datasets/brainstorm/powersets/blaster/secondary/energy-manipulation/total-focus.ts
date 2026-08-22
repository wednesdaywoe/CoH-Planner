/**
 * Total Focus — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support energy_manipulation
 */
import type { Power } from '@/types';
import { TotalFocus as base } from '@/data/datasets/brainstorm/generated/powersets/blaster/secondary/energy-manipulation/total-focus';

export const TotalFocus: Power = base;
