/**
 * Fortitude — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff empathy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Fortitude as base } from '@/data/generated/powersets/defender/primary/empathy/fortitude';
import { overrides } from '@/data/overrides/powersets/defender/primary/empathy/fortitude';

export const Fortitude: Power = withOverrides(base, overrides);
