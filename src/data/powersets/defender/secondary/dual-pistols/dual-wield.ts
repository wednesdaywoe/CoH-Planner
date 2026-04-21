/**
 * Dual Wield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DualWield as base } from '@/data/generated/powersets/defender/secondary/dual-pistols/dual-wield';
import { overrides } from '@/data/overrides/powersets/defender/secondary/dual-pistols/dual-wield';

export const DualWield: Power = withOverrides(base, overrides);
