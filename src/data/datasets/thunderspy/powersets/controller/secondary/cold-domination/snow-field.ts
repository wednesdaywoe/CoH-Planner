/**
 * Snow Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SnowField as base } from '@/data/datasets/thunderspy/generated/powersets/controller/secondary/cold-domination/snow-field';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/controller/secondary/cold-domination/snow-field';

export const SnowField: Power = withOverrides(base, overrides);
