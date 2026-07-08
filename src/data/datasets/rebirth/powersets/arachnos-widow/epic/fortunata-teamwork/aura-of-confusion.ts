/**
 * Aura of Confusion — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork fortunata_teamwork
 */
import type { Power } from '@/types';
import { AuraofConfusion as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-widow/epic/fortunata-teamwork/aura-of-confusion';

export const AuraofConfusion: Power = base;
