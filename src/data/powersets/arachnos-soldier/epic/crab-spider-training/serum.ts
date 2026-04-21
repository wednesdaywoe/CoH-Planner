/**
 * Serum — COMPOSED EXPORT
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
import { Serum as base } from '@/data/generated/powersets/arachnos-soldier/epic/crab-spider-training/serum';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/crab-spider-training/serum';

export const Serum: Power = withOverrides(base, overrides);
