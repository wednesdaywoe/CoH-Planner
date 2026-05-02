/**
 * Minerals — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense stone_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Minerals as base } from '@/data/generated/powersets/tanker/primary/stone-armor/mineral-armor';
import { overrides } from '@/data/overrides/powersets/tanker/primary/stone-armor/mineral-armor';

export const Minerals: Power = withOverrides(base, overrides);
