/**
 * Summon Spiderlings — COMPOSED EXPORT
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
import { SummonSpiderlings as base } from '@/data/generated/powersets/arachnos-soldier/epic/crab-spider-training/summon-spiderlings';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/crab-spider-training/summon-spiderlings';

export const SummonSpiderlings: Power = withOverrides(base, overrides);
