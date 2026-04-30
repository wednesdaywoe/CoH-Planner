/**
 * Focused Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FocusedBurst as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/kinetic-melee/focused-burst';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/kinetic-melee/focused-burst';

export const FocusedBurst: Power = withOverrides(base, overrides);
