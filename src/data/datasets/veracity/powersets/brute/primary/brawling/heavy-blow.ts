/**
 * Heavy Blow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee brawling
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeavyBlow as base } from '@/data/datasets/veracity/generated/powersets/brute/primary/brawling/heavy-blow';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/brute/primary/brawling/heavy-blow';

export const HeavyBlow: Power = withOverrides(base, overrides);
