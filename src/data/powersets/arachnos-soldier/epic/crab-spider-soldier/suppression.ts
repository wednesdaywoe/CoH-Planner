/**
 * Suppression — COMPOSED EXPORT
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
import { Suppression as base } from '@/data/generated/powersets/arachnos-soldier/epic/crab-spider-soldier/suppression';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/crab-spider-soldier/suppression';

export const Suppression: Power = withOverrides(base, overrides);
