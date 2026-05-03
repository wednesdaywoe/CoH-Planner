/**
 * Ailment Resistance — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AilmentResistance as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/regeneration/revive';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/regeneration/revive';

export const AilmentResistance: Power = withOverrides(base, overrides);
