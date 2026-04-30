/**
 * Jab — COMPOSED EXPORT
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
import { Jab as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/super-strength/jab';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/super-strength/jab';

export const Jab: Power = withOverrides(base, overrides);
