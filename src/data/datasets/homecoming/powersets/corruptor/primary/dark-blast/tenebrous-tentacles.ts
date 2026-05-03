/**
 * Tenebrous Tentacles — COMPOSED EXPORT
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
import { TenebrousTentacles as base } from '@/data/generated/powersets/corruptor/primary/dark-blast/tenebrous-tentacles';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/dark-blast/tenebrous-tentacles';

export const TenebrousTentacles: Power = withOverrides(base, overrides);
