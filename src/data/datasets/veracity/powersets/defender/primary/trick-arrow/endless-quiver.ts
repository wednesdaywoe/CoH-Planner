/**
 * Endless Quiver — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EndlessQuiver as base } from '@/data/datasets/veracity/generated/powersets/defender/primary/trick-arrow/endless-quiver';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/defender/primary/trick-arrow/endless-quiver';

export const EndlessQuiver: Power = withOverrides(base, overrides);
