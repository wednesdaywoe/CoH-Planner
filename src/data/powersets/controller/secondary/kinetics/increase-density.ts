/**
 * Increase Density — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IncreaseDensity as base } from '@/data/generated/powersets/controller/secondary/kinetics/increase-density';
import { overrides } from '@/data/overrides/powersets/controller/secondary/kinetics/increase-density';

export const IncreaseDensity: Power = withOverrides(base, overrides);
