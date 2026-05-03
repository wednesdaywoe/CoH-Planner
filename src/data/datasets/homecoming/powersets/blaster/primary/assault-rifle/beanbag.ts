/**
 * Beanbag — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Beanbag as base } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/assault-rifle/beanbag';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/primary/assault-rifle/beanbag';

export const Beanbag: Power = withOverrides(base, overrides);
