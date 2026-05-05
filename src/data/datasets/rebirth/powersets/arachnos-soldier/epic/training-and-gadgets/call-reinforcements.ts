/**
 * Call Reinforcements — COMPOSED EXPORT
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
import { CallReinforcements as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/training-and-gadgets/call-reinforcements';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/training-and-gadgets/call-reinforcements';

export const CallReinforcements: Power = withOverrides(base, overrides);
