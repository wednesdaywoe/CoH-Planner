/**
 * Gloom — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault dark_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gloom as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/dark-assault/gloom';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/dark-assault/gloom';

export const Gloom: Power = withOverrides(base, overrides);
