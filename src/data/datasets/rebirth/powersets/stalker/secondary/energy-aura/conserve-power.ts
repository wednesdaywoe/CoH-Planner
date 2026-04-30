/**
 * Energize — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Energize as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/energy-aura/conserve-power';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/energy-aura/conserve-power';

export const Energize: Power = withOverrides(base, overrides);
