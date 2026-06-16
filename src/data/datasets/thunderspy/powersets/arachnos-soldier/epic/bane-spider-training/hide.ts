/**
 * Cloaking Device — COMPOSED EXPORT
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
import { Hide as base } from '@/data/datasets/thunderspy/generated/powersets/arachnos-soldier/epic/bane-spider-training/hide';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/arachnos-soldier/epic/bane-spider-training/hide';

export const Hide: Power = withOverrides(base, overrides);
