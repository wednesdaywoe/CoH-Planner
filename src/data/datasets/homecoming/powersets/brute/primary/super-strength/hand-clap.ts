/**
 * Hand Clap — COMPOSED EXPORT
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
import { HandClap as base } from '@/data/generated/powersets/brute/primary/super-strength/hand-clap';
import { overrides } from '@/data/overrides/powersets/brute/primary/super-strength/hand-clap';

export const HandClap: Power = withOverrides(base, overrides);
