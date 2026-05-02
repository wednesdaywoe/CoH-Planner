/**
 * Radiant Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff radiation_emission
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RadiantAura as base } from '@/data/generated/powersets/defender/primary/radiation-emission/radiation-emission';
import { overrides } from '@/data/overrides/powersets/defender/primary/radiation-emission/radiation-emission';

export const RadiantAura: Power = withOverrides(base, overrides);
