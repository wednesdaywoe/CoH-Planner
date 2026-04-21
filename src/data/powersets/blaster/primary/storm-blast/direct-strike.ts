/**
 * Direct Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DirectStrike as base } from '@/data/generated/powersets/blaster/primary/storm-blast/direct-strike';
import { overrides } from '@/data/overrides/powersets/blaster/primary/storm-blast/direct-strike';

export const DirectStrike: Power = withOverrides(base, overrides);
