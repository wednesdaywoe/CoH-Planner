/**
 * Suppress Pain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff pain_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SuppressPain as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/secondary/pain-domination/soothing-aura';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/secondary/pain-domination/soothing-aura';

export const SuppressPain: Power = withOverrides(base, overrides);
