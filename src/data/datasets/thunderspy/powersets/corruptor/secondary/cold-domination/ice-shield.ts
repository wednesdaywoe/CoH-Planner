/**
 * Ice Shield — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff cold_domination
 */
import type { Power } from '@/types';
import { IceShield as base } from '@/data/datasets/thunderspy/generated/powersets/corruptor/secondary/cold-domination/ice-shield';

export const IceShield: Power = base;
