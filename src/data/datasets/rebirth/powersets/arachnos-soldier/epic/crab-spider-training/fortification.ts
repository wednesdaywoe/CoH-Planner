/**
 * Fortification — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs training_gadgets crab_spider_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Fortification as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/crab-spider-training/fortification';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/crab-spider-training/fortification';

export const Fortification: Power = withOverrides(base, overrides);
