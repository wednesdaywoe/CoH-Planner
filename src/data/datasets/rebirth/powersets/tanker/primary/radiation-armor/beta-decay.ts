/**
 * Beta Decay — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense radiation_armor
 */
import type { Power } from '@/types';
import { BetaDecay as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/radiation-armor/beta-decay';

export const BetaDecay: Power = base;
