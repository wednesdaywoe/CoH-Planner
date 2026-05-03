/**
 * Overgrowth — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff nature_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Overgrowth as base } from '@/data/generated/powersets/defender/primary/nature-affinity/overgrowth';
import { overrides } from '@/data/overrides/powersets/defender/primary/nature-affinity/overgrowth';

export const Overgrowth: Power = withOverrides(base, overrides);
