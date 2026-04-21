/**
 * Fusion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee radiation_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Fusion as base } from '@/data/generated/powersets/tanker/secondary/radiation-melee/fusion';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/radiation-melee/fusion';

export const Fusion: Power = withOverrides(base, overrides);
