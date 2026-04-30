/**
 * Follow Through — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee titan_weapons
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FollowThrough as base } from '@/data/generated/powersets/scrapper/primary/titan-weapons/follow-through';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/titan-weapons/follow-through';

export const FollowThrough: Power = withOverrides(base, overrides);
