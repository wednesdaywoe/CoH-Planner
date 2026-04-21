/**
 * Bitter Ice Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BitterIceBlast as base } from '@/data/generated/powersets/sentinel/primary/ice-blast/bitter-ice-blast';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/ice-blast/bitter-ice-blast';

export const BitterIceBlast: Power = withOverrides(base, overrides);
