/**
 * Resilience — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Resilience as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/regeneration/resilience';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/regeneration/resilience';

export const Resilience: Power = withOverrides(base, overrides);
