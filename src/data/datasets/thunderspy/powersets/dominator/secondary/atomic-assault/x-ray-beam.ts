/**
 * X-Ray Beam — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault atomic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { XRayBeam as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/atomic-assault/x-ray-beam';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/secondary/atomic-assault/x-ray-beam';

export const XRayBeam: Power = withOverrides(base, overrides);
