/**
 * Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee super_strength
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Punch as base } from '@/data/generated/powersets/tanker/secondary/super-strength/punch';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/super-strength/punch';

export const Punch: Power = withOverrides(base, overrides);
