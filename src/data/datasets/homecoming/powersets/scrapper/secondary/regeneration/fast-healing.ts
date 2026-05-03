/**
 * Fast Healing — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FastHealing as base } from '@/data/generated/powersets/scrapper/secondary/regeneration/fast-healing';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/regeneration/fast-healing';

export const FastHealing: Power = withOverrides(base, overrides);
