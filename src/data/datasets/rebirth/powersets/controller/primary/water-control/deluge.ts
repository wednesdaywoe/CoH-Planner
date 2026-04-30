/**
 * Deluge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control water_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Deluge as base } from '@/data/generated/powersets/controller/primary/water-control/deluge';
import { overrides } from '@/data/overrides/powersets/controller/primary/water-control/deluge';

export const Deluge: Power = withOverrides(base, overrides);
