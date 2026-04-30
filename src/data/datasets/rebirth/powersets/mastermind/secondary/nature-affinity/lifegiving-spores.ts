/**
 * Lifegiving Spores — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LifegivingSpores as base } from '@/data/generated/powersets/mastermind/secondary/nature-affinity/lifegiving-spores';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/nature-affinity/lifegiving-spores';

export const LifegivingSpores: Power = withOverrides(base, overrides);
