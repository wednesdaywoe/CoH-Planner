/**
 * Ball Lightning — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged electrical_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BallLightning as base } from '@/data/generated/powersets/blaster/primary/electrical-blast/ball-lightning';
import { overrides } from '@/data/overrides/powersets/blaster/primary/electrical-blast/ball-lightning';

export const BallLightning: Power = withOverrides(base, overrides);
