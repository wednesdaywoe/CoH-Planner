/**
 * Dark Grasp — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control darkness_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkGrasp as base } from '@/data/generated/powersets/controller/primary/darkness-control/dark-grasp';
import { overrides } from '@/data/overrides/powersets/controller/primary/darkness-control/dark-grasp';

export const DarkGrasp: Power = withOverrides(base, overrides);
