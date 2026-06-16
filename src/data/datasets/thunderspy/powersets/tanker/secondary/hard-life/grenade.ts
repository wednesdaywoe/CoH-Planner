/**
 * Frag 12 — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee hobo_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Grenade as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/secondary/hard-life/grenade';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/secondary/hard-life/grenade';

export const Grenade: Power = withOverrides(base, overrides);
