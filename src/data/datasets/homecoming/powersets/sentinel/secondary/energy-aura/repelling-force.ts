/**
 * Repelling Force — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RepellingForce as base } from '@/data/generated/powersets/sentinel/secondary/energy-aura/repelling-force';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/energy-aura/repelling-force';

export const RepellingForce: Power = withOverrides(base, overrides);
