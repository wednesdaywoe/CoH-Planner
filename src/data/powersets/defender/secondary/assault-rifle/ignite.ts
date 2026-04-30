/**
 * Ignite — COMPOSED EXPORT
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
import { Ignite as base } from '@/data/generated/powersets/defender/secondary/assault-rifle/ignite';
import { overrides } from '@/data/overrides/powersets/defender/secondary/assault-rifle/ignite';

export const Ignite: Power = withOverrides(base, overrides);
