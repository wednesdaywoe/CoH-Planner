/**
 * Ice Bolt — COMPOSED EXPORT
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
import { IceBolt as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/ice-blast/ice-bolt';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/ice-blast/ice-bolt';

export const IceBolt: Power = withOverrides(base, overrides);
