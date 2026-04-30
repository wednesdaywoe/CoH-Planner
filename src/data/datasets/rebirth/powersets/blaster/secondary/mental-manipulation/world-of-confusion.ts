/**
 * World of Confusion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support mental_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WorldofConfusion as base } from '@/data/datasets/rebirth/generated/powersets/blaster/secondary/mental-manipulation/world-of-confusion';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/secondary/mental-manipulation/world-of-confusion';

export const WorldofConfusion: Power = withOverrides(base, overrides);
