/**
 * Phantasm — COMPOSED EXPORT
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
import { Phantasm as base } from '@/data/datasets/rebirth/generated/powersets/controller/primary/illusion-control/phantasm';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/primary/illusion-control/phantasm';

export const Phantasm: Power = withOverrides(base, overrides);
