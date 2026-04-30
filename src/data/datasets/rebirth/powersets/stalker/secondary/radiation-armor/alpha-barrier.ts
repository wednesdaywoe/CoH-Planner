/**
 * Alpha Barrier — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AlphaBarrier as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/radiation-armor/alpha-barrier';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/radiation-armor/alpha-barrier';

export const AlphaBarrier: Power = withOverrides(base, overrides);
