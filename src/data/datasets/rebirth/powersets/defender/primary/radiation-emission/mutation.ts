/**
 * Mutation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff radiation_emission
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Mutation as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/radiation-emission/mutation';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/radiation-emission/mutation';

export const Mutation: Power = withOverrides(base, overrides);
