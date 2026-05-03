/**
 * Sniper Round — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault military_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SniperRound as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/military-assault/sniper-round';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/military-assault/sniper-round';

export const SniperRound: Power = withOverrides(base, overrides);
