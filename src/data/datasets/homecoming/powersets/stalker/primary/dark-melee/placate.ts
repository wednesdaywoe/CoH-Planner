/**
 * Placate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Placate as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/dark-melee/placate';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/dark-melee/placate';

export const Placate: Power = withOverrides(base, overrides);
