/**
 * EMP Arrow — COMPOSED EXPORT
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
import { EMPArrow as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/secondary/trick-arrow/emp-arrow';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/secondary/trick-arrow/emp-arrow';

export const EMPArrow: Power = withOverrides(base, overrides);
