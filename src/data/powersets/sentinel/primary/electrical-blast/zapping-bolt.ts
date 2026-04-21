/**
 * Zapping Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged electrical_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ZappingBolt as base } from '@/data/generated/powersets/sentinel/primary/electrical-blast/zapping-bolt';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/electrical-blast/zapping-bolt';

export const ZappingBolt: Power = withOverrides(base, overrides);
