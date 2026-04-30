/**
 * Aim — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs arachnos_soldiers crab_spider_soldier
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Aim as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/crab-spider-soldier/aim';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/crab-spider-soldier/aim';

export const Aim: Power = withOverrides(base, overrides);
