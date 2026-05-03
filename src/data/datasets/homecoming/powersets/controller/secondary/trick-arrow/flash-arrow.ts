/**
 * Flash Arrow — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff trick_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FlashArrow as base } from '@/data/generated/powersets/controller/secondary/trick-arrow/flash-arrow';
import { overrides } from '@/data/overrides/powersets/controller/secondary/trick-arrow/flash-arrow';

export const FlashArrow: Power = withOverrides(base, overrides);
