/**
 * Dodge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Dodge as base } from '@/data/generated/powersets/brute/secondary/super-reflexes/dodge';
import { overrides } from '@/data/overrides/powersets/brute/secondary/super-reflexes/dodge';

export const Dodge: Power = withOverrides(base, overrides);
