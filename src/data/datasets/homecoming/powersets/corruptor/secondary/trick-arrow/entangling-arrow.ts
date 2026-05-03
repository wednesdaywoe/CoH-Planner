/**
 * Entangling Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EntanglingArrow as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/secondary/trick-arrow/entangling-arrow';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/secondary/trick-arrow/entangling-arrow';

export const EntanglingArrow: Power = withOverrides(base, overrides);
