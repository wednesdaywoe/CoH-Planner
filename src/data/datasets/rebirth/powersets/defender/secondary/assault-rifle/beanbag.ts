/**
 * Beanbag — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Beanbag as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/assault-rifle/beanbag';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/assault-rifle/beanbag';

export const Beanbag: Power = withOverrides(base, overrides);
