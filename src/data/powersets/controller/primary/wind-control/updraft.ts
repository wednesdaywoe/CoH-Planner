/**
 * Updraft — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control wind_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Updraft as base } from '@/data/generated/powersets/controller/primary/wind-control/updraft';
import { overrides } from '@/data/overrides/powersets/controller/primary/wind-control/updraft';

export const Updraft: Power = withOverrides(base, overrides);
