/**
 * Fade — COMPOSED EXPORT
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
import { Fade as base } from '@/data/generated/powersets/controller/secondary/darkness-affinity/fade';
import { overrides } from '@/data/overrides/powersets/controller/secondary/darkness-affinity/fade';

export const Fade: Power = withOverrides(base, overrides);
