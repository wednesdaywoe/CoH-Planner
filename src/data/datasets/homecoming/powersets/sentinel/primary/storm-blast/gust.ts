/**
 * Gust — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gust as base } from '@/data/generated/powersets/sentinel/primary/storm-blast/gust';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/storm-blast/gust';

export const Gust: Power = withOverrides(base, overrides);
