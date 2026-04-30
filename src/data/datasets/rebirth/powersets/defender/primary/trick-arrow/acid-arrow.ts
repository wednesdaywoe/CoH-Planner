/**
 * Acid Arrow — COMPOSED EXPORT
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
import { AcidArrow as base } from '@/data/generated/powersets/defender/primary/trick-arrow/acid-arrow';
import { overrides } from '@/data/overrides/powersets/defender/primary/trick-arrow/acid-arrow';

export const AcidArrow: Power = withOverrides(base, overrides);
