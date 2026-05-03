/**
 * Overload — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Overload as base } from '@/data/generated/powersets/tanker/primary/energy-aura/overload';
import { overrides } from '@/data/overrides/powersets/tanker/primary/energy-aura/overload';

export const Overload: Power = withOverrides(base, overrides);
