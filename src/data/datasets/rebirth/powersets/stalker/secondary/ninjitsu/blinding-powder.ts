/**
 * Blinding Powder — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense ninjitsu
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BlindingPowder as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/ninjitsu/blinding-powder';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/ninjitsu/blinding-powder';

export const BlindingPowder: Power = withOverrides(base, overrides);
