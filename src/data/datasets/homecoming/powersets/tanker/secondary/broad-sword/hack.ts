/**
 * Hack — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Hack as base } from '@/data/generated/powersets/tanker/secondary/broad-sword/hack';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/broad-sword/hack';

export const Hack: Power = withOverrides(base, overrides);
