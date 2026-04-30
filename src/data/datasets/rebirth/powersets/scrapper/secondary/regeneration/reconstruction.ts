/**
 * Reconstruction — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Reconstruction as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/regeneration/reconstruction';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/regeneration/reconstruction';

export const Reconstruction: Power = withOverrides(base, overrides);
