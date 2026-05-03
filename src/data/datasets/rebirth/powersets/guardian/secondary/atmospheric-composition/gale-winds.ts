/**
 * Gale Winds — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp atmospheric_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GaleWinds as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/atmospheric-composition/gale-winds';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/atmospheric-composition/gale-winds';

export const GaleWinds: Power = withOverrides(base, overrides);
