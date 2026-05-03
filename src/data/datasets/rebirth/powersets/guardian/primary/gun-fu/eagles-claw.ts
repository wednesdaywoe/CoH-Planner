/**
 * Eagles Claw — COMPOSED EXPORT
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
import { EaglesClaw as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/gun-fu/eagles-claw';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/gun-fu/eagles-claw';

export const EaglesClaw: Power = withOverrides(base, overrides);
