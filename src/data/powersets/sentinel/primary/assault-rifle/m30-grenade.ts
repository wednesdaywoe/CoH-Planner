/**
 * M30 Grenade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { M30Grenade as base } from '@/data/generated/powersets/sentinel/primary/assault-rifle/m30-grenade';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/assault-rifle/m30-grenade';

export const M30Grenade: Power = withOverrides(base, overrides);
