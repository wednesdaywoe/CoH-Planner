/**
 * Focus Chi — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee martial_arts
 */
import type { Power } from '@/types';
import { FocusChi as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/martial-arts/focus-chi';

export const FocusChi: Power = base;
