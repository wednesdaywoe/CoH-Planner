/**
 * Hurl — COMPOSED EXPORT
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
import { Hurl as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/super-strength/hurl';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/super-strength/hurl';

export const Hurl: Power = withOverrides(base, overrides);
