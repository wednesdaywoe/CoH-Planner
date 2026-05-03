/**
 * Bone Smasher — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault energy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BoneSmasher as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/energy-assault/bone-smasher';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/energy-assault/bone-smasher';

export const BoneSmasher: Power = withOverrides(base, overrides);
