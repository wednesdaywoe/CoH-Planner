/**
 * Black Hole — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff dark_miasma
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BlackHole as base } from '@/data/generated/powersets/corruptor/secondary/dark-miasma/black-hole';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/dark-miasma/black-hole';

export const BlackHole: Power = withOverrides(base, overrides);
