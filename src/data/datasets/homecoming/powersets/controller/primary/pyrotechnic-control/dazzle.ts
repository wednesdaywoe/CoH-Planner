/**
 * Dazzle — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control pyrotechnic_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Dazzle as base } from '@/data/datasets/homecoming/generated/powersets/controller/primary/pyrotechnic-control/dazzle';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/primary/pyrotechnic-control/dazzle';

export const Dazzle: Power = withOverrides(base, overrides);
