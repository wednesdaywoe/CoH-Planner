/**
 * X-Ray Beam — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { XRayBeam as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/radiation-blast/x-ray-beam';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/radiation-blast/x-ray-beam';

export const XRayBeam: Power = withOverrides(base, overrides);
