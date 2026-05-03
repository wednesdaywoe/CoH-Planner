/**
 * Focused Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FocusedBurst as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/kinetic-melee/focused-burst';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/kinetic-melee/focused-burst';

export const FocusedBurst: Power = withOverrides(base, overrides);
