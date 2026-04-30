/**
 * Shatter — COMPOSED EXPORT
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
import { Shatter as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/bane-spider-soldier/shatter';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/bane-spider-soldier/shatter';

export const Shatter: Power = withOverrides(base, overrides);
