/**
 * Whirling Mace — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee war_mace
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WhirlingMace as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/war-mace/whirling-mace';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/war-mace/whirling-mace';

export const WhirlingMace: Power = withOverrides(base, overrides);
