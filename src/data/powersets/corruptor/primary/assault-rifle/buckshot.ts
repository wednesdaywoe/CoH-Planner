/**
 * Buckshot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Buckshot as base } from '@/data/generated/powersets/corruptor/primary/assault-rifle/buckshot';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/assault-rifle/buckshot';

export const Buckshot: Power = withOverrides(base, overrides);
