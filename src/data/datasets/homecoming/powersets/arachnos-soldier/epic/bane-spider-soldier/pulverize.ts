/**
 * Pulverize — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs arachnos_soldiers bane_spider_soldier
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Pulverize as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-soldier/epic/bane-spider-soldier/pulverize';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/arachnos-soldier/epic/bane-spider-soldier/pulverize';

export const Pulverize: Power = withOverrides(base, overrides);
