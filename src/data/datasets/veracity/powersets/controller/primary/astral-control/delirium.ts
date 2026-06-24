/**
 * Delirium — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control quoastral_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Delirium as base } from '@/data/datasets/veracity/generated/powersets/controller/primary/astral-control/delirium';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/controller/primary/astral-control/delirium';

export const Delirium: Power = withOverrides(base, overrides);
