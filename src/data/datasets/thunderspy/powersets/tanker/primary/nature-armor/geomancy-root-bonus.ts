/**
 * Centered — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense sacred_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GeomancyRootBonus as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/nature-armor/geomancy-root-bonus';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/primary/nature-armor/geomancy-root-bonus';

export const GeomancyRootBonus: Power = withOverrides(base, overrides);
