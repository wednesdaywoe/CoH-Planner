/**
 * Web Cocoon — COMPOSED EXPORT
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
import { WebCocoon as base } from '@/data/generated/powersets/arachnos-soldier/epic/bane-spider-training/web-cocoon';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/bane-spider-training/web-cocoon';

export const WebCocoon: Power = withOverrides(base, overrides);
