/**
 * Build Up — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee sonic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BuildUp as base } from '@/data/generated/powersets/stalker/primary/sonic-melee/build-up';
import { overrides } from '@/data/overrides/powersets/stalker/primary/sonic-melee/build-up';

export const BuildUp: Power = withOverrides(base, overrides);
