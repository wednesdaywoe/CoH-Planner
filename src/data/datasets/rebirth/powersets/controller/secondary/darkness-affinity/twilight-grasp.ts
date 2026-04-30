/**
 * Twilight Grasp — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff darkness_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TwilightGrasp as base } from '@/data/datasets/rebirth/generated/powersets/controller/secondary/darkness-affinity/twilight-grasp';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/secondary/darkness-affinity/twilight-grasp';

export const TwilightGrasp: Power = withOverrides(base, overrides);
