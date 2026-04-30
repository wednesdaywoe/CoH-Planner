/**
 * Clobber — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee war_mace
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Clobber as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/war-mace/clobber';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/war-mace/clobber';

export const Clobber: Power = withOverrides(base, overrides);
