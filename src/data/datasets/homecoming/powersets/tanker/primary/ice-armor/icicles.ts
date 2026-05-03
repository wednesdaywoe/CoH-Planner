/**
 * Icicles — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Icicles as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/ice-armor/icicles';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/ice-armor/icicles';

export const Icicles: Power = withOverrides(base, overrides);
