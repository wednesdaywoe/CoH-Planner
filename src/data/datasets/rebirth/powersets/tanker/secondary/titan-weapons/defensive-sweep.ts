/**
 * Defensive Sweep — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee titan_weapons
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DefensiveSweep as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/titan-weapons/defensive-sweep';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/titan-weapons/defensive-sweep';

export const DefensiveSweep: Power = withOverrides(base, overrides);
