/**
 * Tactical Training: Maneuvers — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs training_gadgets training_and_gadgets
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TacticalTrainingManeuvers as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/training-and-gadgets/tactical-training-maneuvers';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/training-and-gadgets/tactical-training-maneuvers';

export const TacticalTrainingManeuvers: Power = withOverrides(base, overrides);
