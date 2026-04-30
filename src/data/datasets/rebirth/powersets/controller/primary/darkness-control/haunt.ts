/**
 * Haunt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control darkness_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Haunt as base } from '@/data/datasets/rebirth/generated/powersets/controller/primary/darkness-control/haunt';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/primary/darkness-control/haunt';

export const Haunt: Power = withOverrides(base, overrides);
