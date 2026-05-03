/**
 * Divine Avalanche — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DivineAvalanche as base } from '@/data/generated/powersets/tanker/secondary/katana/parry';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/katana/parry';

export const DivineAvalanche: Power = withOverrides(base, overrides);
