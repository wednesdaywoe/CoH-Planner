/**
 * Shield Toss — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShieldToss as base } from '@/data/datasets/veracity/generated/powersets/tanker/primary/shield-defense/shield-toss';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/tanker/primary/shield-defense/shield-toss';

export const ShieldToss: Power = withOverrides(base, overrides);
