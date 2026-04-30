/**
 * Frost Breath — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FrostBreath as base } from '@/data/generated/powersets/blaster/primary/ice-blast/frost-breath';
import { overrides } from '@/data/overrides/powersets/blaster/primary/ice-blast/frost-breath';

export const FrostBreath: Power = withOverrides(base, overrides);
