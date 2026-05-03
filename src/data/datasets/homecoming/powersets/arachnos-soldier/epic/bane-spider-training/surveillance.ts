/**
 * Surveillance — COMPOSED EXPORT
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
import { Surveillance as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-soldier/epic/bane-spider-training/surveillance';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/arachnos-soldier/epic/bane-spider-training/surveillance';

export const Surveillance: Power = withOverrides(base, overrides);
