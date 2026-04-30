/**
 * Crushing Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control gravity_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CrushingField as base } from '@/data/generated/powersets/controller/primary/gravity-control/crushing-field';
import { overrides } from '@/data/overrides/powersets/controller/primary/gravity-control/crushing-field';

export const CrushingField: Power = withOverrides(base, overrides);
