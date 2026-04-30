/**
 * Rebirth — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Rebirth as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/nature-affinity/rebirth';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/nature-affinity/rebirth';

export const Rebirth: Power = withOverrides(base, overrides);
