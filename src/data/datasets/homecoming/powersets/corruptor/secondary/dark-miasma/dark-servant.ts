/**
 * Dark Servant — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff dark_miasma
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkServant as base } from '@/data/generated/powersets/corruptor/secondary/dark-miasma/dark-servant';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/dark-miasma/dark-servant';

export const DarkServant: Power = withOverrides(base, overrides);
