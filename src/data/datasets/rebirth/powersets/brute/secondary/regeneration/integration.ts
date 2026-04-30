/**
 * Integration — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Integration as base } from '@/data/datasets/rebirth/generated/powersets/brute/secondary/regeneration/integration';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/secondary/regeneration/integration';

export const Integration: Power = withOverrides(base, overrides);
