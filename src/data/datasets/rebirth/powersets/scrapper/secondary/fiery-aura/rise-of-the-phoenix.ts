/**
 * Rise of the Phoenix — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense fiery_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RiseofthePhoenix as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/fiery-aura/rise-of-the-phoenix';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/fiery-aura/rise-of-the-phoenix';

export const RiseofthePhoenix: Power = withOverrides(base, overrides);
