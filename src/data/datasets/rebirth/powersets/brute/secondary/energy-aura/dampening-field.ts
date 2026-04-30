/**
 * Dampening Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DampeningField as base } from '@/data/datasets/rebirth/generated/powersets/brute/secondary/energy-aura/dampening-field';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/secondary/energy-aura/dampening-field';

export const DampeningField: Power = withOverrides(base, overrides);
