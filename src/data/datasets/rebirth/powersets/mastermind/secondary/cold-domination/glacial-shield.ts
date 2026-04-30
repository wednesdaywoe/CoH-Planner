/**
 * Glacial Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GlacialShield as base } from '@/data/generated/powersets/mastermind/secondary/cold-domination/glacial-shield';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/cold-domination/glacial-shield';

export const GlacialShield: Power = withOverrides(base, overrides);
