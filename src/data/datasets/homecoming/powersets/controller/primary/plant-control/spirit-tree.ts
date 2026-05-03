/**
 * Spirit Tree — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control plant_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SpiritTree as base } from '@/data/datasets/homecoming/generated/powersets/controller/primary/plant-control/spirit-tree';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/primary/plant-control/spirit-tree';

export const SpiritTree: Power = withOverrides(base, overrides);
