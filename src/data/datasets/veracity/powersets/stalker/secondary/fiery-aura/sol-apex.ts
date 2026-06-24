/**
 * Sol Apex — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SolApex as base } from '@/data/datasets/veracity/generated/powersets/stalker/secondary/fiery-aura/sol-apex';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/stalker/secondary/fiery-aura/sol-apex';

export const SolApex: Power = withOverrides(base, overrides);
