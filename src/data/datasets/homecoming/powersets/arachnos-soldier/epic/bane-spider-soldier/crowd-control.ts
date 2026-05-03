/**
 * Crowd Control — COMPOSED EXPORT
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
import { CrowdControl as base } from '@/data/generated/powersets/arachnos-soldier/epic/bane-spider-soldier/crowd-control';
import { overrides } from '@/data/overrides/powersets/arachnos-soldier/epic/bane-spider-soldier/crowd-control';

export const CrowdControl: Power = withOverrides(base, overrides);
