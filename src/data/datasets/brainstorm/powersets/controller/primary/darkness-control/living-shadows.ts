/**
 * Living Shadows — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control darkness_control
 */
import type { Power } from '@/types';
import { LivingShadows as base } from '@/data/datasets/brainstorm/generated/powersets/controller/primary/darkness-control/living-shadows';

export const LivingShadows: Power = base;
