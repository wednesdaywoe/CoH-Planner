/**
 * Crowd Control — COMPOSED EXPORT
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
import { CrowdControl as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/war-mace/crowd-control';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/war-mace/crowd-control';

export const CrowdControl: Power = withOverrides(base, overrides);
