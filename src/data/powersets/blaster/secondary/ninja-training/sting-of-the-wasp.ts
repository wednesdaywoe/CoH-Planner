/**
 * Sting of the Wasp — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support ninja_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StingoftheWasp as base } from '@/data/generated/powersets/blaster/secondary/ninja-training/sting-of-the-wasp';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/ninja-training/sting-of-the-wasp';

export const StingoftheWasp: Power = withOverrides(base, overrides);
