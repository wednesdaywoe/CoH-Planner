/**
 * Flashfire — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control fire_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Flashfire as base } from '@/data/datasets/homecoming/generated/powersets/controller/primary/fire-control/flashfire';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/primary/fire-control/flashfire';

export const Flashfire: Power = withOverrides(base, overrides);
