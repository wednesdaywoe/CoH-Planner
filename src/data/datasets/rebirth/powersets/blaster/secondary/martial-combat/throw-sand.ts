/**
 * Throw Sand — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support martial_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThrowSand as base } from '@/data/datasets/rebirth/generated/powersets/blaster/secondary/martial-combat/throw-sand';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/secondary/martial-combat/throw-sand';

export const ThrowSand: Power = withOverrides(base, overrides);
