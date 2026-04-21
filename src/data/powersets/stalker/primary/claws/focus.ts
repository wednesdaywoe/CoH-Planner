/**
 * Focus — COMPOSED EXPORT
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
import { Focus as base } from '@/data/generated/powersets/stalker/primary/claws/focus';
import { overrides } from '@/data/overrides/powersets/stalker/primary/claws/focus';

export const Focus: Power = withOverrides(base, overrides);
