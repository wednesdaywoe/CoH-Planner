/**
 * Entangle — COMPOSED EXPORT
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
import { Entangle as base } from '@/data/generated/powersets/controller/primary/plant-control/entangle';
import { overrides } from '@/data/overrides/powersets/controller/primary/plant-control/entangle';

export const Entangle: Power = withOverrides(base, overrides);
