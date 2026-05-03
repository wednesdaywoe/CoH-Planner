/**
 * Havoc Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee electrical_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HavocPunch as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/electrical-melee/havoc-punch';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/electrical-melee/havoc-punch';

export const HavocPunch: Power = withOverrides(base, overrides);
