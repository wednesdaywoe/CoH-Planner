/**
 * Poison Trap — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff traps
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PoisonTrap as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/traps/poison-trap';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/traps/poison-trap';

export const PoisonTrap: Power = withOverrides(base, overrides);
