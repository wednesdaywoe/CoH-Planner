/**
 * Flash Arrow — COMPOSED EXPORT
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
import { FlashArrow as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/trick-arrow/flash-arrow';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/trick-arrow/flash-arrow';

export const FlashArrow: Power = withOverrides(base, overrides);
