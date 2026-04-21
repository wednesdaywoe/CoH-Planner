/**
 * Soothing Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff pain_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SoothingAura as base } from '@/data/generated/powersets/defender/primary/pain-domination/soothing-aura';
import { overrides } from '@/data/overrides/powersets/defender/primary/pain-domination/soothing-aura';

export const SoothingAura: Power = withOverrides(base, overrides);
