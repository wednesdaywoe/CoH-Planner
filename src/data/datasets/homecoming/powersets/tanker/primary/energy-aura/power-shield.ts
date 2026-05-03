/**
 * Power Shield — COMPOSED EXPORT
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
import { PowerShield as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/energy-aura/power-shield';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/energy-aura/power-shield';

export const PowerShield: Power = withOverrides(base, overrides);
