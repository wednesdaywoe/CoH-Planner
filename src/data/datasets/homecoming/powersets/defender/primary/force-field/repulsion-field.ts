/**
 * Repulsion Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff force_field
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RepulsionField as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/force-field/repulsion-field';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/force-field/repulsion-field';

export const RepulsionField: Power = withOverrides(base, overrides);
