/**
 * Taunt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Taunt as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/dual-blades/taunt';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/dual-blades/taunt';

export const Taunt: Power = withOverrides(base, overrides);
