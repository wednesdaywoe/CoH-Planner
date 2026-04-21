/**
 * Shockwave — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shockwave as base } from '@/data/generated/powersets/tanker/secondary/claws/shockwave';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/claws/shockwave';

export const Shockwave: Power = withOverrides(base, overrides);
