/**
 * Alpha Barrier — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp radiation_composition
 */
import type { Power } from '@/types';
import { AlphaBarrier as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/radiation-composition/alpha-barrier';

export const AlphaBarrier: Power = base;
