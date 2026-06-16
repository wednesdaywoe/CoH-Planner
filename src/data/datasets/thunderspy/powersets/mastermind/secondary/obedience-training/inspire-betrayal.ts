/**
 * Inspire Betrayal — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff obedience_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InspireBetrayal as base } from '@/data/datasets/thunderspy/generated/powersets/mastermind/secondary/obedience-training/inspire-betrayal';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/mastermind/secondary/obedience-training/inspire-betrayal';

export const InspireBetrayal: Power = withOverrides(base, overrides);
