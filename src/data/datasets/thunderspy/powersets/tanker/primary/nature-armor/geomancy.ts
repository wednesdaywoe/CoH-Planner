/**
 * Geomancy — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense sacred_armor
 */
import type { Power } from '@/types';
import { Geomancy as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/nature-armor/geomancy';

export const Geomancy: Power = base;
