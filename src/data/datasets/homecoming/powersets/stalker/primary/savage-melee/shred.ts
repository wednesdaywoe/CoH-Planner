/**
 * Shred — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee savage_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shred as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/savage-melee/shred';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/savage-melee/shred';

export const Shred: Power = withOverrides(base, overrides);
