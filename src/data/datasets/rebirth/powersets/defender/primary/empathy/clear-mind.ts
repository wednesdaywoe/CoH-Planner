/**
 * Clear Mind — COMPOSED EXPORT
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
import { ClearMind as base } from '@/data/generated/powersets/defender/primary/empathy/clear-mind';
import { overrides } from '@/data/overrides/powersets/defender/primary/empathy/clear-mind';

export const ClearMind: Power = withOverrides(base, overrides);
