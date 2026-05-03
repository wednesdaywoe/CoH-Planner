/**
 * Shinobi — COMPOSED EXPORT
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
import { Shinobi as base } from '@/data/generated/powersets/blaster/secondary/ninja-training/kyokan';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/ninja-training/kyokan';

export const Shinobi: Power = withOverrides(base, overrides);
