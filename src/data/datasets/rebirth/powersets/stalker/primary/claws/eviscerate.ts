/**
 * Eviscerate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Eviscerate as base } from '@/data/generated/powersets/stalker/primary/claws/eviscerate';
import { overrides } from '@/data/overrides/powersets/stalker/primary/claws/eviscerate';

export const Eviscerate: Power = withOverrides(base, overrides);
