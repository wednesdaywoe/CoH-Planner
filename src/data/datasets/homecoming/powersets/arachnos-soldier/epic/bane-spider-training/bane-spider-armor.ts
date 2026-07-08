/**
 * Bane Spider Armor Upgrade — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs training_gadgets bane_spider_training
 */
import type { Power } from '@/types';
import { BaneSpiderArmor as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-soldier/epic/bane-spider-training/bane-spider-armor';

export const BaneSpiderArmor: Power = base;
