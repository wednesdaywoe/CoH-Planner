/**
 * Parry — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Parry as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/broad-sword/parry';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/broad-sword/parry';

export const Parry: Power = withOverrides(base, overrides);
