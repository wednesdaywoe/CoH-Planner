/**
 * Aria of Stasis — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control symphony_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AriaofStasis as base } from '@/data/generated/powersets/controller/primary/symphony-control/aria-of-stasis';
import { overrides } from '@/data/overrides/powersets/controller/primary/symphony-control/aria-of-stasis';

export const AriaofStasis: Power = withOverrides(base, overrides);
