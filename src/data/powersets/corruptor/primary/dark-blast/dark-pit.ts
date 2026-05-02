/**
 * Dark Pit — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged dark_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkPit as base } from '@/data/generated/powersets/corruptor/primary/dark-blast/dark-pit';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/dark-blast/dark-pit';

export const DarkPit: Power = withOverrides(base, overrides);
