/**
 * Energetic Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault kinetic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergeticStrike as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/kinetic-assault/energetic-strike';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/kinetic-assault/energetic-strike';

export const EnergeticStrike: Power = withOverrides(base, overrides);
