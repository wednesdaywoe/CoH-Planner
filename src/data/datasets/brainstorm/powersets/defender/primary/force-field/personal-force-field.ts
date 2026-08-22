/**
 * Personal Force Field — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff force_field
 */
import type { Power } from '@/types';
import { PersonalForceField as base } from '@/data/datasets/brainstorm/generated/powersets/defender/primary/force-field/personal-force-field';

export const PersonalForceField: Power = base;
