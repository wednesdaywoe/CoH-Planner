/**
 * Bane Spider Armor Upgrade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs training_gadgets bane_spider_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BaneSpiderArmorUpgrade as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/bane-spider-training/bane-spider-armor';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/bane-spider-training/bane-spider-armor';

export const BaneSpiderArmorUpgrade: Power = withOverrides(base, overrides);
