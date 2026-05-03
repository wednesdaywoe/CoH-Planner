/**
 * Ground Zero — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp radiation_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GroundZero as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/radiation-composition/ground-zero';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/radiation-composition/ground-zero';

export const GroundZero: Power = withOverrides(base, overrides);
