/**
 * Moonbeam — COMPOSED EXPORT
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
import { Moonbeam as base } from '@/data/generated/powersets/corruptor/primary/dark-blast/moonbeam';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/dark-blast/moonbeam';

export const Moonbeam: Power = withOverrides(base, overrides);
