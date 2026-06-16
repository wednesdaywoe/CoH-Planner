/**
 * The Lotus Drops — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WhirlingSword as base } from '@/data/datasets/thunderspy/generated/powersets/brute/primary/katana/whirling-sword';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/brute/primary/katana/whirling-sword';

export const WhirlingSword: Power = withOverrides(base, overrides);
