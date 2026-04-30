/**
 * Tidal Forces — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged water_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TidalForces as base } from '@/data/datasets/rebirth/generated/powersets/blaster/primary/water-blast/tidal-forces';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/primary/water-blast/tidal-forces';

export const TidalForces: Power = withOverrides(base, overrides);
