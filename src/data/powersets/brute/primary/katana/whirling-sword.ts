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
import { TheLotusDrops as base } from '@/data/generated/powersets/brute/primary/katana/whirling-sword';
import { overrides } from '@/data/overrides/powersets/brute/primary/katana/whirling-sword';

export const TheLotusDrops: Power = withOverrides(base, overrides);
