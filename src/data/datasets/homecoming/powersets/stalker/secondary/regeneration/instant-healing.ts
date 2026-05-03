/**
 * Instant Healing — COMPOSED EXPORT
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
import { InstantHealing as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/regeneration/instant-healing';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/secondary/regeneration/instant-healing';

export const InstantHealing: Power = withOverrides(base, overrides);
