/**
 * Gamma Surge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support radiation_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GammaSurge as base } from '@/data/datasets/veracity/generated/powersets/blaster/secondary/atomic-manipulation/gamma-surge';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/blaster/secondary/atomic-manipulation/gamma-surge';

export const GammaSurge: Power = withOverrides(base, overrides);
