/**
 * Spectral Terror — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control illusion_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SpectralTerror as base } from '@/data/datasets/rebirth/generated/powersets/controller/primary/illusion-control/spectral-terror';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/primary/illusion-control/spectral-terror';

export const SpectralTerror: Power = withOverrides(base, overrides);
