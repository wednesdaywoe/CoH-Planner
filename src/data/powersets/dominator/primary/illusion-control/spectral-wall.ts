/**
 * Spectral Wall — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control illusion_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SpectralWall as base } from '@/data/generated/powersets/dominator/primary/illusion-control/spectral-wall';
import { overrides } from '@/data/overrides/powersets/dominator/primary/illusion-control/spectral-wall';

export const SpectralWall: Power = withOverrides(base, overrides);
