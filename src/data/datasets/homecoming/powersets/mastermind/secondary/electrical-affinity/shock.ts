/**
 * Shock — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff shock_therapy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shock as base } from '@/data/generated/powersets/mastermind/secondary/electrical-affinity/shock';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/electrical-affinity/shock';

export const Shock: Power = withOverrides(base, overrides);
