/**
 * Smoke Grenade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training night_widow_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SmokeGrenade as base } from '@/data/generated/powersets/arachnos-widow/epic/night-widow-training/nw-smoke-grenade';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/night-widow-training/nw-smoke-grenade';

export const SmokeGrenade: Power = withOverrides(base, overrides);
