/**
 * Battle Agility — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Deflection as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/shield-defense/deflection';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/primary/shield-defense/deflection';

export const Deflection: Power = withOverrides(base, overrides);
