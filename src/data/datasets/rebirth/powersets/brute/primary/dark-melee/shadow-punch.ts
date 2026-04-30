/**
 * Shadow Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShadowPunch as base } from '@/data/generated/powersets/brute/primary/dark-melee/shadow-punch';
import { overrides } from '@/data/overrides/powersets/brute/primary/dark-melee/shadow-punch';

export const ShadowPunch: Power = withOverrides(base, overrides);
