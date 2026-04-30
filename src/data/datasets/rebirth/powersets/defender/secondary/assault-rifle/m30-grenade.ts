/**
 * M30 Grenade — COMPOSED EXPORT
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
import { M30Grenade as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/assault-rifle/m30-grenade';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/assault-rifle/m30-grenade';

export const M30Grenade: Power = withOverrides(base, overrides);
