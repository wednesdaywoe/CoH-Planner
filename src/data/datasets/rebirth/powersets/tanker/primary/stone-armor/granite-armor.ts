/**
 * Granite Armor — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense stone_armor
 */
import type { Power } from '@/types';
import { GraniteArmor as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/stone-armor/granite-armor';

export const GraniteArmor: Power = base;
