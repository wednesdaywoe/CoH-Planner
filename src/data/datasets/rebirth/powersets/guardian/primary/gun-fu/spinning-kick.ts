/**
 * Spinning Kick — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault gun_fu
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SpinningKick as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/gun-fu/spinning-kick';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/gun-fu/spinning-kick';

export const SpinningKick: Power = withOverrides(base, overrides);
