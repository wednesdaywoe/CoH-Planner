/**
 * Rage — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee super_strength
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Rage as base } from '@/data/generated/powersets/brute/primary/super-strength/rage';
import { overrides } from '@/data/overrides/powersets/brute/primary/super-strength/rage';

export const Rage: Power = withOverrides(base, overrides);
