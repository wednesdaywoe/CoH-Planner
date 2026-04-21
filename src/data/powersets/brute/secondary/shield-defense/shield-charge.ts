/**
 * Shield Charge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShieldCharge as base } from '@/data/generated/powersets/brute/secondary/shield-defense/shield-charge';
import { overrides } from '@/data/overrides/powersets/brute/secondary/shield-defense/shield-charge';

export const ShieldCharge: Power = withOverrides(base, overrides);
