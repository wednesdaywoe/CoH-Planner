/**
 * Contaminated Strike — COMPOSED EXPORT
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
import { ContaminatedStrike as base } from '@/data/generated/powersets/tanker/secondary/radiation-melee/contaminated-strike';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/radiation-melee/contaminated-strike';

export const ContaminatedStrike: Power = withOverrides(base, overrides);
