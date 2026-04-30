/**
 * Havoc Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HavocPunch as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/electricity-assault/havok-punch';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/electricity-assault/havok-punch';

export const HavocPunch: Power = withOverrides(base, overrides);
