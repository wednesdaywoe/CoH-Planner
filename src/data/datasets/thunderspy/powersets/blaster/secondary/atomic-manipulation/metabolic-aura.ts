/**
 * Particle Acceleration — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support radiation_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MetabolicAura as base } from '@/data/datasets/thunderspy/generated/powersets/blaster/secondary/atomic-manipulation/metabolic-aura';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/blaster/secondary/atomic-manipulation/metabolic-aura';

export const MetabolicAura: Power = withOverrides(base, overrides);
