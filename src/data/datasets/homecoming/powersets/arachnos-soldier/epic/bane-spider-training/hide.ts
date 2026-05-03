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
import { CloakingDevice as base } from '@/data/generated/powersets/arachnos-soldier/epic/bane-spider-training/hide';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/bane-spider-training/hide';

export const CloakingDevice: Power = withOverrides(base, overrides);
