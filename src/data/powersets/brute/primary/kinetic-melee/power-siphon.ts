/**
 * Power Siphon — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerSiphon as base } from '@/data/generated/powersets/brute/primary/kinetic-melee/power-siphon';
import { overrides } from '@/data/overrides/powersets/brute/primary/kinetic-melee/power-siphon';

export const PowerSiphon: Power = withOverrides(base, overrides);
