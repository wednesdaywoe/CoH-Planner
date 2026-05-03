/**
 * Blazing Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BlazingAura as base } from '@/data/datasets/homecoming/generated/powersets/brute/secondary/fiery-aura/blazing-aura';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/secondary/fiery-aura/blazing-aura';

export const BlazingAura: Power = withOverrides(base, overrides);
