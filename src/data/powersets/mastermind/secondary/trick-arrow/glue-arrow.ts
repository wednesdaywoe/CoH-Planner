/**
 * Glue Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GlueArrow as base } from '@/data/generated/powersets/mastermind/secondary/trick-arrow/glue-arrow';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/trick-arrow/glue-arrow';

export const GlueArrow: Power = withOverrides(base, overrides);
