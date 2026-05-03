/**
 * Deflection — COMPOSED EXPORT
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
import { Deflection as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/shield-defense/active-defense';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/shield-defense/active-defense';

export const Deflection: Power = withOverrides(base, overrides);
