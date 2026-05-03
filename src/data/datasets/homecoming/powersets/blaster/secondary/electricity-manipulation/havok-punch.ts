/**
 * Havoc Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HavocPunch as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/electricity-manipulation/havok-punch';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/electricity-manipulation/havok-punch';

export const HavocPunch: Power = withOverrides(base, overrides);
