/**
 * Glue Arrow — COMPOSED EXPORT
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
import { GlueArrow as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/trick-arrow/glue-arrow';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/trick-arrow/glue-arrow';

export const GlueArrow: Power = withOverrides(base, overrides);
