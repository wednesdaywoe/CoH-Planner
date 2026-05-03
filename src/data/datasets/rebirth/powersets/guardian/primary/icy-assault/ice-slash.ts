/**
 * Ice Slash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault icy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceSlash as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/icy-assault/ice-slash';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/icy-assault/ice-slash';

export const IceSlash: Power = withOverrides(base, overrides);
