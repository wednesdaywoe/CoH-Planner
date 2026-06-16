/**
 * Beyond The Veil — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense spectral_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BeyondTheVeilAlive as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/secondary/spectral-aura/beyond-the-veil-alive';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/secondary/spectral-aura/beyond-the-veil-alive';

export const BeyondTheVeilAlive: Power = withOverrides(base, overrides);
